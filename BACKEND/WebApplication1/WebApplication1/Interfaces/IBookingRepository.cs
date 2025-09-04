using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetAllAsync(int? roomId, int? roomTypeId, DateTime? startDate, DateTime? endDate);

        Task<int> CreateAsync(Booking booking);
        Task<Booking> GetByIdAsync(int id); // <-- Add this line
        Task<bool> UpdateAsync(Booking booking); // <-- Add this line
        Task<decimal?> DeleteAsync(int id);
    }
}