using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
   public class User
    {
    
        [Key]
        public Guid UserId { get; set; }
        [Required]
        [MaxLength(30)]
        public  string UserName  {  get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = new byte[32];
        public byte[] PasswordSalt { get; set; } = new byte[32];
        [Required(ErrorMessage = "Phone không được rỗng.")]
        [RegularExpression(@"^(?:\+84|0)[3|5|7|8|9]\d{8}$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string Phone { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email không được rỗng.")]
        [RegularExpression(@"^[\w-\.]+@fpt\.edu\.vn$", ErrorMessage = "Email phải thuộc miền fpt.edu.vn.")]
        public string Email { get; set; } = string.Empty;
        [MaxLength(30)]
        public string FullName {  get; set; } = string.Empty;
        public DateTime BirthDay { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool Status { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime? CreateAt { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<Slot> Slots { get; set; }
        public virtual ICollection<Appointment> StudentAppointments { get; set; }
        public virtual ICollection<Appointment> CounselorAppointments { get; set; }
        public virtual ICollection<Message> SentMessages { get; set; }
        public virtual ICollection<Message> ReceivedMessages { get; set; }
        public virtual ICollection<MentalHealthPoint> MentalHealthPoints { get; set; }
        public virtual ICollection<PsychoQuestionSet> PsychoQuestions { get; set; }

    }
}
