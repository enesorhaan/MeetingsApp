using System.ComponentModel.DataAnnotations;

namespace MeetingsApp.Model.Dtos.User
{
    public class UserLoginDto
    {

        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Şifre zorunludur.")]
        public string Password { get; set; }
    }
}
