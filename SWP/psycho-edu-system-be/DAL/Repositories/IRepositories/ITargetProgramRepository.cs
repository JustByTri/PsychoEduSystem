using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL.Repositories.IRepositories
{
    public interface ITargetProgramRepository
    {
        Task AddProgamAsync(TargetProgram program);
        Task<IEnumerable<TargetProgram>> GetAllAsync();
        Task<TargetProgram> GetByIdAsync(Guid id);
        void Update(TargetProgram program);
        void Delete(TargetProgram program);

    }
}
