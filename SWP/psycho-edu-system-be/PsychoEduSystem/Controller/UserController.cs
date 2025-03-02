using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

using Octokit;
using BLL.Utilities;

namespace PsychoEduSystem.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Lấy thông tin người dùng bằng username
        [HttpGet("username/{userName}")]
        public async Task<IActionResult> GetUserByUserNameAsync(string userName)
        {
            try
            {
                var user = await _userService.GetUserByUserNameAsync(userName);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync(UserRegisterDTO newUserDTO)
        {
            try
            {
                // Kiểm tra người dùng đã tồn tại chưa (kiểm tra cả tên đăng nhập và email)
                var existingUserByUserName = await _userService.GetUserByUserNameAsync(newUserDTO.UserName);
                var existingUserByEmail = await _userService.GetUserByEmailAsync(newUserDTO.Email);

                if (existingUserByUserName != null)
                {
                    return BadRequest(new { Message = "User with this username already exists" });
                }
                if (existingUserByEmail != null)
                {
                    return BadRequest(new { Message = "User with this email already exists" });
                }




                // Đăng ký người dùng mới
                var result = await _userService.RegisterUserAsync(newUserDTO); // Sử dụng newUserDTO ở đây
                if (result)
                {
                    return Ok(new { Message = "User registered successfully!" });
                }

                return BadRequest(new { Message = "An error occurred during registration" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while registering the user", Error = ex.Message });
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile(Guid userId)
        {
            if (Guid.Empty == userId) return BadRequest("User ID is required.");

            try
            {
                var response = await _userService.GetUserProfile(userId);

                if (response.IsSuccess && response.Result != null)
                {
                    return Ok(response);
                }

                return NotFound(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching user profile.", Error = ex.Message });
            }
        }



        // Kiểm tra sự tồn tại của người dùng qua username hoặc email
        [HttpGet("check-existence")]
        public async Task<IActionResult> IsUserExistAsync([FromQuery] string userName, [FromQuery] string email)
        {
            try
            {
                var exists = await _userService.IsUserExistAsync(userName, email);
                if (exists)
                {
                    return Ok(new { Message = "User exists" });
                }
                return NotFound(new { Message = "User does not exist" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while checking user existence.", Error = ex.Message });
            }
        }
        [HttpPost("create-parent-account")]
        public async Task<IActionResult> CreateParentAccount([FromBody] CreateParentAccountDTO parentAccountDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.CreateParentAccountAsync(parentAccountDTO);
            if (!result)
            {
                return BadRequest("Failed to create parent account. Please check the student emails or parent email.");
            }

            return Ok("Parent account and relationships created successfully.");
        }
        [HttpGet("{studentId}/class")]
        public async Task<IActionResult> RetrieveUserClassInfo(Guid studentId)
        {
            if (studentId == Guid.Empty)
                return BadRequest("Invalid student ID.");

            var response = await _userService.RetrieveUserClassInfoAsync(studentId);

            if (response == null)
                return NotFound("Class information not found for the given student ID.");

            return Ok(response);
        }
        [HttpGet("{userId}/slots")]
        public async Task<IActionResult> GetAvailableSlots(Guid userId, [FromQuery] DateOnly selectedDate)
        {
            if (userId == Guid.Empty)
                return BadRequest("Invalid user ID.");

            var response = await _userService.GetAvailableSlotsAsync(userId, selectedDate);

            if (!response.IsSuccess || response.Result == null)
                return NotFound(response.Message);

            return Ok(response);
        }
    }
}
