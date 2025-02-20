using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DAL.Entities.DimensionHealth;

namespace DAL.Entities
{
    public class MentalHealthPointDetail
    {
        [Key]
        public Guid MentalHPDetailId { get; set; }
        public Guid MentalHPId { get; set; }
        public int DimensionId { get; set; } // Thay CategoryId bằng DimensionId
        public int HealthPoints { get; set; }


        [ForeignKey("DimensionId")]
        public DimensionHealth Dimension { get; set; }
    }
}
