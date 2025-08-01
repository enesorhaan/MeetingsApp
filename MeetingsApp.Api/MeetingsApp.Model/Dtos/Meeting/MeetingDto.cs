using System.ComponentModel.DataAnnotations;

namespace MeetingsApp.Model.Dtos.Meeting
{
    public class MeetingCreateDto
    {
        [Required(ErrorMessage = "Başlık zorunludur.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [StringLength(500, ErrorMessage = "En fazla 500 karakter olabilir.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Başlangıç zamanı zorunludur.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "Toplantı süresi zorunludur.")]
        public int DurationInMinutes { get; set; }
        public string? FilePath { get; set; }
    }

    public class MeetingUpdateDto : MeetingCreateDto
    {
        [Required(ErrorMessage = "MeetingId zorunludur.")]
        public int Id { get; set; }
    }

    public class MeetingInvitationDto
    {
        [Required(ErrorMessage = "MeetingId zorunludur.")]
        public int MeetingId { get; set; }
        public List<string> EmailList { get; set; }
    }

    public class MeetingResponseDto : MeetingUpdateDto
    {
        public int CreatedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EndTime { get; set; }
        public string PublicLink { get; set; }
        public bool IsCanceled { get; set; }
    }
}
