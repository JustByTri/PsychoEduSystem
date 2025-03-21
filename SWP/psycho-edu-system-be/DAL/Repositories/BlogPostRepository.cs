using DAL.Data;
using DAL.Entities.DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class BlogPostRepository : GenericRepository<BlogPost> , IBlogPostRepository
    {
        public BlogPostRepository(MindAidContext context) : base(context) { }
        public IQueryable<BlogPost> FindAllWithIncludes(Expression<Func<BlogPost, bool>>? expression = null, params Expression<Func<BlogPost, object>>[] includes)
        {
            IQueryable<BlogPost> query = _dbSet.AsQueryable();

            if (expression != null)
            {
                query = query.Where(expression);
            }

            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return query;
        }
    }
}
