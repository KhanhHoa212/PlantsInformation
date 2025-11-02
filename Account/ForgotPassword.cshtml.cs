using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PlantsInformationWeb.Repository;
using PlantsInformationWeb.Services;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace PlantsInformationWeb.Pages.Account
{
    public class ForgotPasswordModel : PageModel
    {
        [BindProperty]
        public string? Email { get; set; }

        private readonly IUserRepository _userRepo;
        private readonly IEmailService _emailService;

        public ForgotPasswordModel(IUserRepository userRepo, IEmailService emailService)
        {
            _userRepo = userRepo;
            _emailService = emailService;
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrWhiteSpace(Email))
            {
                ModelState.AddModelError("Email", "Vui lòng nhập email.");
            }
            else
            {
                var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
                if (!emailRegex.IsMatch(Email))
                {
                    ModelState.AddModelError("Email", "Định dạng email không hợp lệ. Ví dụ: abc@example.com");
                }
            }

            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await _userRepo.GetByEmailAsync(Email);
            if (user == null)
            {
                ModelState.AddModelError("Email", "Email này không tồn tại trong hệ thống.");
                return Page();
            }

            var otp = new Random().Next(100000, 999999).ToString();
            await _userRepo.SaveOtpAsync(user.UserId, otp);
            await _emailService.SendAsync(Email, "Mã OTP đặt lại mật khẩu", $"Mã OTP của bạn là: {otp}");

            TempData["UserId"] = user.UserId;
            return RedirectToPage("/Account/VerifyOtp");
        }
    }
}