namespace MeetingsApp.Api.Services
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string toEmail, string fullName);
        Task SendMeetingInvitationAsync(string toEmail, string meetingTitle, string meetingLink, DateTime startTime, DateTime endTime);
    }
}
