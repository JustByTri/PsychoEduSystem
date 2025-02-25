using BLL.Interface;
using Common.DTO;
using DAL.Data;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Service
{
    public class ScheduleService : IScheduleService
    {
        private readonly MindAidContext _context;

        public ScheduleService(MindAidContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> BookSlots(BookSlotRequest request)
        {
      
         

            
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return new NotFoundObjectResult("User not found");

            var bookingsToAdd = new List<Schedule>();

            foreach (var detail in request.BookingDetails)
            {
         
                var slot = await _context.Slots.FindAsync(detail.SlotId);
                if (slot == null)
                {
                    return new NotFoundObjectResult($"Slot {detail.SlotId} not found");
                }

          
                if (detail.Date < DateTime.Today)
                {
                    return new BadRequestObjectResult($"Cannot book for past date: {detail.Date:yyyy-MM-dd}");
                }
                var existingBooking = await _context.Schedules
           .AnyAsync(s => s.SlotId == detail.SlotId && s.Date.Date == detail.Date.Date);

                if (existingBooking)
                {
                    return new BadRequestObjectResult($"The specialist already has a schedule on {detail.Date:yyyy-MM-dd} for slot {slot.SlotName}. No need to book again.");
                }

                bookingsToAdd.Add(new Schedule
                {
                    UserId = request.UserId,
                    SlotId = detail.SlotId,
                    Date = detail.Date.Date,
                    CreateAt = DateTime.Now
                });
            }

         
            await _context.Schedules.AddRangeAsync(bookingsToAdd);

            await _context.SaveChangesAsync();

            return new OkObjectResult(new
            {
                Message = "Booking successful",
                Bookings = bookingsToAdd.Select(b => new
                {
                    BookingId = b.ScheduleId,
                    b.SlotId,
                    b.Date
                })
            });
        }

        public async Task<IActionResult> GetUserSchedules(Guid userId)
        {
            var schedules = await _context.Schedules
                .Where(s => s.UserId == userId)
                .Include(s => s.Slot) 
                .Select(s => new
                {
                    s.ScheduleId,
                    s.SlotId,
                    s.Slot.SlotName,
                    s.Date,
                    s.CreateAt
                })
                .ToListAsync();

            return new OkObjectResult(schedules);
        }

        public async Task<IActionResult> GetAvailableSlots(DateTime date)
        {
            var bookedSlots = await _context.Schedules
                .Where(s => s.Date == date.Date)
                .Select(s => s.SlotId)
                .ToListAsync();

            var allSlots = await _context.Slots.ToListAsync();

            var availableSlots = allSlots.Select(s => new
            {
                s.SlotId,
                s.SlotName,
                IsAvailable = !bookedSlots.Contains(s.SlotId)
            });

            return new OkObjectResult(availableSlots);
        }
    }
}
