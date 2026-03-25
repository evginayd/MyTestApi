using System.Text.Json.Serialization;

namespace MyTestApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string PasswordHash { get; set; } = "";

        // Profil bilgileri
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [JsonIgnore]
        public string Role { get; set; } = "User";  // default to "User" 

    }
}