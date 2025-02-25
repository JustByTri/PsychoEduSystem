using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class CreateParentAccountDTO
    {
        public string ParentName { get; set; }
        public string ParentEmail { get; set; }
        public List<StudentRelationshipDTO> StudentRelationships { get; set; } // Danh sách mối quan hệ
    }
}
