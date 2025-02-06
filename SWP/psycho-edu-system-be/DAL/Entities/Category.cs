using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public  class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [MaxLength(30)]
        public string? CategoryName { get; set; }
   
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

        public virtual ICollection<Question> Questions { get; set; }

    }
}
