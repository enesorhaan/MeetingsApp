namespace MeetingsApp.Api.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

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
            string date = DateTime.Now.ToString("yyyyMMdd");
            string directory = Path.Combine(_basePath, category, date);
            Directory.CreateDirectory(directory);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(directory, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Path.Combine("Uploads", category, date, fileName).Replace("\\", "/");
        }

        public async Task<byte[]> GetFileAsync(string relativePath)
        {
            var fullPath = Path.Combine(_env.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(fullPath))
                throw new FileNotFoundException("Dosya bulunamadı.", fullPath);

            return await File.ReadAllBytesAsync(fullPath);
        }
    }
}
