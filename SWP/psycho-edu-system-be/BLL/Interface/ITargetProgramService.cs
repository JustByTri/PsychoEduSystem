using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Entities;

namespace BLL.Interface
{
    public interface ITargetProgramService
    {
        Task<TargetProgram> AddProgramAsync(TargetProgram program);
        Task<IEnumerable<TargetProgram>> GetAllProgramsAsync();

        Task<TargetProgram> UpdateProgramAsync(TargetProgram program);
        Task<TargetProgram> GetProgramByIdAsync(Guid id);
        Task DeleteProgramAsync(Guid id);




    }
}
