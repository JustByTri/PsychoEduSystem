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
        public Guid BookedBy { get; set; } // FK to User (người đặt)
        public Guid MeetingWith { get; set; } // FK to User (Counselor/Teacher)
        public string GoogleMeet { get; set; }
        public string Notes { get; set; }
        public bool IsOnline { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsCanceled { get; set; }
        public DateTime CreateAt { get; set; }

        [ForeignKey("SlotId")]
        public Slot Slot { get; set; }
        [ForeignKey("BookedBy")]
        public User Booker { get; set; }
        [ForeignKey("MeetingWith")]
        public User Counselor { get; set; }
    }
}
