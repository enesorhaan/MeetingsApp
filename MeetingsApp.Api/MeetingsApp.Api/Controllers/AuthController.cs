using MeetingsApp.Api.Services;
using MeetingsApp.Data.Context;
using MeetingsApp.Model.Dtos.User;
using MeetingsApp.Model.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingsApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, TokenService tokenService, IEmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Bu e-posta ile zaten bir kullanıcı var.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = hashedPassword,
                ProfileImagePath = dto.PhotoPath ?? string.Empty
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user.Id, user.Email, $"{user.FirstName} {user.LastName}");

            await _emailService.SendWelcomeEmailAsync(user.Email, $"{user.FirstName} {user.LastName}");

            return Ok("Kullanıcı başarıyla oluşturuldu!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized("Şifre hatalı.");

            var token = _tokenService.GenerateToken(user.Id, user.Email, $"{user.FirstName} {user.LastName}");

            return Ok(new UserResponseDto
            {
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Token = token,
                PhotoPath = user.ProfileImagePath
            });
        }
    }
}
