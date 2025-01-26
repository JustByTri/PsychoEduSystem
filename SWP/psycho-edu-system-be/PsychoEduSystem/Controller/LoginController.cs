using BLL.Interface;
using BLL.Services;
using Common.DTO;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
namespace PsychoEduSystem.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {

        private readonly IGoogleAuthService _googleAuthService;

        public LoginController(IGoogleAuthService googleAuthService)
        {

            _googleAuthService = googleAuthService;
        }
        [HttpPost("signin-google")]
        public async Task<IActionResult> SignInGoogle([FromBody] GoogleAuthTokenDTO googleAuthToken)
        {
            var result = await _googleAuthService.SignInWithGoogle(googleAuthToken);

            if (result)
            {
                return Ok(new { message = "Login successful" });
            }
            return BadRequest(new { message = "Login failed" });
        }
    }
}
