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

        public async Task<List<object>> GetAllProgramsAsync() // chọn dữ liệu cần thiết trong API bằng cách sử dụng Anonymous Object.
        {
            var programs = await _unitOfWork.TargetProgram.GetAllAsync();

            return programs.Select(p => new
            {
                p.ProgramId,
                p.Name,
                p.Description,
                p.StartDate,
                p.MinPoint,
                p.Capacity,
                DimensionName = p.Dimension?.DimensionName
            }).ToList<object>(); // Trả về danh sách object để tránh các thuộc tính không mong muốn
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
                // Giả sử admin có UserId là mặc định nếu CreatedBy không được gửi từ API
                Guid defaultUserId = Guid.Parse("50E14522-ACD3-4EB1-9197-37C3CE1137F5");
                //Guid createdBy = dto.CreatedBy == Guid.Empty ? defaultUserId : dto.CreatedBy;

                var newProgram = new TargetProgram
                {
                    ProgramId = Guid.NewGuid(), // Tạo ID tự động
                    Name = dto.Name,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    MinPoint = dto.MinPoint,
                    Capacity = dto.Capacity,
                    //CreatedBy = dto.CreatedBy != Guid.Empty ? dto.CreatedBy : defaultUserId,
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
                    DimensionId = addedProgram.DimensionId,

                };
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error while saving data: {ex.InnerException?.Message ?? ex.Message}";
                Console.WriteLine(errorMessage);  // Log ra console hoặc hệ thống log
                throw new Exception(errorMessage);
            }
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

            _unitOfWork.TargetProgram.UpdateAsync(existingProgram);
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

        public async Task<bool> AutoAssignUserToProgramAsync(Guid surveyTakerId)
        {
            var surveyResponse = await _unitOfWork.SurveyResponse
             .GetLatestSurveyResponseByUserIdAsync(surveyTakerId);
            if (surveyResponse == null) return false;

            // 2️⃣ Xác định chương trình phù hợp dựa trên điểm sức khỏe tâm lý
            var suitableProgram = await _unitOfWork.TargetProgram
                .FindProgramByHealthPointsAsync(surveyResponse.HealthPoints);

            if (suitableProgram == null) return false;

            // 3️⃣ Kiểm tra xem người dùng đã tham gia chương trình chưa
            var existingUserProgram = await _unitOfWork.UserTargetProgram
                .FindByUserAndProgramAsync(surveyTakerId, suitableProgram.ProgramId);

            if (existingUserProgram != null) return false; // Đã tham gia trước đó

            // 4️⃣ Thêm mới vào danh sách tham gia chương trình
            var userProgram = new UserTargetProgram
            {
                UserId = surveyTakerId,
                ProgramId = suitableProgram.ProgramId,
                JoinDate = DateTime.UtcNow
            };

            await _unitOfWork.UserTargetProgram.AddAsync(userProgram);
            //await _unitOfWork.CommitAsync();

            return true;

        }

    }
}
