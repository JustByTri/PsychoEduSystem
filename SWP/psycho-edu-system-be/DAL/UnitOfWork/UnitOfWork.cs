using DAL.Data;
using DAL.Repositories.IRepositories;
using DAL.Repositories;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MindAidContext _context;

        public UnitOfWork(MindAidContext context)
        {
            _context = context;

            // Khởi tạo các repository
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
            Answer = new AnswerRepository(_context);
            RefreshToken = new RefreshTokenRepository(_context);

        }

        // Các repository được khởi tạo từ constructor
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



        public IAnswerRepository Answer { get; private set; }

        public IRefreshTokenRepository RefreshToken { get; private set; }

        // Giải phóng tài nguyên
        public void Dispose()
        {
            _context.Dispose();
        }

        // Phương thức lưu thay đổi đồng bộ
        public bool SaveChange()
        {
            // Trả về true nếu có thay đổi được lưu
            return _context.SaveChanges() > 0;
        }

        // Phương thức lưu thay đổi bất đồng bộ
        public async Task<bool> SaveChangeAsync()
        {
            // Trả về true nếu có thay đổi được lưu
            return await _context.SaveChangesAsync() > 0;
        }


    }
}
