using Common.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interface
{
    namespace BLL.Interface
    {
        public interface IBlogPostService
        {
            Task<BlogPostDTO> CreateBlogPostAsync(CreateBlogPostDTO createDto);
            Task<BlogPostDTO> GetBlogPostByIdAsync(Guid id);
            Task<IEnumerable<BlogPostDTO>> GetAllBlogPostsAsync();
            Task<bool> UpdateBlogPostAsync(Guid id, UpdateBlogPostDTO updateDto);
            Task<bool> DeleteBlogPostAsync(Guid id);
        }
    }
}
