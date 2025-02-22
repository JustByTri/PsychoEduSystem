﻿using DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace DAL.Data
{
    public class MindAidContext : DbContext
    {
        public MindAidContext(DbContextOptions<MindAidContext> option) : base(option) { }

        #region DbSet Properties
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
   
    
        public DbSet<DimensionHealth> Categories { get; set; }
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Message> Messages { get; set; }
    
        public DbSet<MentalHealthPointDetail> MentalHealthPointDetails { get; set; }
    
        public DbSet<Question> QuestionSets { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Relationship> Relationships { get; set; }
        public DbSet<RequestAppointments> RequestAppointments { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<SurveyResponse> SurveyResponses { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<TargetProgram> TargetPrograms { get; set; }
        public DbSet<ProgramEnrollment> ProgramEnrollments { get; set; }


        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<SurveyAnswerUser> SurveyAnswerUsers { get; set; }

        #endregion

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private User CreateAdminUser()
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash("admin123", out passwordHash, out passwordSalt);
            return new User
            {
                UserId = Guid.NewGuid(),
                UserName = "admin",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Phone = "0123456789",
                Email = "admin@fpt.edu.vn",
                FullName = "Administrator",
                BirthDay = new DateTime(1990, 1, 1),
                Gender = "Male",
                Address = "Ha Noi",
                Status = true,
                CreateAt = DateTime.Now,
                RoleId =  1 ,

            };
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Entity Configurations


            modelBuilder.Entity<User>()
         .HasOne(u => u.Role)
         .WithMany()
         .HasForeignKey(u => u.RoleId);

     
           


            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Slot)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.SlotId);
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Booker) 
                .WithMany(u => u.StudentAppointments)
                .HasForeignKey(a => a.BookedBy) 
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Counselor) 
                .WithMany(u => u.CounselorAppointments)
                .HasForeignKey(a => a.MeetingWith) 
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Student)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Counselor)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ProgramEnrollment>()
    .HasKey(pe => new { pe.ProgramId, pe.StudentId });






            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId);

            


            modelBuilder.Entity<Question>()
                .Property(q => q.CreateAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Answer>()
                .Property(a => a.CreateAt)
                .HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<RequestAppointments>()
    .HasOne(ra => ra.Student)
    .WithMany()
    .HasForeignKey(ra => ra.StudentId)
    .OnDelete(DeleteBehavior.NoAction);  // Change to NoAction

            modelBuilder.Entity<RequestAppointments>()
                .HasOne(ra => ra.Slot)
                .WithMany()
                .HasForeignKey(ra => ra.SlotId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Relationship>()
       .HasOne(r => r.Parent)
       .WithMany()
       .HasForeignKey(r => r.ParentId)
       .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<SurveyResponse>()
     .HasOne(sr => sr.SurveyTaker)
     .WithMany()
     .HasForeignKey(sr => sr.SurveyTakerId)
     .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<SurveyResponse>()
                .HasOne(sr => sr.SurveyTarget)
                .WithMany()
                .HasForeignKey(sr => sr.SurveyTargetId)
                .OnDelete(DeleteBehavior.NoAction); 
        

            modelBuilder.Entity<Relationship>()
                .HasOne(r => r.Student)
                .WithMany()
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<ProgramEnrollment>()
    .HasOne(pe => pe.Student)
    .WithMany()
    .HasForeignKey(pe => pe.StudentId)
    .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Class>()
     .HasOne(c => c.Teacher)
     .WithMany(t => t.ClassList)
     .HasForeignKey(c => c.TeacherId)
     .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Class)
                .WithMany(c => c.Students)
                .HasForeignKey(u => u.ClassId)
                .OnDelete(DeleteBehavior.NoAction);

            var teacherPassword = "teacher123";
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(teacherPassword, out passwordHash, out passwordSalt);

            var teacher1 = new User
            {
                UserId = Guid.NewGuid(),
                UserName = "teacher1",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Phone = "0987654321",
                Email = "teacher1@fpt.edu.vn",
                FullName = "Nguyễn Văn A",
                BirthDay = new DateTime(1985, 5, 15),
                Gender = "Male",
                Address = "Ha Noi",
                Status = true,
                CreateAt = DateTime.Now,
                RoleId = 5, 
                IsEmailConfirmed = true
            };

            var teacher2 = new User
            {
                UserId = Guid.NewGuid(),
                UserName = "teacher2",
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Phone = "0987654322",
                Email = "teacher2@fpt.edu.vn",
                FullName = "Trần Thị B",
                BirthDay = new DateTime(1988, 8, 20),
                Gender = "Female",
                Address = "Ho Chi Minh",
                Status = true,
                CreateAt = DateTime.Now,
                RoleId = 5,
                IsEmailConfirmed = true
            };

            modelBuilder.Entity<User>().HasData(teacher1, teacher2);

            modelBuilder.Entity<Class>().HasData(
                new Class
                {
                    ClassId = 1,
                    Name = "SE1701",
                    TeacherId = teacher1.UserId,
                    CreateAt = DateTime.Now
                },
                new Class
                {
                    ClassId = 2,
                    Name = "SE1702",
                    TeacherId = teacher1.UserId,
                    CreateAt = DateTime.Now
                },
                new Class
                {
                    ClassId = 3,
                    Name = "AI1703",
                    TeacherId = teacher2.UserId,
                    CreateAt = DateTime.Now
                }
            );
            modelBuilder.Entity<ProgramEnrollment>()
                .HasOne(pe => pe.Program)
                .WithMany()
                .HasForeignKey(pe => pe.ProgramId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<SurveyAnswerUser>(entity =>
            {
                entity.HasOne(sau => sau.User)
                    .WithMany()
                    .HasForeignKey(sau => sau.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(sau => sau.Survey)
                    .WithMany()
                    .HasForeignKey(sau => sau.SurveyId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(sau => sau.SurveyResponse)
                    .WithMany()
                    .HasForeignKey(sau => sau.SurveyResponseId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(sau => sau.Question)
                    .WithMany()
                    .HasForeignKey(sau => sau.QuestionId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(sau => sau.Answer)
                    .WithMany()
                    .HasForeignKey(sau => sau.AnswerId)
                    .OnDelete(DeleteBehavior.NoAction);
            });


            #endregion

            #region Seed Data
            modelBuilder.Entity<DimensionHealth>().HasData(
         new DimensionHealth
         {
             DimensionId = 1,
             DimensionName = "Lo Âu",
             CreateAt = DateTime.Now, 
      
         },
         new DimensionHealth
         {
             DimensionId = 2,
             DimensionName = "Trầm Cảm",
             CreateAt = DateTime.Now,
            
         },
         new DimensionHealth
         {
             DimensionId = 3,
             DimensionName = "Căng Thẳng",
             CreateAt = DateTime.Now,
          
         }
     );
           
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Psychologist" },
                new Role { RoleId = 3, RoleName = "Student" },
                new Role { RoleId = 4, RoleName = "Parent" },
                new Role { RoleId = 5, RoleName = "Teacher" }
            );

            var adminUser = CreateAdminUser();
            modelBuilder.Entity<User>().HasData(adminUser);
          
            #endregion
        }

    }
}