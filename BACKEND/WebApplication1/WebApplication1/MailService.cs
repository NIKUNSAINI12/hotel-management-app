using Microsoft.Extensions.Configuration;
using System.IO; // For reading the file
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendBookingConfirmationEmailAsync(Booking booking)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var client = new SmtpClient(smtpSettings["Server"])
            {
                Port = int.Parse(smtpSettings["Port"]),
                Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                EnableSsl = true,
            };

            // 1. Read the HTML template from the file
            string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "BookingConfirmationTemplate.html");
            string emailBody = await File.ReadAllTextAsync(templatePath);

            // 2. Replace placeholders with actual booking data
            emailBody = emailBody.Replace("{RoomNumber}", booking.Room.RoomNumber);
            emailBody = emailBody.Replace("{RoomType}", booking.Room.RoomType.TypeName);
            emailBody = emailBody.Replace("{StartTime}", booking.StartTime.ToString("g"));
            emailBody = emailBody.Replace("{EndTime}", booking.EndTime.ToString("g"));
            emailBody = emailBody.Replace("{TotalCost}", booking.TotalCost.ToString("0.00"));

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["SenderEmail"], smtpSettings["SenderName"]),
                Subject = "Your Booking Confirmation",
                Body = emailBody, // Use the populated template
                IsBodyHtml = true,
            };
            mailMessage.To.Add(booking.UserEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}