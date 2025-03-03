using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IRepositories;

namespace DAL.Repositories
{
    public class TargetProgramRepository : GenericRepository<TargetProgram>, ITargetProgramRepository
    {
        public TargetProgramRepository(MindAidContext context) : base(context) { }
    }
}
