namespace MeetingsApp.Api.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveProfileImageAsync(IFormFile file);
        Task<string> SaveDocumentAsync(IFormFile file);
        Task<byte[]> GetFileAsync(string relativePath);
    }
}
