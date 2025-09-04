namespace WebApplication1.Models
{
   
        public class Room
        {
            public int Id { get; set; }
            public string RoomNumber { get; set; }
            public int RoomTypeId { get; set; }

            // Navigation property
            public RoomType RoomType { get; set; }
        }
    
}
