using BLL.Interface;
using Common.Config;
using Common.Constants;
using Common.DTO;
using Common.Constants;
using DAL.Entities;
using DAL.UnitOfWork;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static Google.Apis.Auth.GoogleJsonWebSignature;

namespace BLL.Services
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly GoogleAuthConfig _googleAuthConfig;

        public GoogleAuthService(IUnitOfWork unitOfWork, IOptions<GoogleAuthConfig> googleAuthConfig)
        {
            _unitOfWork = unitOfWork;
            _googleAuthConfig = googleAuthConfig.Value;
        }

        public async Task<bool> SignInWithGoogle(GoogleAuthTokenDTO googleAuthToken)

        {
            // Check if token is valid
            Payload payload;
            try
            {
                payload = await ValidateAsync(googleAuthToken.IdToken, new ValidationSettings
                {
                    Audience = new[] { _googleAuthConfig.ClientId }
                });
            }
            catch (Exception)
            {
                return false;
            }

            // Check if user exists
            var existingUser = await _unitOfWork.User.GetUserByEmailAsync(payload.Email);

            if (existingUser != null)
            {
                return await GenerateTokensForUser(existingUser);
            }

            // Create new user from Google payload
            var newUser = new User
            {
                UserId = Guid.NewGuid(),
                FullName = payload.FamilyName + payload.GivenName,
                Email = payload.Email,
                PasswordHash = new byte[32],
                PasswordSalt = new byte[32],
                
            };

            var role = await _unitOfWork.Role.FirstOrDefaultAsync(r => r.RoleName == "Student");

            if (role == null)
            {
                await EnsureRolesExistAsync();
            }

            _unitOfWork.User.Add(newUser);

            var userRole = new UserRole
            {
                UserId = newUser.UserId,
                RoleId = role.RoleId
            };

            _unitOfWork.UserRole.Add(userRole);

            try
            {
                var result = await _unitOfWork.SaveChangeAsync();
                if (!result)
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }

            return await GenerateTokensForUser(newUser);
        }

        private async Task<bool> GenerateTokensForUser(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(JwtConstant.KeyClaim.Email, user.Email ?? string.Empty),
            new Claim(JwtConstant.KeyClaim.userId, user.UserId.ToString()),
            new Claim(JwtConstant.KeyClaim.Username, user.UserName ?? "Unknown")
        };

            if (user.UserRoles != null)
            {
                foreach (var userRole in user.UserRoles)
                {
                    claims.Add(new Claim(JwtConstant.KeyClaim.Role, userRole.Role?.RoleName ?? "Student"));
                }
            }
            else
            {
                claims.Add(new Claim(JwtConstant.KeyClaim.Role, "Student"));
            }

            var fullName = $"{user.FullName}".Trim();
            claims.Add(new Claim(JwtConstant.KeyClaim.fullName, fullName));

            var refreshTokenKey = JwtProvider.GenerateRefreshToken(claims);
            var accessTokenKey = JwtProvider.GenerateAccessToken(claims);

            var refreshToken = new UserToken
            {
                TokenId = Guid.NewGuid(),
                UserId = user.UserId,
                RefreshToken = refreshTokenKey,
              
                TokenCreated = DateTime.UtcNow
            };

            _unitOfWork.UserToken.Add(refreshToken);

            try
            {
                await _unitOfWork.SaveChangeAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private async Task EnsureRolesExistAsync()
        {
            var studentRole = await _unitOfWork.Role.FirstOrDefaultAsync(r => r.RoleName == "Student");

            if (studentRole == null)
            {
                await _unitOfWork.Role.AddAsync(new Role
                {
                    RoleId = Guid.NewGuid(),
                    RoleName = "Student"
                });
            }

            await _unitOfWork.SaveChangeAsync();
        }
    }
}
