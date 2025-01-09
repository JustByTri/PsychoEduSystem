using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class CourseContent
    {
        [Key]
        public Guid CourseContentId { get; set; }
        public Guid CourseId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int Position { get; set; }
        public string? ContentType { get; set; }
        public DateTime? UpdateAt { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }
     
    }
}
