using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class MentalHealthPoint
    {
        [Key]
        public Guid MHPId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }
        public User User { get; set; }

        public Guid UserId { get; set; }
        public virtual ICollection<MentalHealthPointDetail> MentalHealthPointDetails { get; set; } // Thêm mối quan hệ với chi tiết điểm

    }
}
