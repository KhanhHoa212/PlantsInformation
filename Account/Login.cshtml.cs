using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Components.Forms;
using PlantsInformationWeb.Services;
namespace PlantsInformationWeb.Pages.Account;

public class LoginModel : PageModel
{
    private readonly AuthService _authService;
    private readonly ILogger<LoginModel> _logger;
    private readonly ChatService _chatService;


    public LoginModel(AuthService authService, ChatService chatService, ILogger<LoginModel> logger)
    {
        _authService = authService;
        _chatService = chatService;
        _logger = logger;
    }


    public LoginInput Login { get; set; } = new();
    public RegisterInput Register { get; set; } = new();


    public class LoginInput
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }


    public class RegisterInput
    {
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please confirm your password.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }


    public async Task<IActionResult> OnPostLoginAsync([FromForm] LoginInput login)
    {
        Login = login;
        if (!ModelState.IsValid)
        {
            return Page();
        }

        // Xác thực bằng email
        var user = await AuthService.AuthenticateAsync(Login.Email, Login.Password);
        if (user == null)
        {
            TempData["LoginFailed"] = "Invalid email or password.";
            return Page();
        }

        if (user.Isactive == false)
        {
            TempData["LoginFailed"] = "Your account has been locked. Please contact the administrator.";
            return Page();
        }
        var chatSession = await _chatService.CreateSessionAsync(user.UserId);
        // Lưu username để hiển thị sau khi đăng nhập
        var claims = new List<Claim>
    {
        new Claim("user_id", user.UserId.ToString()),
        new Claim("chat_session_id", chatSession.SessionId.ToString()),
        new Claim(ClaimTypes.Name, user.Username ?? ""),
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim(ClaimTypes.Role, user.Role ?? "")
    };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(claimsIdentity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        if (user.Role == "admin")
        {
            Console.WriteLine("User Role: " + user.Role);
            return RedirectToPage("/Index");
        }
        else
        {
            return RedirectToPage("/Index");
        }
    }


    public bool IsRegisterPanelActive { get; set; } = false;

    public AuthService AuthService => _authService;

    public async Task<IActionResult> OnPostRegisterAsync([FromForm] RegisterInput register)
    {
        Register = register;
        IsRegisterPanelActive = true;

        if (!ModelState.IsValid)
        {
            return Page();
        }

        // Kiểm tra email đã tồn tại chưa
        var existingUser = await AuthService.GetUserByEmailAsync(Register.Email);
        if (existingUser != null)
        {
            ModelState.AddModelError("Register.Email", "Email is already registered.");
            return Page();
        }

        // Đăng ký người dùng mới
        var success = await AuthService.RegisterUserAsync(Register.Email, Register.Username, Register.Password);
        if (!success)
        {
            ModelState.AddModelError(string.Empty, "Registration failed. Please try again.");
            return Page();
        }

        TempData["RegisterSuccess"] = "Registration successful! Please login.";
        return RedirectToPage();
    }


}

