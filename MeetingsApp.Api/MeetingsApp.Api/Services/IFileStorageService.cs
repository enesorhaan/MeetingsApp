namespace MeetingsApp.Api.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveProfileImageAsync(IFormFile file);
    }
}
