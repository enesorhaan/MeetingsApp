using System.Text.Json.Serialization;

namespace MeetingsApp.Model.Enums
{
    public enum UserRole
    {
        [JsonPropertyName("Admin")]
        Admin = 1,
        [JsonPropertyName("User")]
        User = 2
    }
}
