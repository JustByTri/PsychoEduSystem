using BLL.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    namespace PsychoEduSystem.Controller
    {
        [ApiController]
        [Route("api/[controller]")]
        public class DimensionController : ControllerBase
        {
            private readonly IDimensionService _dimensionHealthService;

            public DimensionController(IDimensionService dimensionHealthService)
            {
                _dimensionHealthService = dimensionHealthService;
            }

            [HttpGet]
            public async Task<IActionResult> GetAllDimensions()
            {
                try
                {
                    var dimensions = await _dimensionHealthService.GetAllDimensionsAsync();
                    return Ok(dimensions);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi: {ex.Message}");
                }
            }
        }
    }
}
