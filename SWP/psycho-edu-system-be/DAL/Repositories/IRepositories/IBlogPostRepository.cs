using DAL.Entities.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories.IRepositories
{
    public interface IBlogPostRepository : IGenericRepository<BlogPost>
    {
        IQueryable<BlogPost> FindAllWithIncludes(Expression<Func<BlogPost, bool>>? expression = null, params Expression<Func<BlogPost, object>>[] includes);
    }
}
