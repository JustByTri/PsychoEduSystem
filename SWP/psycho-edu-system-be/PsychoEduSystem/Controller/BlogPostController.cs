using BLL.Interface.BLL.Interface;
using Common.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    namespace PsychoEduSystem.Controller
    {
        [ApiController]
        [Route("api/[controller]")]
        public class BlogPostController : ControllerBase
        {
            private readonly IBlogPostService _blogPostService;

            public BlogPostController(IBlogPostService blogPostService)
            {
                _blogPostService = blogPostService;
            }

            [HttpPost]
            public async Task<IActionResult> CreateBlogPost([FromBody] CreateBlogPostDTO createDto)
            {
                try
                {
                    var result = await _blogPostService.CreateBlogPostAsync(createDto);
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            [HttpGet]
            public async Task<IActionResult> GetAllBlogPosts()
            {
                var blogPosts = await _blogPostService.GetAllBlogPostsAsync();
                return Ok(blogPosts);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> GetBlogPostById(Guid id)
            {
                var blogPost = await _blogPostService.GetBlogPostByIdAsync(id);
                if (blogPost == null)
                    return NotFound();
                return Ok(blogPost);
            }

            [HttpPut("{id}")]
            public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] UpdateBlogPostDTO updateDto)
            {
                var result = await _blogPostService.UpdateBlogPostAsync(id, updateDto);
                if (!result)
                    return NotFound();
                return NoContent();
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteBlogPost(Guid id)
            {
                var result = await _blogPostService.DeleteBlogPostAsync(id);
                if (!result)
                    return NotFound();
                return NoContent();
            }
        }
    }
}
