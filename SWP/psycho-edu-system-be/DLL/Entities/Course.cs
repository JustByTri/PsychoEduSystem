using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Course
    {
        [Key]
        public Guid CourseId { get; set; }
        public Guid CategoryId { get; set; }
        public Guid OwnerId { get; set; }
        public string? Title { get; set; }
        [MaxLength(100)]
        public string? Description { get; set; }
        public string? Thumbnail { get; set; }
        public Boolean Status { get; set; }
        public DateTime? UpdateAt { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
        [ForeignKey("OwnerId")]
        public virtual User User { get; set; }
        public virtual ICollection<CourseContent> CourseContents { get; set; }
    }
}
