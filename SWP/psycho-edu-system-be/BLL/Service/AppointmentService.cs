using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        public AppointmentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ResponseDTO> CreateAppointmentAsync(AppointmentRequestDTO request)
        {
            try
            {
                var bookedBy = await _unitOfWork.User.GetByIdAsync(request.BookedBy);
                var appointmentFor = await _unitOfWork.User.GetByIdAsync(request.AppointmentFor);
                var meetingWith = await _unitOfWork.User.GetByIdAsync(request.MeetingWith);

                if (bookedBy == null || appointmentFor == null || meetingWith == null)
                {
                    return new ResponseDTO("Required fields not found", 404, false, string.Empty);
                }

                var restrictedRoles = new HashSet<int> { 1, 2, 5 };

                if (restrictedRoles.Contains(bookedBy.RoleId))
                {
                    return new ResponseDTO("Only students or parents can book appointments. Please log in with the appropriate account.", 403, false, string.Empty);
                }

                var availableSchedule = await _unitOfWork.Schedule.GetByConditionAsync(s => s.UserId == meetingWith.UserId && s.Date == DateTime.Parse(request.Date.ToString()) && s.SlotId == request.SlotId);
                
                if (availableSchedule == null)
                {
                    return new ResponseDTO("Meeting date not valid", 400, false, string.Empty);
                }

                var bookedAppointment = await _unitOfWork.Appointment.GetByConditionAsync(s => s.SlotId == request.SlotId && s.Date == request.Date && s.MeetingWith == request.MeetingWith && s.IsCanceled == false);

                if (bookedAppointment != null)
                {
                    return new ResponseDTO("An appointment already exists for the selected date and slot.", 409, false, string.Empty);
                }

                var newAppointment = new Appointment
                {
                    AppointmentId = Guid.NewGuid(),
                    BookedBy = bookedBy.UserId,
                    AppointmentFor = appointmentFor.UserId,
                    MeetingWith = meetingWith.UserId,
                    Date = request.Date,
                    SlotId = request.SlotId,
                    GoogleMeet = string.Empty,
                    IsOnline = request.IsOnline,
                    Notes = string.Empty,
                    IsCompleted = false,
                    IsCanceled = false,
                    CreateAt = DateTime.Now,
                };

                await _unitOfWork.Appointment.AddAsync(newAppointment);
                var result = await _unitOfWork.SaveChangeAsync();

                if (result)
                {
                    return new ResponseDTO("Created appointment success", 200, true, string.Empty);
                }
                
                return new ResponseDTO("Failed to create appointment", 500, false, string.Empty);
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"Error: {ex.Message}", 500, false, string.Empty);
            }
        }
        public Task<ResponseDTO> DeleteAppointmentAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDTO> GetAppointmentFromRangeAsyncForConsultant(Guid consultantId, DateOnly startDate, DateOnly endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return new ResponseDTO("Start date cannot be greater than end date.", 400, false, string.Empty);
                }

                var user = await _unitOfWork.User.GetByIdAsync(consultantId);
                if (user == null)
                {
                    return new ResponseDTO("User not found.", 400, false, string.Empty);
                }

                var appointments = await _unitOfWork.Appointment.GetAllByListAsync(a =>
                    a.MeetingWith == consultantId && a.Date >= startDate && a.Date <= endDate);

                if (appointments == null || !appointments.Any())
                {
                    return new ResponseDTO("No appointments found within the given date range.", 404, false, string.Empty);
                }

                var appointmentList = appointments.Select(a => new AppointmentResponseDTO
                {
                    AppointmentId = a.AppointmentId,
                    MeetingWith = a.MeetingWith,
                    AppointmentFor = a.AppointmentFor,
                    BookedBy = a.BookedBy,
                    Date = a.Date,
                    SlotId = a.SlotId,
                    IsOnline = a.IsOnline,
                    IsCancelled = a.IsCanceled,
                    IsCompleted = a.IsCompleted,
                }).ToList();

                return new ResponseDTO("Appointments retrieved successfully.", 200, true, appointmentList);
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"An error occurred: {ex.Message}", 500, false, string.Empty);
            }
        }

        public async Task<ResponseDTO> GetAppointmentFromRangeAsyncForStudent(Guid studentId, DateOnly startDate, DateOnly endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return new ResponseDTO("Start date cannot be greater than end date.", 400, false, string.Empty);
                }

                var user = await _unitOfWork.User.GetByIdAsync(studentId);
                if (user == null)
                {
                    return new ResponseDTO("User not found.", 400, false, string.Empty);
                }

                var appointments = await _unitOfWork.Appointment.GetAllByListAsync(a =>
                    a.AppointmentFor == studentId && a.Date >= startDate && a.Date <= endDate);

                if (appointments == null || !appointments.Any())
                {
                    return new ResponseDTO("No appointments found within the given date range.", 404, false, string.Empty);
                }

                var appointmentList = appointments.Select(a => new AppointmentResponseDTO
                {
                    AppointmentId = a.AppointmentId,
                    MeetingWith = a.MeetingWith,
                    AppointmentFor = a.AppointmentFor,
                    BookedBy = a.BookedBy,
                    Date = a.Date,
                    SlotId = a.SlotId,
                    IsOnline = a.IsOnline,
                    IsCancelled = a.IsCanceled,
                    IsCompleted = a.IsCompleted,
                }).ToList();

                return new ResponseDTO("Appointments retrieved successfully.", 200, true, appointmentList);
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"An error occurred: {ex.Message}", 500, false, string.Empty);
            }
        }

        public async Task<ResponseDTO> CancelAppointmentAsync(Guid AppointmentId)
        {
            try
            {
                var selectedAppointment = await _unitOfWork.Appointment.GetByIdAsync(AppointmentId);

                if (selectedAppointment == null) return new ResponseDTO("Appointment not found", 400, false, string.Empty);

                if (selectedAppointment.IsCanceled == false)
                {
                    selectedAppointment.IsCanceled = true;
                } else
                {
                    return new ResponseDTO("Appointment has already been cancelled", 200, true, string.Empty);
                }

                _ = await _unitOfWork.SaveChangeAsync();

                return new ResponseDTO("Appointment cancelled successfully", 200, true, string.Empty);
            }
            catch (Exception ex)
            {
                return new ResponseDTO($"An error occurred: {ex.Message}", 500, false, string.Empty);
            }
        }
    }
}
