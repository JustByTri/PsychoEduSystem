using BLL.Interface;
using Common.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class MentalHealthPointController : ControllerBase
    {
        private readonly IMentalHealthPointService _mentalHealthPointService;

        public MentalHealthPointController(IMentalHealthPointService mentalHealthPointService)
        {
            _mentalHealthPointService = mentalHealthPointService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddMentalHealthPoints([FromBody] MentalHealthPointInputDTO input)
        {
            if (input == null)
            {
                return BadRequest("Input is required.");
            }

            var response = await _mentalHealthPointService.AddMentalHealthPoints(input);
            return Ok(response); 
        }
    }
}
