
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Common.Constant;
using Common.Setting;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace BLL.Service
{
    public static class JwtProvider
    {

        public static string GenerateAccessToken(List<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtSettingModel.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(JwtSettingModel.ExpireDayAccessToken),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = JwtSettingModel.Issuer, // Thêm Issuer
                Audience = JwtSettingModel.Audience // Thêm Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public static string GenerateRefreshToken(List<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtSettingModel.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(JwtSettingModel.ExpireDayRefreshToken), // Thời gian hết hạn
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = JwtSettingModel.Issuer, // Thêm Issuer cho refresh token
                Audience = JwtSettingModel.Audience // Thêm Audience cho refresh token
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static void HandleRefreshToken(string tokenInput, out string accessToken, out string refreshToken)
        {
            List<Claim> claims = DecodeToken(tokenInput);

            // Generate access token
            accessToken = GenerateAccessToken(claims);

            // Generate refresh token
            refreshToken = GenerateRefreshToken(claims);
        }

        public static List<Claim> DecodeToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtSettingModel.SecretKey);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            var claims = jwtToken.Claims.ToList();

            return claims;
        }

        public static bool Validation(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JwtSettingModel.SecretKey);


            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out SecurityToken validatedToken);

            return true;
        }


        /// <summary>
        /// Gets the user id from token
        /// </summary>
        /// <param name="token">The token value.</param>
        /// <returns></returns>
        public static string? GetUserId(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            List<Claim> claims = DecodeToken(token);

            return GetUserId(claims);
        }

        /// <summary>
        /// Gets the user identifier from the list of claim.
        /// </summary>
        /// <param name="claims">The list of the claim.</param>
        /// <returns></returns>
        public static string? GetUserId(List<Claim> claims)
        {
            if (claims.Count == 0)
            {
                Claim claim = claims.FirstOrDefault(c => c.Type == JwtConstant.KeyClaim.userId);

                if (claim != null)
                {
                    return claim.Value;
                }
            }

            return null;
        }

        /// <summary>
        /// Gets the userId by the given http context object.
        /// </summary>
        /// <param name="httpContext">The http context object.</param>
        /// <returns></returns>
        public static string? GetUserId(this HttpContext httpContext)
        {
            string accessToken = GetAccessTokenByHeader(httpContext.Request);

            return GetUserId(accessToken);
        }

        public static string GetRole(this HttpContext httpContext)
        {
            string accessToken = GetAccessTokenByHeader(httpContext.Request);

            return GetRole(accessToken);
        }

        public static string GetRole(this HttpRequest httpRequest)
        {
            string accessToken = GetAccessTokenByHeader(httpRequest);

            return GetRole(accessToken);
        }

        public static string GetRole(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return string.Empty;
            }

            List<Claim> claims = DecodeToken(token);

            return GetRole(claims);
        }

        public static string GetRole(List<Claim> claims)
        {
            if (claims.Count == 0)
            {
                Claim claim = claims.FirstOrDefault(c => c.Type == JwtConstant.KeyClaim.Role);

                if (claim != null)
                {
                    return claim.Value;
                }
            }

            return string.Empty;
        }

        /// <summary>
        /// Gets the userId by the given http request object.
        /// </summary>
        /// <param name="httpRequest">The http request object.</param>
        /// <returns></returns>
        public static string? GetUserId(this HttpRequest httpRequest)
        {
            string accessToken = GetAccessTokenByHeader(httpRequest);

            if (string.IsNullOrEmpty(accessToken))
            {
                return null;
            }

            return GetUserId(accessToken);
        }

        public static string GetAccessTokenByHeader(this HttpRequest httpRequest)
        {
            string authorization = httpRequest.Headers[JwtConstant.Header.Authorization];
            return GetAccessTokenByHeader(authorization);
        }

        public static string GetAccessTokenByHeader(string authorizationValue)
        {
            try
            {
                if (string.IsNullOrEmpty(authorizationValue))
                {
                    return string.Empty;
                }

                // Tách bằng cách sử dụng khoảng trắng
                var parts = authorizationValue.Split(" ");

                // Nếu có 2 phần và phần đầu là "Bearer", trả về phần thứ hai
                if (parts.Length == 2 && parts[0].Equals("Bearer", StringComparison.OrdinalIgnoreCase))
                {
                    return parts[1];
                }

                // Nếu không có tiền tố "Bearer", trả về toàn bộ giá trị
                return parts.Last();
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// Gets the user id from token as Guid
        /// </summary>
        /// <param name="token">The token value.</param>
        /// <returns></returns>
        public static Guid? GetUserIdAsGuid(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            List<Claim> claims = DecodeToken(token);

            return GetUserIdAsGuid(claims);
        }

        /// <summary>
        /// Gets the user identifier from the list of claims as Guid.
        /// </summary>
        /// <param name="claims">The list of the claim.</param>
        /// <returns></returns>
        public static Guid? GetUserIdAsGuid(List<Claim> claims)
        {
            Claim claim = claims.FirstOrDefault(c => c.Type == JwtConstant.KeyClaim.userId);

            if (claim != null && Guid.TryParse(claim.Value, out Guid userId))
            {
                return userId;
            }

            return null;
        }

        /// <summary>
        /// Gets the userId by the given http context object as Guid.
        /// </summary>
        /// <param name="httpContext">The http context object.</param>
        /// <returns></returns>
        public static Guid? GetUserIdAsGuid(this HttpContext httpContext)
        {
            string accessToken = GetAccessTokenByHeader(httpContext.Request);
            return GetUserIdAsGuid(accessToken);
        }


    }
}





