
using MeetingsApp.Model.Settings;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace MeetingsApp.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string fullName)
        {
            try
            {
                var smtpClient = new SmtpClient(_emailSettings.Host)
                {
                    Port = _emailSettings.Port,
                    Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.Password),
                    EnableSsl = _emailSettings.EnableSsl
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = "Hoş Geldiniz!",
                    Body = $"Merhaba {fullName},\n\nMeetingsApp'e hoş geldiniz!",
                    IsBodyHtml = false,
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation("E-posta başarıyla gönderildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"E-posta gönderilirken hata oluştu: {ex.Message}");
                throw;
            }
        }
    }
}
