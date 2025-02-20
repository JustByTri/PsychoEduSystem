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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSurvey(Guid id, [FromBody] UpdateSurveyDTO updateDto)
        {
            var result = await _surveyService.UpdateSurveyAsync(id, updateDto);
            if (!result)
                return NotFound();
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSurveys()
        {
            var surveys = await _surveyService.GetAllSurveysAsync();
            return Ok(surveys);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSurveyById(Guid id)
        {
            var survey = await _surveyService.GetSurveyByIdAsync(id);
            if (survey == null)
                return NotFound();
            return Ok(survey);
        }


    }
}
