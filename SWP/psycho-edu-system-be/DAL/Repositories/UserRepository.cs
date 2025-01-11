using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IReposiotories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(MindAidContext context) : base(context) { }
    }
}
