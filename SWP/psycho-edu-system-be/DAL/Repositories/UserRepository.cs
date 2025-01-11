using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly MindAidContext _mindAidContext;

        public UserRepository(MindAidContext context) : base(context)
        {
            _mindAidContext = context;
        }



        // tìm kiếm người dùng theo tên 
        public async Task<User> GetUserByUserNameAsync(string userName)
        {
            return await _mindAidContext.Users.FirstOrDefaultAsync(u => u.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase));
        }

        // gmail
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _mindAidContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> IsUserExistAsync(string userName, string email)
        {
            return await _mindAidContext.Users
                .AnyAsync(u => u.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase) ||
                               u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }


    }
}
