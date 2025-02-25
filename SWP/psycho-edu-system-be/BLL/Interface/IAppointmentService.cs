using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.DTO;
using DAL.Entities;

namespace BLL.Interface
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync();
        Task<AppointmentDTO?> GetAppointmentByIdAsync(Guid id);
        Task<bool> CreateAppointmentAsync(AppointmentDTO appointment);
        Task<bool> UpdateAppointmentAsync(AppointmentDTO appointment);
        Task<bool> DeleteAppointmentAsync(Guid id);
    }
}
