using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class AppointmentResponseDTO
    {
        public Guid AppointmentId { get; set; }
        public int SlotId { get; set; }
        public Guid MeetingWith { get; set; }
        public Guid BookedBy { get; set; }
        public Guid AppointmentFor { get; set; }
        public DateOnly Date {  get; set; }
        public bool IsOnline { get; set; }
        public bool IsCompleted { get; set; }
        public bool IsCancelled { get; set; }

    }
}
