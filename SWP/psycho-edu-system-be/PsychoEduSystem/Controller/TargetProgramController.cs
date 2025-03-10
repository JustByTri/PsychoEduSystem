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
        public async Task<IActionResult> GetAllPrograms([FromQuery] string? day = null, [FromQuery] int? capacity = null, [FromQuery] string? time = null, [FromQuery] int? minPoint = null, [FromQuery] string? dimensionName = null)
        {
            var programs = await _targetProgramService.GetAllProgramsAsync(day, capacity, time, minPoint, dimensionName);
            return Ok(programs);
        }
        [HttpGet("get-programs/{userId}")]
        public async Task<IActionResult> GetAllProgramsByUserIdAsync(Guid userId, [FromQuery] string? day = null, [FromQuery] int? capacity = null, [FromQuery] string? time = null, [FromQuery] int? minPoint = null, [FromQuery] string? dimensionName = null)
        {
            try
            {
                if (userId == Guid.Empty)
                {
                    return BadRequest(new { message = "Invalid userId." });
                }

                var programs = await _targetProgramService.GetAllProgramsByUserIdAsync(userId, day, capacity, time, minPoint, dimensionName);

                if (programs == null || !programs.Any())
                {
                    return NotFound(new { message = "No programs found for the given filters." });
                }

                return Ok(programs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
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

        [HttpPost("assign")]
        public async Task<IActionResult> AssignStudentToTargetProgramAsync([FromBody] StudentDimensionDTO request)
        {
            if (request == null)
                return BadRequest(new ResponseDTO("Invalid request", 400, false, string.Empty));

            var result = await _targetProgramService.AssignStudentToTargetProgramAsync(request);

            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result);

            return Ok(result);
        }
        [HttpGet("counselors")]
        public async Task<IActionResult> GetAvailableCounselors([FromQuery] DateTime selectedDateTime)
        {
            if (selectedDateTime == default)
            {
                return BadRequest(new { message = "Invalid date provided." });
            }

            var response = await _targetProgramService.GetAvailableCounselorsAsync(selectedDateTime);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterTargetProgram([FromBody] RegisterProgramRequest request)
        {
            if (request == null || request.ProgramId == Guid.Empty || request.UserId == Guid.Empty)
            {
                return BadRequest("ProgramId and UserId are required.");
            }

            try
            {
                var response = await _targetProgramService.RegisterTargetProgramAsync(request.ProgramId, request.UserId);

                if (!response.IsSuccess)
                {
                    return BadRequest(response.Message);
                }

                return Ok(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}