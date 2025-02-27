using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class TargetProgram
    {
        [Key]
        public Guid ProgramId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public int MinPoint { get; set; }

        public int Capacity { get; set; }

        public Guid CreatedBy { get; set; }
        public DateTime CreateAt { get; set; }

        [ForeignKey("CreatedBy")]
        public User CreatedByUser { get; set; }

        // Khóa ngoại đến DimensionHealth
        public int DimensionId { get; set; }

        [ForeignKey("DimensionId")]
        public DimensionHealth Dimension { get; set; }
    }
}
