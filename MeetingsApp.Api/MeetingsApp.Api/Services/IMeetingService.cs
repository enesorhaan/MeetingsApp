using MeetingsApp.Model.Dtos.Meeting;

namespace MeetingsApp.Api.Services
{
    public interface IMeetingService
    {
        Task<List<MeetingResponseDto>> GetAllAsync();
        Task<List<MeetingResponseDto>> GetAllByUserIdAsync(int userId);
        Task<MeetingResponseDto?> GetByIdAsync(int id);
        Task<MeetingResponseDto?> GetByLinkAsync(Guid publicLinkGuid);
        Task<MeetingResponseDto> CreateAsync(MeetingCreateDto dto, int userId);
        Task<bool> UpdateAsync(MeetingUpdateDto dto, int userId);
        Task<bool> DeleteAsync(int id);
        Task<bool> HardDeleteAsync(int id);
        Task InviteAsync(int meetingId, List<string> emailList);
    }
}
