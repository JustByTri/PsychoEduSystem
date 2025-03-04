using Microsoft.AspNetCore.SignalR;
using DAL.UnitOfWork;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Concurrent;
using System.Linq;
using System.Security.Claims;

namespace BLL.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private static readonly ConcurrentDictionary<string, (System.Timers.Timer Timer, DateTime SessionEndTime, bool NotificationSent)> _appointments = new();
        private static readonly ConcurrentDictionary<string, HashSet<(string ConnectionId, string Role)>> _groupConnections = new();
        private static readonly ConcurrentDictionary<string, bool> _groupStartedByPsychologist = new();

        public ChatHub(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                Console.WriteLine("OnConnectedAsync started.");
                var userId = Guid.Parse(Context.UserIdentifier);
                var role = Context.User.FindFirst(ClaimTypes.Role)?.Value;
                var appointmentId = Context.GetHttpContext().Request.Query["appointmentId"].ToString();

                Console.WriteLine($"User {userId} (Role: {role}) attempting to connect with appointmentId: {appointmentId}");

                if (string.IsNullOrEmpty(appointmentId))
                {
                    Console.WriteLine("Appointment ID is empty.");
                    await Clients.Caller.SendAsync("ReceiveMessage", "System", "Appointment ID is required.");
                    Context.Abort();
                    return;
                }

                var appointment = await _unitOfWork.Appointment.GetByIdAsync(Guid.Parse(appointmentId));
                if (appointment == null)
                {
                    Console.WriteLine($"Appointment {appointmentId} not found.");
                    await Clients.Caller.SendAsync("ReceiveMessage", "System", "Appointment not found.");
                    Context.Abort();
                    return;
                }

                if (appointment.MeetingWith != userId && appointment.AppointmentFor != userId)
                {
                    Console.WriteLine($"User {userId} is not authorized for appointment {appointmentId}.");
                    await Clients.Caller.SendAsync("ReceiveMessage", "System", "You are not authorized for this chat.");
                    Context.Abort();
                    return;
                }

        
                if (role == "Student")
                {
                    var today = DateOnly.FromDateTime(DateTime.UtcNow); 
                    if (appointment.Date != today)
                    {
                        Console.WriteLine($"Student {userId} does not have an appointment on {today}.");
                        await Clients.Caller.SendAsync("ReceiveMessage", "System", "You do not have an appointment today.");
                        Context.Abort();
                        return;
                    }

         
                    if (!_groupStartedByPsychologist.TryGetValue(appointmentId, out var started) || !started)
                    {
                        Console.WriteLine($"Student {userId} cannot join because the psychologist has not started the chat.");
                        await Clients.Caller.SendAsync("ReceiveMessage", "System", "The chat has not been started by the psychologist yet.");
                        Context.Abort();
                        return;
                    }
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, appointmentId);

          
                _groupConnections.AddOrUpdate(
                    appointmentId,
                    new HashSet<(string, string)> { (Context.ConnectionId, role) },
                    (key, oldValue) => { oldValue.Add((Context.ConnectionId, role)); return oldValue; }
                );
                 

                if (role == "Psychologist")
                {
                    _groupStartedByPsychologist.TryAdd(appointmentId, true);
                }

                _appointments.TryAdd(appointmentId, (null, default, false));

                if (_appointments[appointmentId].SessionEndTime == default)
                {
                    var slot = await _unitOfWork.Slot.GetByIdInt(appointment.SlotId);
                    if (slot == null)
                    {
                        Console.WriteLine($"Slot {appointment.SlotId} not found for appointment {appointmentId}.");
                        await Clients.Caller.SendAsync("ReceiveMessage", "System", "Invalid slot for this appointment.");
                        Context.Abort();
                        return;
                    }

                    var startTime = DateTime.Parse($"{appointment.Date} {slot.SlotName}");
                    var sessionEndTime = startTime.AddHours(1);

                    var timer = new System.Timers.Timer
                    {
                        Interval = 1000,
                        AutoReset = true
                    };
                    timer.Elapsed += async (sender, e) => await CheckTimeRemaining(appointmentId);

                    _appointments[appointmentId] = (timer, sessionEndTime, false);
                    timer.Start();

                    Console.WriteLine($"Timer started for appointment {appointmentId}. Session ends at: {sessionEndTime}");
                }
                var user = await _unitOfWork.User.GetByIdAsync(userId);
                string userName = user.FullName;

                await Clients.Group(appointmentId).SendAsync("ReceiveMessage", userName, $"{userName} has joined the chat.");
                await base.OnConnectedAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in OnConnectedAsync: {ex.Message}\nStackTrace: {ex.StackTrace}");
                await Clients.Caller.SendAsync("ReceiveMessage", "System", "An error occurred while connecting.");
                Context.Abort();
            }
        }

        public async Task SendMessage(string message)
        {
            try
            {
                var appointmentId = Context.GetHttpContext().Request.Query["appointmentId"].ToString();
                var userId = Guid.Parse(Context.UserIdentifier);
                var user = await _unitOfWork.User.GetByIdAsync(userId);
                string userName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : userId.ToString();
                Console.WriteLine($"User {userId} sent message in appointment {appointmentId}: {message}");
                await Clients.OthersInGroup(appointmentId).SendAsync("ReceiveMessage", userName, message);
                await Clients.Caller.SendAsync("SelfMessage", userName, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessage: {ex.Message}\nStackTrace: {ex.StackTrace}");
                await Clients.Caller.SendAsync("ReceiveMessage", "System", "An error occurred while sending the message.");
            }
        }

        private async Task CheckTimeRemaining(string appointmentId)
        {
            try
            {
                if (!_appointments.TryGetValue(appointmentId, out var appointmentState))
                {
                    Console.WriteLine($"Appointment {appointmentId} not found in active sessions.");
                    return;
                }

                var timeRemaining = appointmentState.SessionEndTime - DateTime.Now;
                Console.WriteLine($"Time remaining for appointment {appointmentId}: {timeRemaining.TotalMinutes} minutes");

                if (timeRemaining.TotalMinutes <= 15 && !appointmentState.NotificationSent)
                {
                    await Clients.Group(appointmentId).SendAsync("ReceiveMessage", "System", "15 minutes remaining in this chat session.");
                    _appointments[appointmentId] = (appointmentState.Timer, appointmentState.SessionEndTime, true);
                    Console.WriteLine($"Sent 15-minute notification for appointment {appointmentId}");
                }

                if (timeRemaining.TotalSeconds <= 0)
                {
                    await EndSession(appointmentId);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CheckTimeRemaining for appointment {appointmentId}: {ex.Message}\nStackTrace: {ex.StackTrace}");
            }
        }

        private async Task EndSession(string appointmentId)
        {
            try
            {
                Console.WriteLine($"Ending session for appointment {appointmentId}");
                await Clients.Group(appointmentId).SendAsync("ReceiveMessage", "System", "Chat session has ended.");

                if (_appointments.TryGetValue(appointmentId, out var appointmentState))
                {
                    appointmentState.Timer?.Stop();
                    appointmentState.Timer?.Dispose();
                    _appointments.TryRemove(appointmentId, out _);
                }

                var appointment = await _unitOfWork.Appointment.GetByIdAsync(Guid.Parse(appointmentId));
                if (appointment != null)
                {
                    appointment.IsCompleted = true;
                    await _unitOfWork.SaveChangeAsync();
                    Console.WriteLine($"Marked appointment {appointmentId} as completed.");
                }

                // Ngắt kết nối tất cả client trong nhóm
                if (_groupConnections.TryGetValue(appointmentId, out var connectionSet))
                {
                    foreach (var (connectionId, _) in connectionSet)
                    {
                        await Clients.Client(connectionId).SendAsync("ReceiveMessage", "System", "Chat session has ended. You will be disconnected.");
                        await Clients.Client(connectionId).SendAsync("Disconnect");
                    }
                    _groupConnections.TryRemove(appointmentId, out _);
                    _groupStartedByPsychologist.TryRemove(appointmentId, out _);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EndSession for appointment {appointmentId}: {ex.Message}\nStackTrace: {ex.StackTrace}");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                var appointmentId = Context.GetHttpContext().Request.Query["appointmentId"].ToString();
                var userId = Guid.Parse(Context.UserIdentifier);
                var role = Context.User.FindFirst(ClaimTypes.Role)?.Value;

                var user = await _unitOfWork.User.GetByIdAsync(userId);
                string userName = user != null ? $"{user.FirstName} {user.LastName}".Trim() : userId.ToString();
                Console.WriteLine($"User {userId} (Role: {role}) disconnected from appointment {appointmentId}: {exception?.Message}");
                await Clients.Group(appointmentId).SendAsync("ReceiveMessage", userName, $"{userName} has left the chat.");

                if (_groupConnections.TryGetValue(appointmentId, out var connectionSet))
                {
                    connectionSet.RemoveWhere(c => c.ConnectionId == Context.ConnectionId);

               
                    if (role == "Psychologist")
                    {
                        foreach (var (connectionId, connRole) in connectionSet)
                        {
                            if (connRole == "Student")
                            {
                                await Clients.Client(connectionId).SendAsync("ReceiveMessage", "System", "The psychologist has left the chat. You will be disconnected.");
                                await Clients.Client(connectionId).SendAsync("Disconnect");
                            }
                        }
                        _groupConnections.TryRemove(appointmentId, out _);
                        _groupStartedByPsychologist.TryRemove(appointmentId, out _);

                        if (_appointments.TryGetValue(appointmentId, out var appointmentState))
                        {
                            appointmentState.Timer?.Stop();
                            appointmentState.Timer?.Dispose();
                            _appointments.TryRemove(appointmentId, out _);
                            Console.WriteLine($"No more clients in appointment {appointmentId}. Timer stopped and session removed.");
                        }
                    }
                 
                    else if (connectionSet.Count == 0)
                    {
                        _groupConnections.TryRemove(appointmentId, out _);
                        _groupStartedByPsychologist.TryRemove(appointmentId, out _);
                        if (_appointments.TryGetValue(appointmentId, out var appointmentState))
                        {
                            appointmentState.Timer?.Stop();
                            appointmentState.Timer?.Dispose();
                            _appointments.TryRemove(appointmentId, out _);
                            Console.WriteLine($"No more clients in appointment {appointmentId}. Timer stopped and session removed.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in OnDisconnectedAsync: {ex.Message}\nStackTrace: {ex.StackTrace}");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}