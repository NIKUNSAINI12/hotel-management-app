using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebApplication1.Models;
using Microsoft.Data.SqlClient;
using WebApplication1.Interfaces;

namespace WebApplication1.Repositories
{
    public class BookingRepository:IBookingRepository
    {
        private readonly string _connectionString;

        public BookingRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // In Repositories/BookingRepository.cs

        public async Task<IEnumerable<Booking>> GetAllAsync(int? roomId, int? roomTypeId, DateTime? startDate, DateTime? endDate)
        {
            var procedureName = "sp_GetBookingsFiltered";
            var parameters = new DynamicParameters();
            parameters.Add("RoomId", roomId, DbType.Int32);
            parameters.Add("RoomTypeId", roomTypeId, DbType.Int32);
            parameters.Add("StartDate", startDate, DbType.DateTime2);
            parameters.Add("EndDate", endDate, DbType.DateTime2);

            using (var connection = new SqlConnection(_connectionString))
            {
                var bookings = await connection.QueryAsync<Booking, Room, RoomType, Booking>(
                    procedureName,
                    (booking, room, roomType) => {
                        room.RoomType = roomType;
                        booking.Room = room;
                        return booking;
                    },
                    parameters,
                    // Use the unique aliases to tell Dapper where to split the data
                    splitOn: "Room_Id,RoomType_Id",
                    commandType: CommandType.StoredProcedure);

                return bookings;
            }
        }
        // In Repositories/BookingRepository.cs
        public async Task<Booking> GetByIdAsync(int id)
        {
            var procedureName = "sp_GetBookingById";
            var parameters = new { Id = id };

            using (var connection = new SqlConnection(_connectionString))
            {
                var bookings = await connection.QueryAsync<Booking, Room, RoomType, Booking>(
                    procedureName,
                    (booking, room, roomType) =>
                    {
                        room.RoomType = roomType;
                        booking.Room = room;
                        return booking;
                    },
                    parameters,
                    // The splitOn parameter now correctly matches the aliases in the procedure
                    splitOn: "Room_Id,RoomType_Id",
                    commandType: CommandType.StoredProcedure
                );

                // Return the first booking found, or null if not found
                return bookings.FirstOrDefault();
            }
        }
        public async Task<bool> UpdateAsync(Booking booking)
        {
            var procedureName = "sp_UpdateBooking";
            var parameters = new DynamicParameters();
            parameters.Add("Id", booking.Id, DbType.Int32);
            parameters.Add("UserEmail", booking.UserEmail, DbType.String);
            parameters.Add("RoomId", booking.RoomId, DbType.Int32);
            parameters.Add("StartTime", booking.StartTime, DbType.DateTime2);
            parameters.Add("EndTime", booking.EndTime, DbType.DateTime2);

            using (var connection = new SqlConnection(_connectionString))
            {
                var result = await connection.ExecuteScalarAsync<int>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return result == 1;
            }
        }
        public async Task<decimal?> DeleteAsync(int id)
        {
            var procedureName = "sp_CancelBooking";
            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);

            using (var connection = new SqlConnection(_connectionString))
            {
                var refundAmount = await connection.ExecuteScalarAsync<decimal?>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return refundAmount;
            }
        }

        public async Task<int> CreateAsync(Booking booking)
        {
            var procedureName = "sp_CreateBooking";
            var parameters = new DynamicParameters();
            parameters.Add("UserEmail", booking.UserEmail, DbType.String);
            parameters.Add("RoomId", booking.RoomId, DbType.Int32);
            parameters.Add("StartTime", booking.StartTime, DbType.DateTime2);
            parameters.Add("EndTime", booking.EndTime, DbType.DateTime2);

            using (var connection = new SqlConnection(_connectionString))
            {
                // Use ExecuteScalarAsync because the procedure returns a single value (the new ID or 0)
                var newId = await connection.ExecuteScalarAsync<int>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);

                return newId;
            }
        }
    }
}