using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class UserTargetProgram
    {
        public Guid UserId { get; set; }
        public Guid ProgramId { get; set; }
        public DateTime JoinDate { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual TargetProgram TargetProgram { get; set; }
    }
}
