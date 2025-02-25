using BLL.Interface;
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
        public async Task<IActionResult> AddProgramAsync([FromBody] TargetProgram program)
        {
            try
            {
                if (program == null)
                {
                    return BadRequest("Invalid program");
                }

                var result = await _targetProgramService.AddProgramAsync(program);
                return Ok(result);
            }
            catch (Exception ex)
            {
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
        public async Task<IActionResult> UpdateProgramAsync(Guid id, [FromBody] TargetProgram updatedProgram)
        {
            if (updatedProgram == null)
            {
                return BadRequest("Invalid program data.");
            }

            var existingProgram = await _targetProgramService.GetProgramByIdAsync(id);
            if (existingProgram == null)
            {
                return NotFound("Program not found.");
            }

            // Cập nhật thông tin
            existingProgram.Title = updatedProgram.Title;
            existingProgram.Date = updatedProgram.Date;
            existingProgram.StartTime = updatedProgram.StartTime;
            existingProgram.EndTime = updatedProgram.EndTime;
            existingProgram.MeetingUrl = updatedProgram.MeetingUrl;
            existingProgram.IsCompleted = updatedProgram.IsCompleted;

            var result = await _targetProgramService.UpdateProgramAsync(existingProgram);
            return Ok(result);
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




    }
}
