// App Namespaces
using api.Utilities.Validations;

// Namespace for Auth Dto
namespace api.Models.Dtos.Auth;

/// <summary>
/// Registration Dto Class
/// </summary>
public class RegistrationDto
{
    /// <summary>
    /// User Email Field
    /// </summary>
    [ValidEmail]
    public string? Email { get; set; }

    /// <summary>
    /// User Password Field
    /// </summary>
    [ValidPassword]
    public string? Password { get; set; }
}