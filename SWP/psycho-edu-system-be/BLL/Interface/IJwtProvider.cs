using System.Security.Claims;

namespace BLL.Interface
{
    public interface IJwtService
    {
        /// <summary>
        /// Generate access token based on the claims.
        /// </summary>
        /// <param name="claims">The list of claims for the user.</param>
        /// <returns>A JWT as a string.</returns>
        string GenerateToken(List<Claim> claims);

        /// <summary>
        /// Generate refresh token based on the claims.
        /// </summary>
        /// <param name="claims">The list of claims for the user.</param>
        /// <returns>A refresh JWT as a string.</returns>
        string GenerateRefreshToken(List<Claim> claims);

        /// <summary>
        /// Decode a JWT token and return the claims.
        /// </summary>
        /// <param name="token">The JWT token as a string.</param>
        /// <returns>A list of claims.</returns>
        List<Claim> DecodeToken(string token);

        /// <summary>
        /// Validate a JWT token.
        /// </summary>
        /// <param name="token">The JWT token as a string.</param>
        /// <returns>True if valid; otherwise, false.</returns>
        bool Validation(string token);

        /// <summary>
        /// Verify Google token and return payload.
        /// </summary>
        /// <param name="googleAuthDto">The DTO containing Google auth info.</param>
        /// <returns>Payload from Google.</returns>

        string? GetUserId(string token);

        /// <summary>
        /// Get user role from the provided token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>User role as a string.</returns>
        string GetRole(string token);
    }
}
