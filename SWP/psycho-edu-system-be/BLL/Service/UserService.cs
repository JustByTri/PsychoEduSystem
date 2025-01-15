using System;
using System.Threading.Tasks;
using BLL.Interface;
using BLL.Utilities;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;

using Microsoft.AspNetCore.Identity;

namespace BLL.Service
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserUtility _userUtility;

        public UserService(IUnitOfWork unitOfWork, UserUtility userUtility)
        {
            _unitOfWork = unitOfWork;
            _userUtility = userUtility;
        }

        public async Task<User> GetUserByUserNameAsync(string userName)
        {
            return await _unitOfWork.User.GetUserByUserNameAsync(userName);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _unitOfWork.User.GetUserByEmailAsync(email);
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> RegisterUserAsync(UserRegisterDTO newUserDTO)
        {
            if (await _unitOfWork.User.IsUserExistAsync(newUserDTO.UserName, newUserDTO.Email))
            {
                return false;
            }



            // Mã hóa mật khẩu trước khi lưu
            PasswordHashResultDTO passwordHashResult = _userUtility.CreateHashPassword(newUserDTO.Password);

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash("123456", out passwordHash, out passwordSalt);


            var newUser = new User()
            {
                UserId = Guid.NewGuid(),
                UserName = newUserDTO.UserName,
                Email = newUserDTO.Email,
                Phone = newUserDTO.Phone,
                BirthDay = newUserDTO.BirthDay,
                Gender = newUserDTO.Gender,
                Address = newUserDTO.Address,
                PasswordHash = passwordHashResult.Hash,
                PasswordSalt = passwordHashResult.Salt,
                // Lưu mật khẩu đã mã hóa (salted + hashed)
            };

            await _unitOfWork.User.AddAsync(newUser);
            await _unitOfWork.SaveChangeAsync();
            return true;
        }

        public async Task<bool> IsUserExistAsync(string userName, string email)
        {
            return await _unitOfWork.User.IsUserExistAsync(userName, email);
        }
    }
}
