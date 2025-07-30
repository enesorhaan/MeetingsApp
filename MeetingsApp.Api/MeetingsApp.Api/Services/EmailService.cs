
namespace MeetingsApp.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;

        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string fullName)
        {
            // Bu kısım SMTP servisi entegre edileceği yere hazırdır.
            _logger.LogInformation($"Hoş geldin e-postası gönderildi: {toEmail} - {fullName}");
            await Task.CompletedTask;
        }
    }
}
