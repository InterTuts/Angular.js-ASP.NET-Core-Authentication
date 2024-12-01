// System Utils
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
// App Utils
using api.Models.Dtos;
using api.Models.Dtos.Auth;
using api.Options;
using api.Services.Interfaces;
using api.Utilities;

// Namespace for Auth Controllers
namespace api.Controllers.Auth;

/// <summary>
/// Initializes a new instance of the <see cref="SignInController"/> class.
/// </summary>
/// <param name="options">All App Options.</param>
/// <param name="usersRepository">An instance to the user repository</param>
[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth/[controller]")]
public class SignInController(IOptions<AppSettings> options, IUsersRepository usersRepository) : ControllerBase {

    /// <summary>
    /// This methods verifies if the user's information is valid
    /// </summary>
    /// <param name="signInDto">Data transfer object with user information</param>
    /// <returns>Success message and user's data or error message</returns>
    [HttpPost]
    [EnableCors("MainPolicy")]
    public async Task<IActionResult> SignIn([FromBody] SignInDto signInDto) {

        // Checks if the user data is correct
        ResponseDto<UserDto> user = await usersRepository.SignInAsync(signInDto);

        // Verify if the login is not successfully
        if (user.Result == null) {
            // Return a json
            return new JsonResult(new {
                success = false,
                message = Words.Get("IncorrectEmailPassword")
            });
        }

        // Prepare and define the secret key
        SymmetricSecurityKey securityKey = new (Encoding.UTF8.GetBytes(options.Value.JwtSettings.Key ?? string.Empty));

        // Create aa signature with the key
        SigningCredentials credentials = new (securityKey, SecurityAlgorithms.HmacSha256);

        // Create a new list with token data as claims
        List<Claim> claims = [
            new("UserId", user.Result.UserId.ToString() ?? string.Empty, ClaimValueTypes.String),
            new(JwtRegisteredClaimNames.Sub, "username", ClaimValueTypes.String),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString(), ClaimValueTypes.String)
        ];

        // Create the token
        JwtSecurityToken token = new (
            issuer: options.Value.JwtSettings.Issuer,
            audience: options.Value.JwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(720),
            signingCredentials: credentials
        );

        // Initialize the JwtSecurityTokenHandler class which validates, handles and creates access tokens
        var tokenHandler = new JwtSecurityTokenHandler();

        // Return a json with response
        return new JsonResult(new {
            success = true,
            message = user.Message,
            user = new {
                userId = user.Result.UserId.ToString(),
                user.Result.Email,
                Token = tokenHandler.WriteToken(token)
            }
        });
    }
}