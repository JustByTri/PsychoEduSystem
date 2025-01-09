using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Slot
    {
        [Key]
        public Guid SlotId { get; set; }
        public Guid UserId { get; set; }
        public DateTime? SlotDate { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public Boolean IsAvailable { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
