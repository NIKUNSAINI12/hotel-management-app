using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Room>> GetAllAsync();
        Task<IEnumerable<RoomType>> GetAllTypesAsync();
    }
}