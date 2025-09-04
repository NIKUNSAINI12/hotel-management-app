using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase

    {

        private readonly IBookingRepository _bookingRepository; // Use the interface
        private readonly IMailService _mailService;


        public BookingsController(IBookingRepository bookingRepository, IMailService mailService)
        {
            _bookingRepository = bookingRepository;
            _mailService = mailService;
        }

        // In Controllers/BookingsController.cs

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? roomId,
            [FromQuery] int? roomTypeId,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var bookings = await _bookingRepository.GetAllAsync(roomId, roomTypeId, startDate, endDate);
            return Ok(bookings);
        }
        // In Controllers/BookingsController.cs
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Booking booking)
        {
            if (id != booking.Id)
            {
                return BadRequest("ID in URL must match ID in request body.");
            }

            if (booking.StartTime >= booking.EndTime)
            {
                return BadRequest("Start time must be before end time.");
            }

            var success = await _bookingRepository.UpdateAsync(booking);

            if (!success)
            {
                return Conflict("The selected time slot for this room is unavailable.");
            }

            // 204 NoContent is the standard response for a successful update.
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var refundAmount = await _bookingRepository.DeleteAsync(id);

            if (refundAmount == null)
            {
                return NotFound($"Booking with ID {id} not found.");
            }

            // Return a 200 OK response with a message about the refund
            return Ok(new { message = $"Booking cancelled successfully. Refund amount: {refundAmount:C}" });
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Booking bookingFromRequest)
        {
            if (bookingFromRequest.StartTime >= bookingFromRequest.EndTime)
            {
                return BadRequest("Start time must be before end time.");
            }

            // Refinement 1: Manually map properties to prevent over-posting
            var newBooking = new Booking
            {
                UserEmail = bookingFromRequest.UserEmail,
                RoomId = bookingFromRequest.RoomId,
                StartTime = bookingFromRequest.StartTime,
                EndTime = bookingFromRequest.EndTime
            };

            // Pass the controlled object to the repository
            var newBookingId = await _bookingRepository.CreateAsync(newBooking);

            if (newBookingId == 0)
            {
                return Conflict("The selected time slot for this room is unavailable.");
            }

            // You can fetch the full booking to return it with the server-calculated cost
            var createdBooking = await _bookingRepository.GetByIdAsync(newBookingId);

           

           

            // Send the confirmation email
            await _mailService.SendBookingConfirmationEmailAsync(createdBooking);

            return CreatedAtAction(nameof(GetById), new { id = newBookingId }, createdBooking);
        }
    }
}