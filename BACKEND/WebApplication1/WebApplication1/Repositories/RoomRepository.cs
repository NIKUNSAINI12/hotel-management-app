using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration; // Add this for IConfiguration
using System.Collections.Generic;
using System.Data; // All 'using' statements should be at the top
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models; // Make sure this namespace matches your project

namespace WebApplication1.Repositories // Make sure this namespace matches your project
{
    public class RoomRepository : IRoomRepository

    {
        private readonly string _connectionString;

        public RoomRepository(IConfiguration configuration)
        {
            // Get the connection string from appsettings.json
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<Room>> GetAllAsync()
        {
            // The name of the stored procedure to execute
            var procedureName = "sp_GetAllRoomsWithDetails";

            using (var connection = new SqlConnection(_connectionString))
            {
                var rooms = await connection.QueryAsync<Room, RoomType, Room>(
                    procedureName,
                    (room, roomType) =>
                    {
                        room.RoomType = roomType;
                        return room;
                    },
                    // The corrected splitOn parameter must match the unique alias in your SQL procedure.
                    splitOn: "RoomType_Id",
                    commandType: CommandType.StoredProcedure);

                return rooms;
            }
        }
        public async Task<IEnumerable<RoomType>> GetAllTypesAsync()
        {
            var sql = "SELECT * FROM RoomTypes";
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<RoomType>(sql);
            }
            // We will add more methods here later (GetById, Create, etc.)
        }
    }
}