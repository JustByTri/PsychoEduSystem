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
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseContent> CourseContents { get; set; }
        public DbSet<Category> Categories { get; set; }      
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MentalHealthPoint> MentalHealthPoints { get; set; }
        public DbSet<MentalHealthPointDetail> MentalHealthPointDetails { get; set; }
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

        
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Category)
                .WithMany()
                .HasForeignKey(c => c.CategoryId);

            modelBuilder.Entity<Course>()
                .HasOne(c => c.User)
                .WithMany(u => u.Courses)
                .HasForeignKey(c => c.OwnerId);

      
            modelBuilder.Entity<CourseContent>()
                .HasOne(cc => cc.Course)
                .WithMany(c => c.CourseContents)
                .HasForeignKey(cc => cc.CourseId);

          

       
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

            #endregion

            #region Seed Data
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