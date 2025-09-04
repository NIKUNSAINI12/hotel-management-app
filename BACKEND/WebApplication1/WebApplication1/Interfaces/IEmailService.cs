using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IMailService
    {
        Task SendBookingConfirmationEmailAsync(Booking booking);
    }
}