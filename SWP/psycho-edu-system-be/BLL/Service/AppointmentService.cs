using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;

namespace BLL.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var appointments = await _unitOfWork.Appointment.GetAllAppointmentsAsync();
            return appointments.Select(a => MapToDTO(a));
        }

        public async Task<AppointmentDTO?> GetAppointmentByIdAsync(Guid id)
        {
            var appointment = await _unitOfWork.Appointment.GetAppointmentByIdAsync(id);
            return appointment != null ? MapToDTO(appointment) : null;

        }

        public async Task<bool> CreateAppointmentAsync(AppointmentDTO appointmentDto)
        {
            var appointment = MapToEntity(appointmentDto);
            await _unitOfWork.Appointment.AddAppointmentAsync(appointment);
            return await _unitOfWork.SaveChangeAsync();
        }

        public async Task<bool> UpdateAppointmentAsync(AppointmentDTO appointmentDto)
        {
            var appointment = MapToEntity(appointmentDto);
            await _unitOfWork.Appointment.UpdateAppointmentAsync(appointment);
            return await _unitOfWork.SaveChangeAsync();
        }

        public async Task<bool> DeleteAppointmentAsync(Guid id)
        {
            await _unitOfWork.Appointment.DeleteAppointmentAsync(id);
            return await _unitOfWork.SaveChangeAsync();
        }

        // ánh xạ DTO 

        private AppointmentDTO MapToDTO(Appointment appointment)
        {
            return new AppointmentDTO
            {
                AppointmentId = appointment.AppointmentId,
                SlotId = appointment.SlotId,
                StudentId = appointment.StudentId,
                OwnerId = appointment.OwnerId,
                BookingDateTime = appointment.BookingDateTime,
                InProgress = appointment.InProgress,
                IsCanceled = appointment.IsCanceled,
                CreateAt = appointment.CreateAt
            };
        }

        private Appointment MapToEntity(AppointmentDTO dto)
        {
            return new Appointment
            {
                AppointmentId = dto.AppointmentId,
                SlotId = dto.SlotId,
                StudentId = dto.StudentId,
                OwnerId = dto.OwnerId,
                BookingDateTime = dto.BookingDateTime,
                InProgress = dto.InProgress,
                IsCanceled = dto.IsCanceled,
                CreateAt = dto.CreateAt
            };
        }





    }
}
