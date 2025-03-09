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
        Task<List<object>> GetAllProgramsAsync(string? day = null, int? capacity = null, string? time = null, int? minPoint = null, string? dimensionName = null);
        Task<List<object>> GetAllProgramsByUserIdAsync(Guid userId, string? day = null, int? capacity = null, string? time = null, int? minPoint = null, string? dimensionName = null);
        Task<TargetProgramDTO?> GetProgramByIdAsync(Guid programId);
        Task<TargetProgramDTO> AddProgramAsync(TargetProgramDTO dto);
        Task UpdateProgramAsync(TargetProgramDTO dto);
        Task DeleteProgramAsync(Guid? programId);
        //Task<bool> AutoAssignUserToProgramAsync(Guid surveyTakerId);
        Task<ResponseDTO> AssignStudentToTargetProgramAsync(StudentDimensionDTO request);
        Task<ResponseDTO> GetAvailableCounselorsAsync(DateTime selectedDate);
    }
}