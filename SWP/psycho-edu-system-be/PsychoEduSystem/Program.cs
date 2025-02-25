using Swashbuckle.AspNetCore.Swagger;
using DAL.Data;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.IRepositories;
using BLL.Interface;
using DAL.Repositories;
using BLL.Service;
using DAL.UnitOfWork;
using BLL.Utilities;

namespace MIndAid
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Đăng ký IHttpContextAccessor để có thể truy cập HttpContext
            builder.Services.AddHttpContextAccessor();

            // Đăng ký các dịch vụ của bạn
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<UserUtility>();
            builder.Services.AddScoped<ILoginService, LoginService>();
            builder.Services.AddScoped<ISurveyService, SurveyService>();
            builder.Services.AddScoped<IMentalHealthPointService, MentalHealthPointService>();
            builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<ITargetProgramRepository, TargetProgramRepository>();
            builder.Services.AddScoped<ITargetProgramService, TargetProgramService>();
            // Cấu hình Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Cấu hình DbContext
            builder.Services.AddDbContext<MindAidContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
