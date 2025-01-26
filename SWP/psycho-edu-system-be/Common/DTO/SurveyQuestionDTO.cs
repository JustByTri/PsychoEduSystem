using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTO
{
    public class SurveyQuestionDTO
    {
        public string Question { get; set; }
        public List<string> Answers { get; set; }
        public List<int> Points { get; set; }
    }

}
