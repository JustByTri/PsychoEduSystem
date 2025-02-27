using Common.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interface
{
    public interface IAppointmentService
    {
        Task<ResponseDTO> CreateAppointmentAsync(AppointmentRequestDTO request);
        Task<ResponseDTO> GetAppointmentFromRangeAsyncForStudent(Guid studentId, DateOnly startDate, DateOnly endDate);
        Task<ResponseDTO> GetAppointmentFromRangeAsyncForConsultant(Guid consultantId, DateOnly startDate, DateOnly endDate);
        Task<ResponseDTO> CancelAppointmentAsync(Guid AppointmentId);
        Task<ResponseDTO> DeleteAppointmentAsync();
    }
}
