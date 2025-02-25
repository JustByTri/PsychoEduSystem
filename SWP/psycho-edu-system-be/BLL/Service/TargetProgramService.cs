using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
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

        public async Task<List<TargetProgramDTO>> GetAllProgramsAsync()
        {
            var programs = await _unitOfWork.TargetProgram.GetAllAsync();

            return programs.Select(p => new TargetProgramDTO
            {
                ProgramId = p.ProgramId,
                Name = p.Name,
                Description = p.Description,
                StartDate = p.StartDate,
                MinPoint = p.MinPoint,
                Capacity = p.Capacity,
                CreatedBy = p.CreatedBy,
                CreateAt = p.CreateAt,
                DimensionId = p.DimensionId
            }).ToList();
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
                CreatedBy = program.CreatedBy,
                CreateAt = program.CreateAt,
                DimensionId = program.DimensionId
            };
        }

        public async Task<TargetProgramDTO> AddProgramAsync(TargetProgramDTO dto)
        {
            // Kiểm tra CreatedBy có hợp lệ không
            if (dto.CreatedBy == Guid.Empty)
            {
                throw new ArgumentException("Invalid CreatedBy. A valid UserId is required.");
            }

            // Kiểm tra xem CreatedBy có tồn tại trong Users không
            var userExists = await _unitOfWork.User.AnyAsync(u => u.UserId == dto.CreatedBy);
            if (!userExists)
            {
                throw new ArgumentException("User with CreatedBy ID does not exist.");
            }

            // Set the CreateAt field to the current UTC time if not provided
            DateTime createAt = DateTime.UtcNow;

            // Ensure DimensionId has a valid value, defaulting to 1 if necessary
            int dimensionId = dto.DimensionId > 0 ? dto.DimensionId : 1;

            var newProgram = new TargetProgram
            {
                ProgramId = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                MinPoint = dto.MinPoint,
                Capacity = dto.Capacity,
                CreatedBy = dto.CreatedBy, // Ensure CreatedBy is set correctly
                CreateAt = createAt, // Set the current UTC time
                DimensionId = dimensionId // Ensure DimensionId is valid
            };

            var addedProgram = await _unitOfWork.TargetProgram.AddAsync(newProgram);
            await _unitOfWork.SaveChangeAsync();

            return new TargetProgramDTO
            {
                ProgramId = addedProgram.ProgramId,
                Name = addedProgram.Name,
                Description = addedProgram.Description,
                StartDate = addedProgram.StartDate,
                MinPoint = addedProgram.MinPoint,
                Capacity = addedProgram.Capacity,
                CreatedBy = addedProgram.CreatedBy,
                CreateAt = addedProgram.CreateAt,
                DimensionId = addedProgram.DimensionId
            };
        }




        public async Task UpdateProgramAsync(TargetProgramDTO dto)
        {
            var existingProgram = await _unitOfWork.TargetProgram.GetByIdAsync(dto.ProgramId);
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

        public async Task DeleteProgramAsync(Guid programId)
        {
            var program = await _unitOfWork.TargetProgram.GetByIdAsync(programId);
            if (program != null)
            {
                _unitOfWork.TargetProgram.Delete(program);
                await _unitOfWork.SaveChangeAsync();
            }
        }
    }
}
