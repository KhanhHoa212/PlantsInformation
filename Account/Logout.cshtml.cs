using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace Account
{
    public class Logout : PageModel
    {
        private readonly ILogger<Logout> _logger;

        public Logout(ILogger<Logout> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}