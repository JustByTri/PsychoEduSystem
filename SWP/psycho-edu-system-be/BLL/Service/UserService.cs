using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BLL.Interface;
using DAL.Entities;
using DAL.Repositories.IRepositories;

namespace BLL.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetUserByUserNameAsync(string userName)
        {
            return await _userRepository.GetUserByUserNameAsync(userName);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<bool> RegisterUserAsync(User newUser)
        {
            if (await _userRepository.IsUserExistAsync(newUser.UserName, newUser.Email))
            {
                return false;
            }

            await _userRepository.AddAsync(newUser);
            return true;
        }

        public async Task<bool> IsUserExistAsync(string userName, string email)
        {
            return await _userRepository.IsUserExistAsync($"{userName}", email);
        }
    }
}
