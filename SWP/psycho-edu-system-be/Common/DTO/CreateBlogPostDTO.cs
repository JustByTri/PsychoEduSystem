using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class CreateBlogPostDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int DimensionId { get; set; }
    }
}
