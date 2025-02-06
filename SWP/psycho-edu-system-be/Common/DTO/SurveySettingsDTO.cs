using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class SurveySettingsDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Target { get; set; }
    
        public Guid? UserId { get; set; }
    }
}
