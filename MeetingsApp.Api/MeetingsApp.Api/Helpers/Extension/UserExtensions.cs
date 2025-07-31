using System.Security.Claims;

namespace MeetingsApp.Api.Helpers.Extension
{
    public static class UserExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("userId");
            if (claim == null) return null;

            return int.TryParse(claim.Value, out int userId) ? userId : null;
        }
    }
}
