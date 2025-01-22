using BLL.Interface;
using Common.DTO;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrWhiteSpace(loginDTO.Account) || string.IsNullOrWhiteSpace(loginDTO.Password))
            {
                return BadRequest(new { Message = "Account and password are required." });
            }

            var response = await _loginService.LoginAsync(loginDTO.Account, loginDTO.Password);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return StatusCode(response.StatusCode, response);
        }
    }

}
