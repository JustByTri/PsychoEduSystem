﻿// <auto-generated />
using System;
using DAL.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DAL.Migrations
{
    [DbContext(typeof(MindAidContext))]
    partial class MindAidContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("DAL.Entities.Answer", b =>
                {
                    b.Property<Guid>("AnswerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("GETDATE()");

                    b.Property<Guid>("QuestionId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedTime")
                        .HasColumnType("datetime2");

                    b.HasKey("AnswerId");

                    b.HasIndex("QuestionId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("DAL.Entities.Appointment", b =>
                {
                    b.Property<Guid>("AppointmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("BookingDateTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<bool>("InProgress")
                        .HasColumnType("bit");

                    b.Property<bool>("IsCanceled")
                        .HasColumnType("bit");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("SlotId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("AppointmentId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("SlotId");

                    b.HasIndex("StudentId");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("DAL.Entities.Category", b =>
                {
                    b.Property<Guid>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("CategoryDescription")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("CategoryName")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("bit");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("DAL.Entities.Course", b =>
                {
                    b.Property<Guid>("CourseId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("Status")
                        .HasColumnType("bit");

                    b.Property<string>("Thumbnail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.HasKey("CourseId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("DAL.Entities.CourseContent", b =>
                {
                    b.Property<Guid>("CourseContentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ContentType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("CourseId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Position")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.HasKey("CourseContentId");

                    b.HasIndex("CourseId");

                    b.ToTable("CourseContents");
                });

            modelBuilder.Entity("DAL.Entities.MentalHealthPoint", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("MentalHealthPointDetailId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "MentalHealthPointDetailId");

                    b.HasIndex("MentalHealthPointDetailId")
                        .IsUnique();

                    b.ToTable("MentalHealthPoints");
                });

            modelBuilder.Entity("DAL.Entities.MentalHealthPointDetail", b =>
                {
                    b.Property<Guid>("MHPDId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("MHPId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("TotalPoint")
                        .HasColumnType("int");

                    b.HasKey("MHPDId");

                    b.ToTable("MentalHealthPointDetails");
                });

            modelBuilder.Entity("DAL.Entities.Message", b =>
                {
                    b.Property<Guid>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("MessageId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("StudentId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("DAL.Entities.PsychoQuestionSet", b =>
                {
                    b.Property<Guid>("SetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("GETDATE()");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("UpdatedTime")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("SetId");

                    b.HasIndex("UserId");

                    b.ToTable("PsychoQuestionSets");
                });

            modelBuilder.Entity("DAL.Entities.Question", b =>
                {
                    b.Property<Guid>("QuestionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("GETDATE()");

                    b.Property<Guid>("SetId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdateTime")
                        .HasColumnType("datetime2");

                    b.HasKey("QuestionId");

                    b.HasIndex("SetId");

                    b.ToTable("QuestionSets");
                });


            modelBuilder.Entity("DAL.Entities.Relationship", b =>
                {
                    b.Property<Guid>("RelationshipId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<string>("RelationshipType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RelationshipId");

                    b.ToTable("Relationships");
                });

            modelBuilder.Entity("DAL.Entities.RequestAppointments", b =>
                {
                    b.Property<Guid>("RequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsBooking")
                        .HasColumnType("bit");

                    b.Property<bool>("IsCheckedIn")
                        .HasColumnType("bit");

                    b.Property<bool>("IsDeposit")
                        .HasColumnType("bit");

                    b.Property<bool>("IsScheduled")
                        .HasColumnType("bit");

                    b.Property<bool>("IsSend")
                        .HasColumnType("bit");

                    b.Property<Guid>("SlotId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("StudentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("RequestId");

                    b.HasIndex("SlotId");

                    b.HasIndex("StudentId");

                    b.HasIndex("UserId");

                    b.ToTable("RequestAppointments");

            modelBuilder.Entity("DAL.Entities.RefreshToken", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RefreshTokenId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRevoked")
                        .HasColumnType("bit");

                    b.Property<string>("RefreshTokenKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "RefreshTokenId");

                    b.ToTable("RefreshTokens");

                });

            modelBuilder.Entity("DAL.Entities.Role", b =>
                {
                    b.Property<Guid>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {

                            RoleId = new Guid("07861ebe-3550-4640-a273-c46f20d63ade"),

                            RoleId = new Guid("fd52b2d3-6b1b-4a14-a9a2-05526184cbfb"),

                            RoleName = "Admin"
                        },
                        new
                        {

                            RoleId = new Guid("11a38458-58ca-4706-b99e-dfa31aae71d9"),

                            RoleId = new Guid("ebfa838e-c2d9-4d49-a3c0-6448ecc27ef5"),

                            RoleName = "Psychologist"
                        },
                        new
                        {

                            RoleId = new Guid("17bd9a69-1d26-4a2a-98b3-39532466879b"),

                            RoleId = new Guid("78dd7fe2-63ad-4429-8f9e-8f16cd0ffc3b"),

                            RoleName = "Student"
                        },
                        new
                        {
              RoleId = new Guid("f9e4c364-92bf-46ff-9101-6fdfab89f379"),

                            RoleId = new Guid("75889736-f47c-4c89-907f-c468f729bddc"),

                            RoleName = "Parent"
                        },
                        new
                        {

                            RoleId = new Guid("8917a2de-6c3e-4122-9a0b-6aeb7ddc5cd6"),

                            RoleId = new Guid("3876f5ca-477c-4cac-9ff7-9a84aa538db7"),

                            RoleName = "Teacher"
                        });
                });

            modelBuilder.Entity("DAL.Entities.Slot", b =>
                {
                    b.Property<Guid>("SlotId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("SlotDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("SlotId");

                    b.HasIndex("UserId");

                    b.ToTable("Slots");
                });

            modelBuilder.Entity("DAL.Entities.Survey", b =>
                {
                    b.Property<Guid>("SurveyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("bit");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.HasKey("SurveyId");

                    b.ToTable("Surveys");
                });

            modelBuilder.Entity("DAL.Entities.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("BirthDay")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Status")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("UserId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {

                            UserId = new Guid("ade04cc6-bad7-442e-bea3-33c4e3100cd1"),
                            Address = "Ha Noi",
                            BirthDay = new DateTime(1990, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            CreateAt = new DateTime(2025, 1, 27, 2, 48, 6, 961, DateTimeKind.Local).AddTicks(5842),
                            Email = "admin@fpt.edu.vn",
                            FullName = "Administrator",
                            Gender = "Male",
                            PasswordHash = new byte[] { 205, 34, 97, 88, 164, 157, 183, 201, 210, 199, 205, 32, 104, 47, 69, 252, 158, 255, 77, 35, 181, 49, 74, 110, 119, 123, 89, 62, 86, 216, 62, 228, 215, 169, 196, 106, 126, 195, 167, 250, 158, 206, 156, 242, 122, 169, 94, 188, 104, 129, 85, 201, 177, 39, 31, 56, 50, 0, 112, 198, 201, 138, 106, 166 },
                            PasswordSalt = new byte[] { 56, 255, 232, 61, 61, 125, 200, 243, 197, 188, 0, 52, 63, 139, 205, 226, 124, 12, 253, 40, 48, 103, 142, 107, 191, 122, 34, 145, 110, 26, 186, 244, 225, 128, 111, 92, 232, 47, 86, 134, 246, 99, 33, 211, 234, 86, 53, 118, 46, 21, 125, 10, 151, 14, 136, 28, 4, 251, 207, 99, 7, 134, 8, 145, 22, 225, 78, 190, 197, 240, 12, 26, 245, 248, 80, 202, 183, 102, 112, 24, 78, 4, 184, 0, 98, 52, 48, 32, 3, 88, 245, 172, 229, 143, 79, 207, 57, 155, 143, 121, 90, 146, 180, 246, 86, 112, 50, 209, 104, 183, 245, 38, 12, 71, 132, 225, 125, 10, 87, 120, 211, 165, 56, 70, 92, 33, 149, 21 },
                  UserId = new Guid("8eb564a5-1234-4770-b67a-483da1e3e6e4"),
                            Address = "Ha Noi",
                            BirthDay = new DateTime(1990, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            CreateAt = new DateTime(2025, 1, 18, 14, 57, 54, 187, DateTimeKind.Local).AddTicks(3252),
                            Email = "admin@fpt.edu.vn",
                            FullName = "Administrator",
                            Gender = "Male",
                            IsEmailConfirmed = false,
                            PasswordHash = new byte[] { 61, 227, 154, 230, 237, 208, 17, 45, 152, 73, 163, 107, 104, 208, 207, 23, 84, 48, 19, 215, 150, 10, 128, 157, 20, 24, 38, 172, 186, 143, 108, 154, 249, 53, 29, 232, 69, 73, 133, 225, 21, 60, 165, 87, 215, 201, 98, 5, 74, 222, 41, 232, 215, 92, 255, 219, 74, 226, 125, 217, 101, 240, 6, 90 },
                            PasswordSalt = new byte[] { 58, 216, 132, 185, 111, 128, 143, 82, 216, 19, 108, 214, 250, 5, 253, 71, 241, 242, 53, 208, 11, 184, 227, 104, 147, 133, 219, 84, 200, 193, 72, 58, 108, 47, 222, 185, 213, 250, 175, 65, 242, 252, 112, 192, 245, 229, 253, 174, 222, 22, 182, 34, 160, 216, 160, 204, 111, 98, 28, 195, 140, 52, 7, 224, 189, 157, 180, 7, 178, 71, 102, 81, 216, 137, 29, 66, 47, 187, 135, 57, 57, 242, 224, 243, 72, 71, 96, 220, 33, 7, 27, 230, 140, 25, 173, 74, 139, 202, 188, 17, 231, 46, 222, 207, 97, 12, 172, 35, 17, 94, 125, 103, 247, 98, 60, 124, 100, 91, 244, 143, 51, 106, 5, 32, 141, 85, 95, 252 },

                            Phone = "0123456789",
                            Status = true,
                            UserName = "admin"
                        });
                });

            modelBuilder.Entity("DAL.Entities.UserRole", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles");

                    b.HasData(
                        new
                        {

                            UserId = new Guid("ade04cc6-bad7-442e-bea3-33c4e3100cd1"),
                            RoleId = new Guid("07861ebe-3550-4640-a273-c46f20d63ade")

                            UserId = new Guid("8eb564a5-1234-4770-b67a-483da1e3e6e4"),
                            RoleId = new Guid("fd52b2d3-6b1b-4a14-a9a2-05526184cbfb")

                        });
                });

            modelBuilder.Entity("DAL.Entities.Video", b =>
                {
                    b.Property<Guid>("VideoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("CreateAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.HasKey("VideoId");

                    b.ToTable("Videos");
                });

            modelBuilder.Entity("DAL.Entities.Answer", b =>
                {
                    b.HasOne("DAL.Entities.Question", "Question")
                        .WithMany("Answers")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("DAL.Entities.Appointment", b =>
                {
                    b.HasOne("DAL.Entities.User", "Counselor")
                        .WithMany("CounselorAppointments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("DAL.Entities.Slot", "Slot")
                        .WithMany("Appointments")
                        .HasForeignKey("SlotId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "Student")
                        .WithMany("StudentAppointments")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Counselor");

                    b.Navigation("Slot");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("DAL.Entities.Course", b =>
                {
                    b.HasOne("DAL.Entities.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany("Courses")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DAL.Entities.CourseContent", b =>
                {
                    b.HasOne("DAL.Entities.Course", "Course")
                        .WithMany("CourseContents")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");
                });

            modelBuilder.Entity("DAL.Entities.MentalHealthPoint", b =>
                {
                    b.HasOne("DAL.Entities.MentalHealthPointDetail", "MentalHealthPointDetail")
                        .WithOne("MentalHealthPoints")
                        .HasForeignKey("DAL.Entities.MentalHealthPoint", "MentalHealthPointDetailId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany("MentalHealthPoints")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MentalHealthPointDetail");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DAL.Entities.Message", b =>
                {
                    b.HasOne("DAL.Entities.User", "Counselor")
                        .WithMany("ReceivedMessages")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "Student")
                        .WithMany("SentMessages")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Counselor");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("DAL.Entities.PsychoQuestionSet", b =>
                {
                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany("PsychoQuestions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("DAL.Entities.Question", b =>
                {
                    b.HasOne("DAL.Entities.PsychoQuestionSet", "QuestionSet")
                        .WithMany("Questions")
                        .HasForeignKey("SetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("QuestionSet");
                });


            modelBuilder.Entity("DAL.Entities.RequestAppointments", b =>
                {
                    b.HasOne("DAL.Entities.Slot", "Slot")
                        .WithMany()
                        .HasForeignKey("SlotId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "Student")
                        .WithMany()
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", null)
                        .WithMany("RequestAppointments")
                        .HasForeignKey("UserId");

                    b.Navigation("Slot");

                    b.Navigation("Student");

            modelBuilder.Entity("DAL.Entities.RefreshToken", b =>
                {
                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                });

            modelBuilder.Entity("DAL.Entities.Slot", b =>
                {
                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany("Slots")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("DAL.Entities.UserRole", b =>
                {
                    b.HasOne("DAL.Entities.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DAL.Entities.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DAL.Entities.Course", b =>
                {
                    b.Navigation("CourseContents");
                });

            modelBuilder.Entity("DAL.Entities.MentalHealthPointDetail", b =>
                {
                    b.Navigation("MentalHealthPoints")
                        .IsRequired();
                });

            modelBuilder.Entity("DAL.Entities.PsychoQuestionSet", b =>
                {
                    b.Navigation("Questions");
                });

            modelBuilder.Entity("DAL.Entities.Question", b =>
                {
                    b.Navigation("Answers");
                });

            modelBuilder.Entity("DAL.Entities.Role", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("DAL.Entities.Slot", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("DAL.Entities.User", b =>
                {
                    b.Navigation("CounselorAppointments");

                    b.Navigation("Courses");

                    b.Navigation("MentalHealthPoints");

                    b.Navigation("PsychoQuestions");

                    b.Navigation("ReceivedMessages");

                    b.Navigation("RequestAppointments");

                    b.Navigation("SentMessages");

                    b.Navigation("Slots");

                    b.Navigation("StudentAppointments");

                    b.Navigation("UserRoles");
                });
#pragma warning restore 612, 618
        }
    }
}
