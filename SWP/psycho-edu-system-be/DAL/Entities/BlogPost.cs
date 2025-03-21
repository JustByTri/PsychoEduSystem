using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    namespace DAL.Entities
    {
        public class BlogPost
        {
            public Guid BlogPostId { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public int DimensionId { get; set; }
            public DateTime CreateAt { get; set; }
            public DateTime? UpdateAt { get; set; }     
            public virtual DimensionHealth Dimension { get; set; }
        }
    }
}
