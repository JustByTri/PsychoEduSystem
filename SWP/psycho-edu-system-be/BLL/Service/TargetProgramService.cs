using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace BLL.Service
{
    public class TargetProgramService : ITargetProgramService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TargetProgramService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<object>> GetAllProgramsAsync()
        {
            var programs = await _unitOfWork.TargetProgram.GetAll()
                                .Include(p => p.Dimension)
                                .Include(p => p.Counselor)
                                .ToListAsync();

            return programs.Select(p => new
            {
                p.ProgramId,
                p.Name,
                p.Description,
                Day = p.StartDate.ToString("dd/MM/yyyy"),
                Time = p.StartDate.ToString("HH:mm"),
                p.StartDate,
                p.MinPoint,
                p.Capacity,
                Counselor = p.Counselor != null ? new
                {
                    p.Counselor.FullName,
                    p.Counselor.UserId,
                    p.Counselor.Phone,
                    p.Counselor.Email,
                    Birthday = p.Counselor.BirthDay.ToString("dd/MM/yyyy"),
                    p.Counselor.Gender,
                    p.Counselor.Address
                } : null,
                DimensionName = p.Dimension?.DimensionName
            }).ToList<object>();
        }
        public async Task<TargetProgramDTO?> GetProgramByIdAsync(Guid programId)
        {
            var program = await _unitOfWork.TargetProgram.GetByIdAsync(programId);
            if (program == null) return null;

            return new TargetProgramDTO
            {
                ProgramId = program.ProgramId,
                Name = program.Name,
                Description = program.Description,
                StartDate = program.StartDate,
                MinPoint = program.MinPoint,
                Capacity = program.Capacity,
                DimensionId = program.DimensionId
            };
        }
        public async Task<TargetProgramDTO> AddProgramAsync(TargetProgramDTO dto)
        {
            try
            {
                var counselor = await _unitOfWork.User.GetByIdAsync(dto.CounselorId);
                if (counselor == null)
                {
                    throw new InvalidOperationException("Counselor not found.");
                }

                if (counselor.RoleId != 2)
                {
                    throw new UnauthorizedAccessException("Invalid role.");
                }
                TimeSpan startTime = dto.StartDate.TimeOfDay;
                int slotNumber = GetSlotNumber(startTime);
                var availableSlot = await _unitOfWork.Schedule.GetByConditionAsync(s => s.SlotId == slotNumber && DateOnly.FromDateTime(s.Date) == DateOnly.FromDateTime(dto.StartDate));
                if (availableSlot == null)
                {
                    throw new InvalidOperationException("Counselor has no available slots at this time.");
                }
                var appointment = await _unitOfWork.Appointment.GetByConditionAsync(a => a.SlotId == slotNumber && a.Date == DateOnly.FromDateTime(dto.StartDate) && counselor.UserId == a.MeetingWith);
                if (appointment != null)
                {
                    throw new InvalidOperationException("Counselor already has an appointment at this time.");
                }
                var existingPrograms = await _unitOfWork.TargetProgram.GetAllByListAsync(p => p.CounselorId == dto.CounselorId && p.StartDate == dto.StartDate);
                if (existingPrograms.Count() >= 1)
                {
                    throw new InvalidOperationException("This counselor already has a program at this time.");
                }

                var newProgram = new TargetProgram
                {
                    ProgramId = Guid.NewGuid(),
                    Name = dto.Name,
                    Description = dto.Description,
                    CounselorId = counselor.UserId,
                    StartDate = dto.StartDate,
                    MinPoint = dto.MinPoint,
                    Capacity = dto.Capacity,
                    CreateAt = DateTime.UtcNow,
                    DimensionId = dto.DimensionId
                };

                var addedProgram = await _unitOfWork.TargetProgram.AddAsync(newProgram);
                await _unitOfWork.SaveChangeAsync();

                return new TargetProgramDTO
                {
                    Name = addedProgram.Name,
                    Description = addedProgram.Description,
                    StartDate = addedProgram.StartDate,
                    MinPoint = addedProgram.MinPoint,
                    Capacity = addedProgram.Capacity,
                    DimensionId = addedProgram.DimensionId
                };
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error while saving data: {ex.InnerException?.Message ?? ex.Message}";
                Console.WriteLine(errorMessage);
                throw new Exception(errorMessage);
            }
        }
        public int GetSlotNumber(TimeSpan inputTime)
        {
            Dictionary<int, int> timeSlots = new Dictionary<int, int>
            {
                    { 8, 1 }, { 9, 2 }, { 10, 3 }, { 11, 4 },
                    { 13, 5 }, { 14, 6 }, { 15, 7 }, { 16, 8 }
            };
            int hour = inputTime.Hours;
            return timeSlots.TryGetValue(hour, out int slot) ? slot : -1;
        }
        public async Task UpdateProgramAsync(TargetProgramDTO dto)
        {
            if (dto.ProgramId == null) throw new Exception("ProgramId is required");

            var existingProgram = await _unitOfWork.TargetProgram.GetByIdAsync(dto.ProgramId.Value);
            if (existingProgram == null) throw new Exception("Program not found");

            existingProgram.Name = dto.Name;
            existingProgram.Description = dto.Description;
            existingProgram.StartDate = dto.StartDate;
            existingProgram.MinPoint = dto.MinPoint;
            existingProgram.Capacity = dto.Capacity;
            existingProgram.DimensionId = dto.DimensionId;

            await _unitOfWork.TargetProgram.UpdateAsync(existingProgram);
            await _unitOfWork.SaveChangeAsync();
        }
        public async Task DeleteProgramAsync(Guid? programId)
        {
            if (programId == null) throw new Exception("ProgramId is required");

            var program = await _unitOfWork.TargetProgram.GetByIdAsync(programId.Value);
            if (program != null)
            {
                _unitOfWork.TargetProgram.Delete(program);
                await _unitOfWork.SaveChangeAsync();
            }
        }
        public async Task<ResponseDTO> AssignStudentToTargetProgramAsync(StudentDimensionDTO request)
        {
            try
            {
                var user = await _unitOfWork.User.GetByIdAsync(request.StudentId);

                if (user == null) return new ResponseDTO("User not found", 400, false, string.Empty);

                if (string.IsNullOrEmpty(request.Stress.ToString()) || string.IsNullOrEmpty(request.Anxiety.ToString()) || string.IsNullOrEmpty(request.Depression.ToString()))
                {
                    return new ResponseDTO("All fields are required", 400, false, string.Empty);
                }
                var targetPrograms = await _unitOfWork.TargetProgram.GetAllByListAsync(p =>
                                    ((p.DimensionId == 1 && request.Anxiety >= p.MinPoint) ||
                                    (p.DimensionId == 2 && request.Depression >= p.MinPoint) ||
                                    (p.DimensionId == 3 && request.Stress >= p.MinPoint)) &&
                                    p.Capacity > 0);
                if (!targetPrograms.Any())
                    return new ResponseDTO("No matching programs found", 404, false, string.Empty);

                var assignedPrograms = new List<string>();

                foreach (var program in targetPrograms)
                {
                    var existingEnrollment = await _unitOfWork.ProgramEnrollment.GetAllByListAsync(e =>
                        e.StudentId == request.StudentId && e.ProgramId == program.ProgramId);

                    if (!existingEnrollment.Any())
                    {
                        var enrollment = new ProgramEnrollment
                        {
                            StudentId = request.StudentId,
                            ProgramId = program.ProgramId,
                            EnrolledAt = DateTime.UtcNow,
                            CreateAt = DateTime.UtcNow
                        };

                        await _unitOfWork.ProgramEnrollment.AddAsync(enrollment);
                        assignedPrograms.Add(program.Name);

                        program.Capacity -= 1;
                        await _unitOfWork.TargetProgram.UpdateAsync(program);
                    }
                }

                await _unitOfWork.SaveChangeAsync();

                if (!assignedPrograms.Any())
                    return new ResponseDTO("Student is already enrolled in all matching programs", 200, true, string.Empty);

                return new ResponseDTO($"Student assigned to: {string.Join(", ", assignedPrograms)}", 200, true, string.Empty);

            }
            catch (Exception ex)
            {
                return new ResponseDTO($"Error: {ex.Message}", 500, false, string.Empty);
            }
        }
    }
}
