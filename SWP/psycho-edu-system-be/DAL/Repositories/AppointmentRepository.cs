using DAL.Data;
using DAL.Entities;
using DAL.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        private readonly MindAidContext _mindAidContext;
        public AppointmentRepository(MindAidContext context) : base(context)
        {
            _mindAidContext = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _mindAidContext.Appointments
                                 .Include(a => a.Student)
                                 .Include(a => a.Counselor)
                                 .Include(a => a.Slot)
                                 .ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(Guid id)
        {
            return await _mindAidContext.Appointments
                                 .Include(a => a.Student)
                                 .Include(a => a.Counselor)
                                 .Include(a => a.Slot)
                                 .FirstOrDefaultAsync(a => a.AppointmentId == id);
        }

        public async Task AddAppointmentAsync(Appointment appointment)
        {
            await _mindAidContext.Appointments.AddAsync(appointment);
            await _mindAidContext.SaveChangesAsync();
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            _mindAidContext.Appointments.Update(appointment);
            await _mindAidContext.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(Guid id)
        {
            var appointment = await _mindAidContext.Appointments.FindAsync(id);
            if (appointment != null)
            {
                _mindAidContext.Appointments.Remove(appointment);
                await _mindAidContext.SaveChangesAsync();
            }
        }
    }
}



