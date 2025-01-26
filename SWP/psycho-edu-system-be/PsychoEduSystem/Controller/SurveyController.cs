using BLL.Interface;
using BLL.Service;
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
        public async Task<IActionResult> ImportSurvey(IFormFile file, [FromForm] string title, [FromForm] string description)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");

            string fileExtension = Path.GetExtension(file.FileName);
            if (fileExtension != ".xls" && fileExtension != ".xlsx")
                return BadRequest("Only Excel files are allowed");

            var result = await _surveyService.ImportSurveyFromExcel(file, title, description);

            if (result != null && result.Any())
                return Ok(result);
            else
                return BadRequest("Failed to import survey");
        }
    }
}
