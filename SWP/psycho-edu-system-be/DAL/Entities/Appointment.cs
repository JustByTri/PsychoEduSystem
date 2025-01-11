using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentId { get; set; }
        public Guid SlotId { get; set; }
        public Guid StudentId { get; set; }
        public Guid OwnerId { get; set; }
        public DateTime? BookingDateTime { get; set; }
        public Boolean InProgress { get; set; }
        public Boolean IsCanceled { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }

        [ForeignKey("SlotId")]
        public virtual Slot Slot { get; set; }
        [ForeignKey("StudentId")]
        public virtual User Student { get; set; }
        [ForeignKey("OwnerId")]
        public virtual User Counselor { get; set; }
    }
}
