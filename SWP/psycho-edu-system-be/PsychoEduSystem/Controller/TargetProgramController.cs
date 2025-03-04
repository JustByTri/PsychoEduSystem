using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TargetProgramController : ControllerBase // ✅ Kế thừa ControllerBase
    {
        private readonly ITargetProgramService _targetProgramService;

        public TargetProgramController(ITargetProgramService targetProgramService)
        {
            _targetProgramService = targetProgramService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddProgramAsync([FromBody] TargetProgramDTO programDto)
        {
            try
            {
                if (programDto == null)
                {
                    return BadRequest("Invalid program data");
                }

                // Gọi service để thêm vào DB
                var createdProgram = await _targetProgramService.AddProgramAsync(programDto);

                // Kiểm tra nếu đối tượng được tạo thành công
                if (createdProgram == null)
                {
                    return StatusCode(500, "Program creation failed");
                }

                // Chỉ trả về các trường cần thiết
                return Ok(new
                {

                    createdProgram.Name,
                    createdProgram.Description,
                    createdProgram.StartDate,
                    createdProgram.MinPoint,
                    createdProgram.Capacity,
                    createdProgram.DimensionId
                });
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết
                Console.WriteLine(ex);
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }



        [HttpGet("list")]
        public async Task<IActionResult> GetAllPrograms()
        {
            var programs = await _targetProgramService.GetAllProgramsAsync();
            return Ok(programs);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProgramAsync(Guid id, [FromBody] TargetProgramDTO programDto)
        {
            if (programDto == null)
            {
                return BadRequest("Invalid program data.");
            }

            var existingProgram = await _targetProgramService.GetProgramByIdAsync(id);
            if (existingProgram == null)
            {
                return NotFound("Program not found.");
            }

            // Cập nhật thông tin từ DTO
            existingProgram.Name = programDto.Name;
            existingProgram.Description = programDto.Description;
            existingProgram.StartDate = programDto.StartDate;
            existingProgram.MinPoint = programDto.MinPoint;
            existingProgram.Capacity = programDto.Capacity;

            await _targetProgramService.UpdateProgramAsync(existingProgram);

            return Ok(new { Message = "Program updated successfully", UpdatedProgram = programDto });
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProgramAsync(Guid id)
        {
            var existingProgram = await _targetProgramService.GetProgramByIdAsync(id);
            if (existingProgram == null)
            {
                return NotFound("Program not found.");
            }

            await _targetProgramService.DeleteProgramAsync(id);
            return Ok("Program deleted successfully.");
        }


        [HttpPost("assign-user/{surveyTakerId}")]
        public async Task<IActionResult> AssignUserToProgram(Guid surveyTakerId)
        {
            var success = await _targetProgramService.AutoAssignUserToProgramAsync(surveyTakerId);

            if (!success)
            {
                return BadRequest("No suitable program found or user already assigned.");
            }

            return Ok("User successfully assigned to a program.");
        }







    }
}