using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class MentalHealthPoint
    {
        public Guid UserId { get; set; }
        public Guid MentalHealthPointDetailId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [ForeignKey("MentalHealthPointDetailId")]
        public virtual MentalHealthPointDetail MentalHealthPointDetail { get; set; }
    }
}
