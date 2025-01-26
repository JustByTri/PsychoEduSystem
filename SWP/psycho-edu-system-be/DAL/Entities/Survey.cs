using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Survey
    {
        [Key]
        public Guid SurveyId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Boolean IsPublic { get; set; }
        public DateTime? UpdateAt { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }
    }
}
