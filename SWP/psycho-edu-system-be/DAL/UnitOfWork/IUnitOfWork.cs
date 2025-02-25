using System;
using System.Threading.Tasks;
using DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IAppointmentRepository Appointment { get; }
        ICategoryRepository DimensionHealth { get; }

        IMentalHealthPointDetailRepository MentalHealthPointDetail { get; }

        IMessageRepository Message { get; }
        IRoleRepository Role { get; }
        ISlotRepository Slot { get; }
        IUserRepository User { get; }


        IUserTokenRepository UserToken { get; }

        IAnswerRepository Answer { get; }

        IRefreshTokenRepository RefreshToken { get; }
        IQuestionRepository Question { get; }
        ISurveyRepository Survey { get; }
        ISurveyResponseRepository SurveyResponse { get; }
        ISurveyAnswerUserRepository SurveyAnswerUser { get; }
        IRelationshipRepository Relationship { get; }
        IClassRepository Class { get; }
        ITargetProgramRepository TargetProgram { get; }
        IDbContextTransaction BeginTransaction(System.Data.IsolationLevel isolationLevel);
        // Dispose method để giải phóng tài nguyên
        void Dispose();

        // Phương thức lưu thay đổi bất đồng bộ
        Task<bool> SaveChangeAsync();

        // Phương thức lưu thay đổi đồng bộ
        bool SaveChange();
    }
}
