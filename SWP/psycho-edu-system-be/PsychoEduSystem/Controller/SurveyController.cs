using BLL.Interface;
using BLL.Service;
using Common.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveyController : ControllerBase
    {
        private readonly ISurveyService _surveyService;

        public SurveyController(ISurveyService surveyService)
        {
            _surveyService = surveyService;
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportSurvey(IFormFile file, [FromForm] SurveySettingsDTO settings)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            var result = await _surveyService.ImportSurveyFromExcel(file, settings);

            if (result == null)
            {
                return StatusCode(500, "An error occurred while importing the survey.");
            }

            return Ok(result);
        }

    }
}
