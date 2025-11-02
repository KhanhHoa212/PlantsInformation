using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PlantsInformationWeb.Repository;

namespace PlantsInformationWeb.Pages.Account;

public class VerifyOtpModel : PageModel
{
    [BindProperty]
    public string? OtpCode { get; set; }

    private readonly IUserRepository _userRepo;

    public VerifyOtpModel(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(OtpCode))
        {
            ModelState.AddModelError("OtpCode", "Please enter OTP code.");
            return Page();
        }

        // ✅ Lấy UserId từ TempData
        if (TempData["UserId"] is not int userId)
        {
            ModelState.AddModelError(string.Empty, "Invalid authentication session.");
            return Page();
        }
        TempData.Keep("UserId");

        // ✅ Kiểm tra mã OTP
        var isValid = await _userRepo.VerifyOtpAsync(userId, OtpCode);
        if (!isValid)
        {
            ModelState.AddModelError("OtpCode", "OTP code is incorrect or expired.");
            return Page();
        }

        // ✅ Nếu đúng → chuyển sang trang đổi mật khẩu
        TempData["UserId"] = userId;
        return RedirectToPage("/Account/ResetPassword");
    }
}
