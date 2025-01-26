using DAL.Entities;
using DAL.Repositories.IRepositories;


namespace DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IAppointmentRepository Appointment { get; }
        ICategoryRepository Category { get; }
        ICourseContentRepository CourseContent { get; }
        ICourseRepository Course { get; }
        IMentalHealthPointDetailRepository MentalHealthPointDetail { get; }
        IMentalHealthPointRepository MentalHealthPoint { get; }
        IMessageRepository Message { get; }
        IRoleRepository Role { get; }
        ISlotRepository Slot { get; }
        IUserRepository User { get; }
        IUserRoleRepository UserRole { get; }
        
        IUserTokenRepository UserToken { get; }

        void Dispose();
        Task<bool> SaveChangeAsync();
        bool SaveChange();
    }
}