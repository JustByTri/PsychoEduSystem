using BLL.Interface;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        public readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("username/{userName}")]
        public async Task<IActionResult> GetUserByUserNameAsync(string userName)
        {
            var user = await _userService.GetUserByUserNameAsync(userName);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);

        }



        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync(User newUser)
        {
            var result = await _userService.RegisterUserAsync(newUser);
            if (!result)
            {
                return BadRequest("User Already exist");
            }
            return Ok("User registered successfully");
        }

        [HttpGet]
        public async Task<IActionResult> IsUserExistAsync(string userName, string email)
        {
            var exists = await _userService.IsUserExistAsync(userName, email);
            if (exists)
            {
                return Ok("User exist");
            }
            return NotFound("User does not exist");
        }


    }
}
