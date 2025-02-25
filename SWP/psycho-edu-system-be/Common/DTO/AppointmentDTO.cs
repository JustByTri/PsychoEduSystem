using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class AppointmentDTO
    {
        public Guid AppointmentId { get; set; }
        public Guid SlotId { get; set; }
        public Guid StudentId { get; set; }
        public Guid OwnerId { get; set; }
        public DateTime? BookingDateTime { get; set; }
        public bool InProgress { get; set; }
        public bool IsCanceled { get; set; }
        public DateTime? CreateAt { get; set; }
    }
}
