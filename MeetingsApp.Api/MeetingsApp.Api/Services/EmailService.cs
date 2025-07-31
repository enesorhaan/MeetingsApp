
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

        public async Task SendMeetingInvitationAsync(string toEmail, string meetingTitle, string meetingLink, DateTime startTime, DateTime endTime)
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
                    Subject = $"Toplantı Daveti: {meetingTitle}",
                    Body = $@"
                            Merhaba,<br/><br/>
                            '{meetingTitle}' başlıklı toplantıya davetlisiniz.<br/>
                            Toplantı Zamanı: {startTime} - {endTime}<br/><br/>
                            Katılmak için tıklayın: <a href=""{meetingLink}"">{meetingLink}</a><br/><br/>
                            İyi günler dileriz.<br/>MeetingsApp",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"'{toEmail}' adresine toplantı daveti gönderildi.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Toplantı davet e-postası gönderilemedi: {ex.Message}");
                throw;
            }
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
