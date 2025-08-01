using MeetingsApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace MeetingsApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileStorageController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;

        public FileStorageController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        [HttpPost("photo-upload")]
        [RequestSizeLimit(5_000_000)] 
        public async Task<IActionResult> PhotoUpload([FromForm] FileUploadRequest model)
        {
            if (model.File == null || model.File.Length == 0)
                return BadRequest("Dosya yüklenemedi.");

            var savedPath = await _fileStorageService.SaveProfileImageAsync(model.File);

            return Ok(new { path = savedPath });
        }

        [HttpPost("document-upload")]
        [RequestSizeLimit(5_000_000)]
        public async Task<IActionResult> DocumentUpload([FromForm] FileUploadRequest model)
        {
            if (model.File == null || model.File.Length == 0)
                return BadRequest("Dosya yüklenemedi.");

            var savedPath = await _fileStorageService.SaveDocumentAsync(model.File);

            return Ok(new { path = savedPath });
        }

        [HttpGet("get-file")]
        public IActionResult GetFile([FromQuery] string path)
        {
            try
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), path.Replace('/', Path.DirectorySeparatorChar));
                if (!System.IO.File.Exists(fullPath))
                    return NotFound("Dosya bulunamadı.");

                var contentType = GetContentType(fullPath);
                var fileName = Path.GetFileName(fullPath);
                return PhysicalFile(fullPath, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }

        public class FileUploadRequest
        {
            public IFormFile File { get; set; }
        }
        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(path, out var contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }
    }
}
