namespace MeetingsApp.Api.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        public async Task<string> SaveProfileImageAsync(IFormFile file)
        {
            return await SaveFileAsync("Profile", file);
        }

        public async Task<string> SaveDocumentAsync(IFormFile file)
        {
            return await SaveFileAsync("Document", file);
        }

        private async Task<string> SaveFileAsync(string category, IFormFile file)
        {
            string date = DateTime.UtcNow.ToString("yyyyMMdd");
            string directory = Path.Combine(_basePath, category, date);
            Directory.CreateDirectory(directory);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(directory, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Path.Combine("Uploads", category, date, fileName).Replace("\\", "/");
        }
    }
}
