using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class DimensionHealth
    {
        [Key]
        public int DimensionId { get; set; }
        public string DimensionName { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
