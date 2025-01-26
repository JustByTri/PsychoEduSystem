using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Relationship
    {
        [Key]
        public Guid RelationshipId { get; set; }
        public string RelationshipType { get; set; }
        public Boolean IsActive { get; set; }
    }
}
