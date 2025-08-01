namespace MeetingsApp.Model.Dtos.User
{
    public class UserResponseDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string PhotoPath { get; set; }
        public int UserId { get; set; }
    }
}
