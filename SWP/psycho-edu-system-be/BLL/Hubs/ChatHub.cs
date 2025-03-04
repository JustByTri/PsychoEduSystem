using System;
using System.Threading.Tasks;
using BLL.Interface;
using DAL.Entities;
using DAL.UnitOfWork;
using Microsoft.AspNetCore.SignalR;

namespace BLL.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;
        private readonly IUnitOfWork _unitOfWork;

        public ChatHub(IMessageService messageService, IUnitOfWork unitOfWork)
        {
            _messageService = messageService;
            _unitOfWork = unitOfWork;
        }


        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier; // Lấy UserIdentifier của người dùng
            Console.WriteLine($"✅ Người dùng {userId} đã kết nối.");
            await base.OnConnectedAsync();
        }


        public async Task SendMessage(Guid appointmentId, Guid studentId, Guid ownerId, string message)
        {
            try
            {
                Console.WriteLine($"📌 Debug: appointmentId={appointmentId}, studentId={studentId}, ownerId={ownerId}, content={message}");

                var appointment = await _unitOfWork.Appointment.GetByIdAsync(appointmentId);
                if (appointment == null || appointment.IsCompleted)
                {
                    Console.WriteLine("⚠️ Cuộc hẹn không hợp lệ hoặc đã kết thúc.");
                    await Clients.User(studentId.ToString()).SendAsync("ReceiveMessage", "Hệ thống", "Bạn chưa có cuộc hẹn hợp lệ hoặc cuộc hẹn đã kết thúc.");
                    return;
                }
                // 🔹 Gửi tin nhắn
                Console.WriteLine("📩 Gửi tin nhắn...");
                await Clients.User(studentId.ToString()).SendAsync("ReceiveMessage", message);
                await Clients.User(ownerId.ToString()).SendAsync("ReceiveMessage", message);
                Console.WriteLine("✅ Tin nhắn đã gửi thành công.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi gửi tin nhắn: {ex.Message}", ex);
            }
        }

        public async Task GetChatHistory(Guid StudentId, Guid OwnerId)
        {
            var messages = await _messageService.GetMessagesBetweenUsers(StudentId, OwnerId);
            await Clients.Caller.SendAsync("LoadChatHistory", messages);
        }
    }
}
