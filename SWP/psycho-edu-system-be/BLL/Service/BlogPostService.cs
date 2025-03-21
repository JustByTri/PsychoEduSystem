using BLL.Interface.BLL.Interface;
using Common.DTO;
using DAL.Entities.DAL.Entities;
using DAL.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Service
{
    public class BlogPostService : IBlogPostService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogPostService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BlogPostDTO> CreateBlogPostAsync(CreateBlogPostDTO createDto)
        {
            var dimension = await _unitOfWork.DimensionHealth.GetByIdInt(createDto.DimensionId);
            if (dimension == null)
                throw new Exception("Dimension không tồn tại");

            var blogPost = new BlogPost
            {
                BlogPostId = Guid.NewGuid(),
                Title = createDto.Title,
                Content = createDto.Content,
                DimensionId = createDto.DimensionId,
                CreateAt = DateTime.Now
            };

            await _unitOfWork.BlogPost.AddAsync(blogPost);
            await _unitOfWork.SaveChangeAsync();

            return new BlogPostDTO
            {
                BlogPostId = blogPost.BlogPostId,
                Title = blogPost.Title,
                Content = blogPost.Content,
                DimensionName = dimension.DimensionName,
                CreateAt = blogPost.CreateAt,
                UpdateAt = blogPost.UpdateAt
            };
        }

        public async Task<BlogPostDTO> GetBlogPostByIdAsync(Guid id)
        {
            var blogPost = await _unitOfWork.BlogPost.GetByConditionWithIncludesAsync(
                bp => bp.BlogPostId == id,
                bp => bp.Dimension
            );

            if (blogPost == null)
                return null;

            return new BlogPostDTO
            {
                BlogPostId = blogPost.BlogPostId,
                Title = blogPost.Title,
                Content = blogPost.Content,
                DimensionName = blogPost.Dimension.DimensionName,
                CreateAt = blogPost.CreateAt,
                UpdateAt = blogPost.UpdateAt
            };
        }

        public async Task<IEnumerable<BlogPostDTO>> GetAllBlogPostsAsync()
        {
            var blogPosts = await _unitOfWork.BlogPost.FindAllWithIncludes(
                null,
                bp => bp.Dimension
            ).ToListAsync();

            return blogPosts.Select(bp => new BlogPostDTO
            {
                BlogPostId = bp.BlogPostId,
                Title = bp.Title,
                Content = bp.Content,
                DimensionName = bp.Dimension.DimensionName,
                CreateAt = bp.CreateAt,
                UpdateAt = bp.UpdateAt
            });
        }

        public async Task<bool> UpdateBlogPostAsync(Guid id, UpdateBlogPostDTO updateDto)
        {
            var blogPost = await _unitOfWork.BlogPost.GetByIdAsync(id);
            if (blogPost == null)
                return false;

            var dimension = await _unitOfWork.DimensionHealth.GetByIdInt(updateDto.DimensionId);
            if (dimension == null)
                throw new Exception("Dimension không tồn tại");

            blogPost.Title = updateDto.Title;
            blogPost.Content = updateDto.Content;
            blogPost.DimensionId = updateDto.DimensionId;
            blogPost.UpdateAt = DateTime.Now;

            await _unitOfWork.BlogPost.UpdateAsync(blogPost);
            await _unitOfWork.SaveChangeAsync();
            return true;
        }

        public async Task<bool> DeleteBlogPostAsync(Guid id)
        {
            var blogPost = await _unitOfWork.BlogPost.GetByIdAsync(id);
            if (blogPost == null)
                return false;

            _unitOfWork.BlogPost.Delete(blogPost);
            await _unitOfWork.SaveChangeAsync();
            return true;
        }
    }
}

