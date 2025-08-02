using MeetingsApp.Api.Helpers.Extension;
using MeetingsApp.Api.Services;
using MeetingsApp.Model.Dtos.Meeting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace MeetingsApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MeetingController : ControllerBase
    {
        private readonly IMeetingService _meetingService;

        public MeetingController(IMeetingService meetingService)
        {
            _meetingService = meetingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _meetingService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("my-meetings")]
        public async Task<IActionResult> GetAllByUser()
        {
            var userId = User.GetUserId();

            if (userId == null)
                return Unauthorized();

            var result = await _meetingService.GetAllByUserIdAsync(userId.Value);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _meetingService.GetByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(MeetingCreateDto dto)
        {
            var userId = User.GetUserId();

            if (userId == null) 
                return Unauthorized();

            try
            {
                var result = await _meetingService.CreateAsync(dto, userId.Value);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Loglama yapılabilir
                return StatusCode(500, new { Message = "Sunucu hatası oluştu.", Detail = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(MeetingUpdateDto dto)
        {
            var userId = User.GetUserId();

            if (userId == null)
                return Unauthorized();

            try
            {
                var updated = await _meetingService.UpdateAsync(dto, userId.Value);

                if (!updated)
                    return NotFound("Toplantı bulunamadı veya kullanıcı yetkisiz.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Loglama yapılabilir
                return StatusCode(500, new { Message = "Sunucu hatası oluştu.", Detail = ex.Message });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _meetingService.DeleteAsync(id);
            if (!deleted)
                return NotFound("Toplantı bulunamadı.");

            return NoContent();
        }

        [HttpDelete("hard/{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var deleted = await _meetingService.HardDeleteAsync(id);
            if (!deleted)
                return NotFound("Toplantı bulunamadı.");

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("join/{guid}")]
        public async Task<IActionResult> JoinMeeting(Guid guid)
        {
            var result = await _meetingService.GetByLinkAsync(guid);

            if (result == null)
                return NotFound("Toplantı bulunamadı.");

            return Ok(result);
        }

        [HttpPost("invite")]
        public async Task<IActionResult> Invite([FromBody] MeetingInvitationDto dto)
        {
            try
            {
                await _meetingService.InviteAsync(dto.MeetingId, dto.EmailList);
                return Ok("Davetiyeler başarıyla gönderildi.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
