using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class MentalHealthPointDetail
    {
        [Key]
        public Guid MHPDId { get; set; }
        public Guid MHPId { get; set; }
        public MentalHealthPoint MentalHealthPoints { get; set; }
        public int TotalPoint {  get; set; }
        public string Description { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

    }
}
