using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BLL.Interface;
using BLL.Utilities;
using Common.Constant;
using Common.DTO;
using Common.Setting;
using DAL.Entities;
using DAL.UnitOfWork;

namespace BLL.Service
{
    public class LoginService : ILoginService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly UserUtility _userUtility;

        public LoginService(IUnitOfWork unitOfWork, UserUtility userUtility)
        {
            _unitOfWork = unitOfWork;
            _userUtility = userUtility;

        }

        public async Task<ResponseDTO> LoginAsync(string emailOrUserName, string password)
        {
            if (_unitOfWork.User == null)
            {
                return new ResponseDTO("User repository is not available", 500, false);

            }
            

            // Tìm người dùng theo email
            var user = await _unitOfWork.User.GetByEmailOrUserNameAsync(emailOrUserName);
            if (user == null)
            {
                return new ResponseDTO("User not found", 404, false);
            }

            // Kiểm tra mật khẩu
            if (!_userUtility.VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
            {
                return new ResponseDTO("Invalid password", 400, false);
            }

            if (!user.IsEmailConfirmed)
            {
                return new ResponseDTO("User have not confirmed email yet.", 404, false);
            }

            var existingRefreshToken = await _unitOfWork.RefreshToken.GetActiveTokensByUserId(user.UserId);
            if (existingRefreshToken != null)
            {
                // Nếu đã có refresh token, đánh dấu token cũ là đã bị thu hồi
                existingRefreshToken.IsRevoked = true;
                await _unitOfWork.RefreshToken.UpdateAsync(existingRefreshToken); // Cập nhật token cũ
            }

            // Khởi tạo danh sách claims
            var claims = new List<Claim>();

            // Thêm vai trò vào claims
            if (user.UserRoles != null && user.UserRoles.Any())
            {
                foreach (var userRole in user.UserRoles)
                {
                    var roleName = userRole.Role?.RoleName ?? "Student";
                    claims.Add(new Claim(JwtConstant.KeyClaim.Role, userRole.Role?.RoleName ?? "Student"));
                }
            }
            else
            {
                claims.Add(new Claim(JwtConstant.KeyClaim.Role, "Student")); // Giá trị mặc định nếu không có vai trò
            }
            // Thêm email vào claims
            claims.Add(new Claim(JwtConstant.KeyClaim.Email, user.Email));

            // Thêm UserId vào claims
            claims.Add(new Claim(JwtConstant.KeyClaim.userId, user.UserId.ToString()));

            // Thêm UserName vào claims
            claims.Add(new Claim(JwtConstant.KeyClaim.Username, user.UserName));

            // Thêm fullName vào claims
            var fullName = $"{user.LastName} {user.FirstName}".Trim();
            claims.Add(new Claim(JwtConstant.KeyClaim.fullName, fullName));


            // Tạo refresh token mới
            var refreshTokenKey = JwtProvider.GenerateRefreshToken(claims);
            // Tạo access token
            var accessTokenKey = JwtProvider.GenerateAccessToken(claims);

            var refreshToken = new RefreshToken
            {
                RefreshTokenId = Guid.NewGuid(),
                UserId = user.UserId,
                RefreshTokenKey = refreshTokenKey,
                IsRevoked = false, // Đảm bảo rằng token mới không bị thu hồi
                CreatedAt = DateTime.UtcNow // Lưu thời gian tạo
            };

            _unitOfWork.RefreshToken.Add(refreshToken);
            try
            {
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"Error saving refresh token: {ex.Message}", 500, false);
            }

            return new ResponseDTO("Login successful", 200, true, new
            {
                AccessToken = accessTokenKey,
                RefreshToken = refreshToken.RefreshTokenKey,
                Roles = string.Join(",", user.UserRoles.Select(ur => ur.Role.RoleName)) // Trả về tất cả vai trò
            });



        }

        public async Task<ResponseDTO> RefreshBothTokens(string oldAccessToken, string oldRefreshTokenKey)
        {
            // Kiểm tra tính hợp lệ của refresh token
            var claimsPrincipal = JwtProvider.Validation(oldRefreshTokenKey);
            if (claimsPrincipal == null)
            {
                return new ResponseDTO("Invalid refresh token", 400, false);
            }

            // Lấy đối tượng RefreshToken từ refresh token Key
            var refreshTokenDTO = await _unitOfWork.RefreshToken.GetRefreshTokenByKey(oldRefreshTokenKey);
            if (refreshTokenDTO == null || refreshTokenDTO.IsRevoked)
            {
                return new ResponseDTO("Refresh token not found or has been revoked", 403, false);
            }

            // Kiểm tra nếu refresh token đã hết hạn
            var tokenExpirationDate = refreshTokenDTO.CreatedAt.AddDays(JwtSettingModel.ExpireDayRefreshToken);
            if (DateTime.UtcNow > tokenExpirationDate)
            {
                return new ResponseDTO("Refresh token expired, please login again", 403, false);
            }

            // Lấy thông tin người dùng từ UserId
            var user = await _unitOfWork.User.GetByIdAsync(refreshTokenDTO.UserId);
            if (user == null)
            {
                return new ResponseDTO("User not found", 404, false);
            }

            // Khởi tạo danh sách claims
            var claims = new List<Claim>();

            // Thêm email vào claims
            claims.Add(new Claim(JwtConstant.KeyClaim.Email, user.Email));

            // Thêm vai trò vào claims
            if (user.UserRoles != null && user.UserRoles.Any())
            {
                foreach (var userRole in user.UserRoles)
                {
                    var roleName = userRole.Role?.RoleName ?? "User";
                    claims.Add(new Claim(JwtConstant.KeyClaim.Role, roleName));
                }
            }
            else
            {
                claims.Add(new Claim(JwtConstant.KeyClaim.Role, "User")); // Giá trị mặc định nếu không có vai trò
            }

            // Thêm UserId vào claims
            claims.Add(new Claim(JwtConstant.KeyClaim.userId, user.UserId.ToString()));


            // Tạo access token mới
            var newAccessToken = JwtProvider.GenerateAccessToken(claims);

            // Lưu refresh token mới vào database
            var newRefreshToken = new RefreshToken
            {
                RefreshTokenId = Guid.NewGuid(),
                UserId = user.UserId,
                RefreshTokenKey = oldRefreshTokenKey,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow // Lưu thời gian tạo
            };
            // Xóa refresh token cũ
            _unitOfWork.RefreshToken.Delete(refreshTokenDTO);
            // Thêm refresh token mới
            _unitOfWork.RefreshToken.Add(newRefreshToken);
            try
            {
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"Error refreshing tokens: {ex.Message}", 500, false);
            }

            return new ResponseDTO("Token refreshed successfully", 200, true, new
            {
                NewAccessToken = newAccessToken,
                RefreshToken = oldRefreshTokenKey,
                Role = user.UserRoles // Trả về vai trò
            });

        }

        public async Task<ResponseDTO> LogoutAsync(string refreshTokenKey)
        {
            // Tìm refresh token trong cơ sở dữ liệu
            var refreshToken = await _unitOfWork.RefreshToken.GetRefreshTokenByKey(refreshTokenKey);

            // Kiểm tra xem refresh token có tồn tại không
            if (refreshToken == null)
            {
                return new ResponseDTO("Refresh token not found", 404, false);
            }

            // Đánh dấu refresh token là đã thu hồi
            refreshToken.IsRevoked = true;
            _unitOfWork.RefreshToken.UpdateAsync(refreshToken); // Cập nhật trạng thái token

            try
            {
                await _unitOfWork.SaveChangeAsync();
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"Error during logout: {ex.Message}", 500, false);
            }

            return new ResponseDTO("Logout successful", 200, true);
        }

        public GetUserDTO GetUserByUserId(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;  // Trả về null nếu userId không hợp lệ
            }

            // Chuyển đổi userId sang Guid
            Guid.TryParse(userId, out Guid userIdGuid);

            // Truy vấn người dùng từ cơ sở dữ liệu
            var user = _unitOfWork.User.FindAll(a => a.UserId == userIdGuid).FirstOrDefault();

            if (user == null)
            {
                return null;  // Trả về null nếu không tìm thấy user
            }

            // Ánh xạ thủ công từ User sang GetUserDTO
            var userDTO = new GetUserDTO
            {

                UserName = user.UserName,
                Email = user.Email,
                BirthDay = user.BirthDay,
                // Ánh xạ thêm các thuộc tính khác nếu có
            };

            return userDTO;
        }

        private string ExtractUserIdFromToken(string accessToken)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(accessToken);
                var expiration = jwtToken.ValidTo;

                if (expiration < DateTime.UtcNow)
                {
                    return null;
                }
                else
                {
                    //  take userId in claim of token
                    var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtConstant.KeyClaim.userId);
                    if (userIdClaim != null)
                    {
                        return userIdClaim.Value;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                return $"Token parsing error: {ex.Message}";
            }
        }

        public ResponseDTO GetUserByAccessToken(string accessToken)
        {
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                return new ResponseDTO("Access Token is empty", 400, false);
            }
            var userId = ExtractUserIdFromToken(accessToken);
            if (userId == null)
            {
                return new ResponseDTO("Fail because token is expired", 400, false);
            }
            if (userId == "Token is not valid")
            {
                return new ResponseDTO("Token is  invalid", 400, false);
            }
            var user = GetUserByUserId(userId);
            if (user == null)
            {
                return new ResponseDTO("Cannot find user", 404, false);
            }
            return new ResponseDTO("Get User Successfully", 200, true, user);
        }

    }

}




