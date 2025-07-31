namespace MeetingsApp.Model.Entities
{
    public class Meeting 
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int CreatedByUserId { get; set; }
        public string? FilePath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid PublicLinkGuid { get; set; } = Guid.NewGuid();
        public bool IsCanceled { get; set; } = false;
    }
}
