using DAL.Data;
using DAL.Repositories.IRepositories;
using DAL.Repositories;

namespace DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MindAidContext _context;

        public UnitOfWork(MindAidContext context)
        {
            _context = context;
            Appointment = new AppointmentRepository(_context);
            Category = new CategoryRepository(_context);
            CourseContent = new CourseContentRepository(_context);
            Course = new CourseRepository(_context);
            MentalHealthPointDetail = new MentalHealthPointDetailRepository(_context);
            MentalHealthPoint = new MentalHealthPointRepository(_context);
            Message = new MessageRepository(_context);
            Role = new RoleRepository(_context);
            Slot = new SlotRepository(_context);
            User = new UserRepository(_context);
            UserRole = new UserRoleRepository(_context);
            UserToken = new UserTokenRepository(_context);
          
        }

        public IAppointmentRepository Appointment { get; private set; }
        public ICategoryRepository Category { get; private set; }
        public ICourseContentRepository CourseContent { get; private set; }
        public ICourseRepository Course { get; private set; }
        public IMentalHealthPointDetailRepository MentalHealthPointDetail { get; private set; }
        public IMentalHealthPointRepository MentalHealthPoint { get; private set; }
        public IMessageRepository Message { get; private set; }
        public IRoleRepository Role { get; private set; }
        public ISlotRepository Slot { get; private set; }
        public IUserRepository User { get; private set; }
        public IUserRoleRepository UserRole { get; private set; }
 
        public IUserTokenRepository UserToken { get; private set; }

        public void Dispose()
        {
            _context.Dispose();
        }

        public bool SaveChange()
        {
            return _context.SaveChanges() > 0;
        }

        public async Task<bool> SaveChangeAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}