using MeetingsApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

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

        public class FileUploadRequest
        {
            public IFormFile File { get; set; }
        }
    }
}
