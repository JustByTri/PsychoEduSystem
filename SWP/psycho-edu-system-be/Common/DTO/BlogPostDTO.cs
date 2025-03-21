using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class BlogPostDTO
    {
        public Guid BlogPostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string DimensionName { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
}
