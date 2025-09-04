
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This will make the endpoint available at /api/rooms
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository; // Use the interface

        public RoomsController(IRoomRepository roomRepository) // Ask for the interface
        {
            _roomRepository = roomRepository;
        }

        [HttpGet] // This marks the method to handle GET requests
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _roomRepository.GetAllAsync();
            return Ok(rooms); // Returns a 200 OK response with the list of rooms in JSON format
        }
        [HttpGet("types")] // Handles GET /api/rooms/types
        public async Task<IActionResult> GetAllTypes()
        {
            var roomTypes = await _roomRepository.GetAllTypesAsync();
            return Ok(roomTypes);
        }
    }
}