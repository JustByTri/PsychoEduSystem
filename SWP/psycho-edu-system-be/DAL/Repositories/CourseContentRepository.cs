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
    public class CourseContentRepository : GenericRepository<CourseContent>, ICourseContentRepository
    {
        public CourseContentRepository(MindAidContext context) : base(context) { }
    }
}
