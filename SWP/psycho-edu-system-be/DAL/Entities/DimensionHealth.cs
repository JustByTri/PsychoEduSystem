using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    [Table("Categories")] // <- Định nghĩa bảng thật trong DB
    public class DimensionHealth
    {
        [Key]
        public int DimensionId { get; set; }

        [Required]
        public string DimensionName { get; set; }

        public DateTime CreateAt { get; set; }

        public virtual ICollection<BlogPost> BlogPosts { get; set; }
    }
}
