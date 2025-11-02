// Main JavaScript file for Plant Lookup Website
 
// Wait for jQuery to be available
; (() => {
    function initializeApp() {
        // Check if jQuery is loaded
        if (typeof window.jQuery === "undefined") {
            console.log("[v0] jQuery not loaded yet, retrying...")
            setTimeout(initializeApp, 100)
            return
        }
 
        const $ = window.jQuery
        const bootstrap = window.bootstrap
 
        $(document).ready(() => {
            console.log("[v0] jQuery loaded successfully, initializing app...")
 
            // Initialize tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
 
            // Initialize popovers
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            var popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))
 
            function capitalizeFirst(str) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
 
            function showAlert(message, type = "info") {
                const alertHtml = `
                    <div class="alert alert-${type} alert-dismissible fade show position-fixed"
                         style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `
 
                $("body").append(alertHtml)
 
                // Auto-dismiss after 3 seconds
                setTimeout(() => {
                    $(".alert").alert("close")
                }, 3000)
            }
 
            $('a[href^="#"]').on("click", function (e) {
                // Nếu là dropdown của Bootstrap thì bỏ qua
                if ($(this).attr("data-bs-toggle") === "dropdown") return
 
                e.preventDefault()
                const href = $(this).attr("href")
 
                // Bỏ qua nếu href chỉ là "#"
                if (href === "#") return
 
                const target = $(href)
                if (target.length) {
                    $("html, body").animate(
                        {
                            scrollTop: target.offset().top - 100,
                        },
                        500
                    )
                }
            })
 
            // Make functions globally available
            window.showAlert = showAlert
        })
    }
 
    // Start initialization
    initializeApp()
})()
 
// Global functions for export functionality
function exportToPDF() {
    if (typeof window.showAlert === "function") {
        window.showAlert("Generating PDF...", "info")
    }
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
        if (typeof window.showAlert === "function") {
            window.showAlert("PDF export completed!", "success")
        }
        if (typeof window.jQuery !== "undefined") {
            window.jQuery("#exportModal").modal("hide")
        }
    }, 2000)
}
 
function exportToExcel() {
    if (typeof window.showAlert === "function") {
        window.showAlert("Generating Excel file...", "info")
    }
    // In a real app, this would generate and download an Excel file
    setTimeout(() => {
        if (typeof window.showAlert === "function") {
            window.showAlert("Excel export completed!", "success")
        }
        if (typeof window.jQuery !== "undefined") {
            window.jQuery("#exportModal").modal("hide")
        }
    }, 2000)
}