using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class PsychoQuestionSet
    {
        [Key]
        public Guid SetId { get; set; }
        public virtual User User { get; set; }
        [ForeignKey("OwnerId")]
        public Guid UserId { get; set; }
        public string Description { get; set; } 
        public Boolean IsPublic { get; set; }
        public DateTime? UpdatedTime { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
