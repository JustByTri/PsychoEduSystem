using System;
using System.Threading.Tasks;
using DAL.Repositories.IRepositories;

namespace DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IAppointmentRepository Appointment { get; }
        ICategoryRepository Category { get; }
       
        IMentalHealthPointDetailRepository MentalHealthPointDetail { get; }
        IMentalHealthPointRepository MentalHealthPoint { get; }
        IMessageRepository Message { get; }
        IRoleRepository Role { get; }
        ISlotRepository Slot { get; }
        IUserRepository User { get; }
        IUserRoleRepository UserRole { get; }
        
        IUserTokenRepository UserToken { get; }

        IAnswerRepository Answer { get; }

        IRefreshTokenRepository RefreshToken { get; }
     IQuestionRepository Question { get; }
        ISurveyRepository Survey { get; }

        // Dispose method để giải phóng tài nguyên
        void Dispose();

        // Phương thức lưu thay đổi bất đồng bộ
        Task<bool> SaveChangeAsync();

        // Phương thức lưu thay đổi đồng bộ
        bool SaveChange();
    }
}
