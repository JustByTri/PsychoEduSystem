﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Entities;
using Common.DTO;


namespace BLL.Interface
{
    public interface IUserService
    {
        Task<User> GetUserByUserNameAsync(string userName);
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> RegisterUserAsync(UserRegisterDTO newUser);
        Task<bool> IsUserExistAsync(string userName, string email);
        Task<(bool Success, List<string> Errors)> CreateAccountAsync(CreateAccountDTO accountDTO);
        Task<ResponseDTO> RetrieveUserClassInfoAsync(Guid studentId);
        Task<ResponseDTO> GetAvailableSlotsAsync(Guid userId, DateOnly date);
        Task<ResponseDTO> GetPsychologistsAsync();
        Task<ResponseDTO> GetUserProfile(Guid userId);
    }
}
