using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class TargetProgramDTO
    {
        public Guid? ProgramId { get; set; } // Cho phép null
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public int MinPoint { get; set; }
        public int Capacity { get; set; }

        public int DimensionId { get; set; }

        // public string DimensionName { get; set; }

        //public Guid CreatedBy { get; set; }
    }

}