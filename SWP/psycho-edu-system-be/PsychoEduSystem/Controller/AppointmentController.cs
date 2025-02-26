﻿using BLL.Interface;
using BLL.Service;
using Common.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PsychoEduSystem.Controller
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentRequestDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid request data.");

                if (request.BookedBy == Guid.Empty || request.AppointmentFor == Guid.Empty || request.MeetingWith == Guid.Empty)
                    return BadRequest("Invalid user ID.");

                if (request.Date == default)
                    return BadRequest("Invalid date.");

                var response = await _appointmentService.CreateAppointmentAsync(request);

                return StatusCode(response.StatusCode, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO($"An unexpected error occurred: {ex.Message}", 500, false, null));
            }
        }
        [HttpGet("students/{studentId}/appointments")]
        public async Task<IActionResult> GetAppointmentsForStudent(Guid studentId, [FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            if (studentId == Guid.Empty)
                return BadRequest("Invalid student ID.");

            var response = await _appointmentService.GetAppointmentFromRangeAsyncForStudent(studentId, startDate, endDate);

            if (!response.IsSuccess)
                return StatusCode(response.StatusCode, response.Message);

            return Ok(response);
        }
        [HttpGet("consultants/{consultantId}/appointments")]
        public async Task<IActionResult> GetAppointmentsForConsultant(Guid consultantId, [FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            if (consultantId == Guid.Empty)
                return BadRequest("Invalid student ID.");

            var response = await _appointmentService.GetAppointmentFromRangeAsyncForConsultant(consultantId, startDate, endDate);

            if (!response.IsSuccess)
                return StatusCode(response.StatusCode, response.Message);

            return Ok(response);
        }
    }
}
