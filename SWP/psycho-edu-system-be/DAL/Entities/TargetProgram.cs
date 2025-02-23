using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class TargetProgram
    {
        [Key]
        public Guid ProgramId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }    
        public int MinPoint { get; set; }
        public int Capacity { get; set; }
        public Guid CreateBy { get; set; }
        public DateTime CreateAt { get; set; }

        [ForeignKey("CreateBy")]
        public User CreatedByUser { get; set; }
        [ForeignKey("Demension")]
        public int DemensionId  { get; set; }
        public DimensionHealth Demension { get; set; }
    }

}
