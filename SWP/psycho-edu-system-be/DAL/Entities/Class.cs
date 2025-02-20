using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Class
    {
        [Key]
        public Guid ClassId { get; set; }
        public string Name { get; set; }
        public Guid TeacherId { get; set; }
        public DateTime CreateAt { get; set; }

        [ForeignKey("TeacherId")]
        public User Teacher { get; set; }
    }
}
