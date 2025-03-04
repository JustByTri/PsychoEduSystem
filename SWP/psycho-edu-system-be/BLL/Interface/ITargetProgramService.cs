using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.DTO;
using DAL.Entities;

namespace BLL.Interface
{
    public interface ITargetProgramService
    {
        Task<List<object>> GetAllProgramsAsync();
        Task<TargetProgramDTO?> GetProgramByIdAsync(Guid programId);
        Task<TargetProgramDTO> AddProgramAsync(TargetProgramDTO dto);
        Task UpdateProgramAsync(TargetProgramDTO dto);
        Task DeleteProgramAsync(Guid? programId);
        Task<bool> AutoAssignUserToProgramAsync(Guid surveyTakerId);


    }



}
