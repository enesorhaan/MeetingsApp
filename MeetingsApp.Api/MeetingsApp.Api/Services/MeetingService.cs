using MeetingsApp.Data.Context;
using MeetingsApp.Model.Dtos.Meeting;
using MeetingsApp.Model.Entities;
using MeetingsApp.Model.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MeetingsApp.Api.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly AppDbContext _context;
        private readonly string _baseDomain;
        private readonly IEmailService _emailService;

        public MeetingService(AppDbContext context, IOptions<AppSettings> appSettings, IEmailService emailService)
        {
            _context = context;
            _baseDomain = appSettings.Value.BaseDomain;
            _emailService = emailService;
        }

        public async Task<List<MeetingResponseDto>> GetAllAsync()
        {
            return await _context.Meetings
                .Select(meeting => new MeetingResponseDto
                {
                    Id = meeting.Id,
                    Title = meeting.Title,
                    Description = meeting.Description,
                    StartTime = meeting.StartTime,
                    EndTime = meeting.EndTime,
                    FilePath = meeting.FilePath,
                    CreatedByUserId = meeting.CreatedByUserId,
                    CreatedAt = meeting.CreatedAt
                }).ToListAsync();
        }

        public async Task<List<MeetingResponseDto>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Meetings
                .Where(m => m.CreatedByUserId == userId)
                .OrderByDescending(m => m.StartTime)
                .Select(meeting => new MeetingResponseDto
                {
                    Id = meeting.Id,
                    Title = meeting.Title,
                    Description = meeting.Description,
                    StartTime = meeting.StartTime,
                    EndTime = meeting.EndTime,
                    FilePath = meeting.FilePath,
                    CreatedByUserId = meeting.CreatedByUserId,
                    CreatedAt = meeting.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<MeetingResponseDto?> GetByIdAsync(int id)
        {
            var meeting = await _context.Meetings.FindAsync(id);

            if (meeting == null) 
                return null;

            return new MeetingResponseDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                StartTime = meeting.StartTime,
                EndTime = meeting.EndTime,
                FilePath = meeting.FilePath,
                CreatedByUserId = meeting.CreatedByUserId,
                CreatedAt = meeting.CreatedAt
            };
        }

        public async Task<MeetingResponseDto> CreateAsync(MeetingCreateDto dto, int userId)
        {
            var calculatedEndTime = dto.StartTime.AddMinutes(dto.DurationInMinutes);

            if (calculatedEndTime <= DateTime.UtcNow)
                throw new ArgumentException("Toplantı geçmişte olamaz.");

            var meeting = new Meeting
            {
                Title = dto.Title,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = calculatedEndTime,
                FilePath = dto.FilePath,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow,
                PublicLinkGuid = Guid.NewGuid()
            };

            _context.Meetings.Add(meeting);
            await _context.SaveChangesAsync();

            return new MeetingResponseDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                StartTime = meeting.StartTime,
                EndTime = meeting.EndTime,
                FilePath = meeting.FilePath,
                CreatedByUserId = meeting.CreatedByUserId,
                CreatedAt = meeting.CreatedAt,
                PublicLink = $"{_baseDomain}/meeting/join/{meeting.PublicLinkGuid}"
            };
        }

        public async Task<bool> UpdateAsync(MeetingUpdateDto dto, int userId)
        {
            var calculatedEndTime = dto.StartTime.AddMinutes(dto.DurationInMinutes);

            if (calculatedEndTime <= DateTime.UtcNow)
                throw new ArgumentException("Toplantı geçmişte olamaz.");

            var meeting = await _context.Meetings.FindAsync(dto.Id);

            if (meeting == null || meeting.CreatedByUserId != userId)
                return false;

            meeting.Title = dto.Title;
            meeting.Description = dto.Description;
            meeting.StartTime = dto.StartTime;
            meeting.EndTime = calculatedEndTime;
            meeting.FilePath = dto.FilePath;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var meeting = await _context.Meetings.FindAsync(id);
            if (meeting == null)
                return false;

            _context.Meetings.Remove(meeting);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<MeetingResponseDto?> GetByLinkAsync(Guid publicLinkGuid)
        {
            var meeting = await _context.Meetings
                                .FirstOrDefaultAsync(m => m.PublicLinkGuid == publicLinkGuid);

            if (meeting == null)
                return null;

            return new MeetingResponseDto
            {
                Id = meeting.Id,
                Title = meeting.Title,
                Description = meeting.Description,
                StartTime = meeting.StartTime,
                EndTime = meeting.EndTime,
                FilePath = meeting.FilePath,
                CreatedByUserId = meeting.CreatedByUserId,
                CreatedAt = meeting.CreatedAt,
                PublicLink = $"{_baseDomain}/meeting/join/{meeting.PublicLinkGuid}"
            };
        }

        public async Task InviteAsync(int meetingId, List<string> emailList)
        {
            var meeting = await _context.Meetings.FindAsync(meetingId);
            if (meeting == null)
                throw new Exception("Toplantı bulunamadı.");

            var link = $"{_baseDomain}/meeting/join/{meeting.PublicLinkGuid}";

            foreach (var email in emailList.Distinct())
            {
                await _emailService.SendMeetingInvitationAsync(
                    toEmail: email,
                    meetingTitle: meeting.Title,
                    meetingLink: link,
                    startTime: meeting.StartTime,
                    endTime: meeting.EndTime
                );
            }
        }
    }
}
