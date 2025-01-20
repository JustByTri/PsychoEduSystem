using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Common.DTO;
using Microsoft.AspNetCore.Http;

namespace BLL.Utilities
{
    public class UserUtility
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserUtility(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        const int keySize = 64;
        const int iterations = 350000;

        HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

        public PasswordHashResultDTO CreateHashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password.Trim()), salt, iterations, hashAlgorithm, keySize);

            return new PasswordHashResultDTO(hash, salt);

        }

        public bool VerifyPassword(string password, byte[] hash, byte[] salt)
        {
            // Kiểm tra nếu password, hash hoặc salt là null
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty.");
            }

            if (hash == null)
            {
                throw new ArgumentNullException(nameof(hash), "Password hash cannot be null.");
            }

            if (salt == null)
            {
                throw new ArgumentNullException(nameof(salt), "Password salt cannot be null.");
            }

            // Trim password để loại bỏ khoảng trắng thừa
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password.Trim(), salt, iterations, hashAlgorithm, keySize);

            // So sánh hash đã tính toán và hash đã lưu
            return CryptographicOperations.FixedTimeEquals(hashToCompare, hash);
        }


    }



}
