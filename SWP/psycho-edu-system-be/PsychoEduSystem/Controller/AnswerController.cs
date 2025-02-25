using BLL.Interface;
using Common.DTO;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace PsychoEduSystem.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService _answerService;

        public AnswerController(IAnswerService answerService)
        {
            _answerService = answerService;
        }

        // GET api/answer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AnswerDTO>> GetAnswerById(Guid id)
        {
            try
            {
                var answer = await _answerService.GetAnswerByIdAsync(id);

                if (answer == null)
                {
                    return NotFound();
                }

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddAnswer([FromBody] AnswerDTO answerDTO)
        {
            if (answerDTO == null)
            {
                return BadRequest("AnswerDTO cannot be null");
            }

            try
            {
                await _answerService.AddAnswerAsync(answerDTO);

                return CreatedAtAction(nameof(GetAnswerById), new { id = answerDTO.AnswerId }, answerDTO);
            }
            catch (Exception ex)
            {
                // Log exception (nếu cần)
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
