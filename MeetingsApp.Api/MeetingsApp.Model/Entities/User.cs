using MeetingsApp.Model.Enums;

namespace MeetingsApp.Model.Entities
{
    public class User
    {
        public int Id { get; set; } // PK
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; } // unique
        public string Phone { get; set; }
        public string PasswordHash { get; set; }
        public string ProfileImagePath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public UserRole Role { get; set; } = UserRole.User;
    }
}
