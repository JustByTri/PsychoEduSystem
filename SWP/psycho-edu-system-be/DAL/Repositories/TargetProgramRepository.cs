using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class TargetProgramRepository : GenericRepository<TargetProgram>, ITargetProgramRepository

    {
        private readonly MindAidContext _mindAidContext;
        public TargetProgramRepository(MindAidContext context) : base(context)
        {
            _mindAidContext = context;
        }

        public async Task AddProgamAsync(TargetProgram program)
        {
            await _mindAidContext.AddRangeAsync(program);
        }

        public async Task<IEnumerable<TargetProgram>> GetAllAsync()
        {
            return await _mindAidContext.targetPrograms.ToListAsync();
        }

        public async Task<TargetProgram> GetByIdAsync(Guid id)
        {
            return await _mindAidContext.targetPrograms.FirstAsync();
        }

        public void Update(TargetProgram program)
        {
            _mindAidContext.targetPrograms.Update(program);
        }

        public void Delete(TargetProgram program)
        {
            _mindAidContext.targetPrograms.Remove(program);
        }



    }
}
