using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Account
{
    public class ResetPassword : PageModel
    {
        private readonly ILogger<ResetPassword> _logger;

        public ResetPassword(ILogger<ResetPassword> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}