using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Entities;

namespace BLL.Interface
{
    public interface IUserService
    {

        Task<User> GetUserByUserNameAsync(string userName);
        Task<User> GetUserByEmailAsync(string email);
        Task<bool> RegisterUserAsync(User newUser);
        Task<bool> IsUserExistAsync(string userName, string email);

    }
}
