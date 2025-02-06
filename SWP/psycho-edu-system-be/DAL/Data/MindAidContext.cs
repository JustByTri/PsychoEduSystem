using DAL.Entities;
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
        public DbSet<UserRole> UserRoles { get; set; }
    
        public DbSet<Category> Categories { get; set; }
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MentalHealthPoint> MentalHealthPoints { get; set; }
        public DbSet<MentalHealthPointDetail> MentalHealthPointDetails { get; set; }
    
        public DbSet<Question> QuestionSets { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Relationship> Relationships { get; set; }
        public DbSet<RequestAppointments> RequestAppointments { get; set; }
        public DbSet<Survey> Surveys { get; set; }
        public DbSet<Video> Videos { get; set; }


        public DbSet<RefreshToken> RefreshTokens { get; set; }

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
                CreateAt = DateTime.Now
            };
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Entity Configurations


            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);


        



            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Slot)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.SlotId);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Student)
                .WithMany(u => u.StudentAppointments)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Counselor)
                .WithMany(u => u.CounselorAppointments)
                .HasForeignKey(a => a.OwnerId)
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


            modelBuilder.Entity<RefreshToken>()
                .HasKey(mhp => new { mhp.UserId, mhp.RefreshTokenId });
            modelBuilder.Entity<MentalHealthPoint>()
                .HasKey(mhp => new { mhp.UserId, mhp.MentalHealthPointDetailId });

            modelBuilder.Entity<MentalHealthPoint>()
                .HasOne(mhp => mhp.User)
                .WithMany(u => u.MentalHealthPoints)
                .HasForeignKey(mhp => mhp.UserId);

            modelBuilder.Entity<MentalHealthPoint>()
                .HasOne(mhp => mhp.MentalHealthPointDetail)
                .WithOne(mhpd => mhpd.MentalHealthPoints)
                .HasForeignKey<MentalHealthPoint>(mhp => mhp.MentalHealthPointDetailId);



            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId);

            // Configure automatic creation of CreateAt


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
            #endregion

            #region Seed Data
            modelBuilder.Entity<Category>().HasData(
         new Category
         {
             CategoryId = 1,
             CategoryName = "Lo Âu",
             CreateAt = DateTime.Now, 
      
         },
         new Category
         {
             CategoryId = 2,
             CategoryName = "Trầm Cảm",
             CreateAt = DateTime.Now,
            
         },
         new Category
         {
             CategoryId = 3,
             CategoryName = "Căng Thẳng",
             CreateAt = DateTime.Now,
          
         }
     );
            var adminRoleId = Guid.NewGuid();
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = adminRoleId, RoleName = "Admin" },
                new Role { RoleId = Guid.NewGuid(), RoleName = "Psychologist" },
                new Role { RoleId = Guid.NewGuid(), RoleName = "Student" },
                new Role { RoleId = Guid.NewGuid(), RoleName = "Parent" },
                new Role { RoleId = Guid.NewGuid(), RoleName = "Teacher" }
            );

            var adminUser = CreateAdminUser();
            modelBuilder.Entity<User>().HasData(adminUser);
            modelBuilder.Entity<UserRole>().HasData(new UserRole
            {
                UserId = adminUser.UserId,
                RoleId = adminRoleId
            });
            #endregion
        }
    }
}