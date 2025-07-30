namespace MeetingsApp.Api.Services
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string toEmail, string fullName);
    }
}
