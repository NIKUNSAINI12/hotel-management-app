namespace WebApplication1.Models
{
   
        public class Booking
        {
            public int Id { get; set; }
            public string UserEmail { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public decimal TotalCost { get; set; }
            public int RoomId { get; set; }

            // Navigation property
            public Room? Room { get; set; }
        }
    
}
