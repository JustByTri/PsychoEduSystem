using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class UserTargetProgram
    {
        [Key]
        public Guid Id { get; set; } // Tạo khóa chính duy nhất

        public Guid UserId { get; set; }
        public Guid ProgramId { get; set; }
        public DateTime JoinDate { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual TargetProgram TargetProgram { get; set; }
    }
}
