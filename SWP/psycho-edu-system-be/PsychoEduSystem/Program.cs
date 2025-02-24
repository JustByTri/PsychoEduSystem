using Swashbuckle.AspNetCore.Swagger;
using DAL.Data;
using Microsoft.EntityFrameworkCore;
using DAL.Repositories.IRepositories;
using BLL.Interface;
using DAL.Repositories;
using BLL.Service;
using DAL.UnitOfWork;
using BLL.Utilities;
using BLL.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Common.Setting;
using Common.Constant;
using System.Security.Claims;
using Swashbuckle.AspNetCore.SwaggerUI;
using Swashbuckle.AspNetCore.Filters;

namespace MIndAid
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSettingModel.SecretKey)),
            ValidateIssuer = true,
            ValidIssuer = JwtSettingModel.Issuer,
            ValidateAudience = true,
            ValidAudience = JwtSettingModel.Audience,
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };
    });
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
            builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            builder.Services.AddScoped<IJwtProvider,JwtProvider>();
            builder.Services.AddScoped<IClassService, ClassService>();
            builder.Services.AddScoped<IRelationshipService, RelationshipService>();
            // Cấu hình Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                c.OperationFilter<SecurityRequirementsOperationFilter>();
                // Thêm security definition
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description =
        "JWT Authorization header using the Bearer scheme. \r\n\r\n " +
        "Enter 'Bearer' [space] and then your token in the text input below. \r\n\r\n" +
        "Example: \"Bearer 12345abcdef\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = "Bearer",
                    Type = SecuritySchemeType.ApiKey
                });

                // Thêm security requirement
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
{
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            },
            Scheme = "oauth2",
            Name = "Bearer",
            In = ParameterLocation.Header,
        },
        new List<string>()
    }
});
            });


            // Cấu hình DbContext
            builder.Services.AddDbContext<MindAidContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
            );
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("SurveyResultsPolicy", policy =>
                    policy.RequireRole("Student", "Parent", "Teacher", "Psychologist")
                          .RequireAuthenticatedUser());
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    c.OAuthConfigObject = new OAuthConfigObject
                    {
                        ClientId = "swagger-ui",
                        AppName = "Swagger UI",
                    };
                });
                app.UseSwagger();
            }
         
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseHttpsRedirection();
            app.MapControllers();
            app.UseCors("AllowAll");
            app.Run();
        }
    }
}
