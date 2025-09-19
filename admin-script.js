// Admin Dashboard JavaScript - Browser Compatible Version

// Declare variables before using them
const $ = window.$
const bootstrap = window.bootstrap
const tempusDominus = window.tempusDominus
const Chart = window.Chart

$(document).ready(() => {
  // Initialize tooltips and popovers
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))

  // Initialize date pickers
  const startDatePicker = new tempusDominus.TempusDominus(document.getElementById("startDatePicker"), {
    display: {
      components: {
        calendar: true,
        date: true,
        month: true,
        year: true,
        decades: true,
        clock: false,
      },
    },
  })

  const endDatePicker = new tempusDominus.TempusDominus(document.getElementById("endDatePicker"), {
    display: {
      components: {
        calendar: true,
        date: true,
        month: true,
        year: true,
        decades: true,
        clock: false,
      },
    },
  })

  // Sidebar navigation
  $(".sidebar .nav-link").on("click", function (e) {
    e.preventDefault()

    // Remove active class from all nav links
    $(".sidebar .nav-link").removeClass("active")

    // Add active class to clicked nav link
    $(this).addClass("active")

    // Hide all content sections
    $(".content-section").removeClass("active")

    // Show selected content section
    const section = $(this).data("section")
    $(`#${section}-section`).addClass("active")

    // Update page title
    const sectionTitle = $(this).text().trim()
    document.title = `${sectionTitle} - Plant Information Lookup Admin`
  })

  // Sidebar toggle for mobile
  $("#sidebarToggle").on("click", () => {
    $("#sidebar").toggleClass("show")
  })

  // Close sidebar when clicking outside on mobile
  $(document).on("click", (e) => {
    if ($(window).width() < 992) {
      if (!$(e.target).closest("#sidebar, #sidebarToggle").length) {
        $("#sidebar").removeClass("show")
      }
    }
  })

  // Initialize charts
  initializeCharts()

  // Search functionality
  $("#userSearch").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase()
    filterTable("#usersTable", searchTerm)
  })

  $("#categorySearch").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase()
    filterTable("#categoriesTable", searchTerm)
  })

  $("#plantSearch").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase()
    filterTable("#plantsTable", searchTerm)
  })

  // Filter functionality
  $("#roleFilter, #statusFilter").on("change", () => {
    applyUserFilters()
  })

  $("#plantCategoryFilter").on("change", () => {
    applyPlantFilters()
  })

  // Table sorting
  $('.table th[data-bs-toggle="tooltip"]').on("click", function () {
    const table = $(this).closest("table")
    const columnIndex = $(this).index()
    sortTable(table, columnIndex)
  })

  // Report generation
  $("#generateReport").on("click", () => {
    generateReport()
  })

  $("#exportPDF").on("click", () => {
    exportReport("pdf")
  })

  $("#exportExcel").on("click", () => {
    exportReport("excel")
  })

  // Modal form submissions
  $(".modal .btn-success").on("click", function () {
    const modal = $(this).closest(".modal")
    const form = modal.find("form")

    if (validateForm(form)) {
      // Simulate form submission
      showNotification("Success!", "Record has been saved successfully.", "success")
      modal.modal("hide")
      form[0].reset()
    }
  })

  // Action buttons
  $(document).on("click", ".btn-outline-primary", () => {
    showNotification("Edit", "Edit functionality would be implemented here.", "info")
  })

  $(document).on("click", ".btn-outline-warning", () => {
    showNotification("Status Change", "Status change functionality would be implemented here.", "warning")
  })

  $(document).on("click", ".btn-outline-danger", () => {
    if (confirm("Are you sure you want to delete this record?")) {
      showNotification("Deleted", "Record has been deleted successfully.", "success")
    }
  })

  $(document).on("click", ".btn-outline-info", () => {
    showNotification("View Details", "Detail view functionality would be implemented here.", "info")
  })
})

// Initialize charts
function initializeCharts() {
  // Category Distribution Chart
  const categoryCtx = document.getElementById("categoryChart").getContext("2d")
  new Chart(categoryCtx, {
    type: "bar",
    data: {
      labels: ["Flowering Plants", "Trees", "Herbs", "Shrubs", "Grasses", "Ferns"],
      datasets: [
        {
          label: "Number of Plants",
          data: [156, 89, 67, 45, 32, 28],
          backgroundColor: [
            "rgba(40, 167, 69, 0.8)",
            "rgba(40, 167, 69, 0.7)",
            "rgba(40, 167, 69, 0.6)",
            "rgba(40, 167, 69, 0.5)",
            "rgba(40, 167, 69, 0.4)",
            "rgba(40, 167, 69, 0.3)",
          ],
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })

  // User Activity Chart
  const activityCtx = document.getElementById("activityChart").getContext("2d")
  new Chart(activityCtx, {
    type: "doughnut",
    data: {
      labels: ["Active Users", "Inactive Users", "New Users"],
      datasets: [
        {
          data: [1047, 150, 50],
          backgroundColor: ["rgba(40, 167, 69, 0.8)", "rgba(220, 53, 69, 0.8)", "rgba(255, 193, 7, 0.8)"],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  })

  // Report Chart (initially empty)
  const reportCtx = document.getElementById("reportChart").getContext("2d")
  window.reportChart = new Chart(reportCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

// Filter table function
function filterTable(tableSelector, searchTerm) {
  $(tableSelector + " tbody tr").each(function () {
    const rowText = $(this).text().toLowerCase()
    if (rowText.includes(searchTerm)) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
}

// Apply user filters
function applyUserFilters() {
  const roleFilter = $("#roleFilter").val()
  const statusFilter = $("#statusFilter").val()

  $("#usersTable tbody tr").each(function () {
    let showRow = true

    if (roleFilter) {
      const roleText = $(this).find("td:nth-child(3)").text().toLowerCase()
      if (!roleText.includes(roleFilter.toLowerCase())) {
        showRow = false
      }
    }

    if (statusFilter && showRow) {
      const statusText = $(this).find("td:nth-child(4)").text().toLowerCase()
      if (!statusText.includes(statusFilter.toLowerCase())) {
        showRow = false
      }
    }

    if (showRow) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
}

// Apply plant filters
function applyPlantFilters() {
  const categoryFilter = $("#plantCategoryFilter").val()

  $("#plantsTable tbody tr").each(function () {
    let showRow = true

    if (categoryFilter) {
      const categoryText = $(this).find("td:nth-child(4)").text().toLowerCase()
      if (!categoryText.includes(categoryFilter.toLowerCase())) {
        showRow = false
      }
    }

    if (showRow) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
}

// Sort table function
function sortTable(table, columnIndex) {
  const tbody = table.find("tbody")
  const rows = tbody.find("tr").toArray()

  rows.sort((a, b) => {
    const aText = $(a).find("td").eq(columnIndex).text().trim()
    const bText = $(b).find("td").eq(columnIndex).text().trim()

    // Try to parse as numbers first
    const aNum = Number.parseFloat(aText)
    const bNum = Number.parseFloat(bText)

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }

    // Sort as strings
    return aText.localeCompare(bText)
  })

  tbody.empty().append(rows)
}

// Generate report
function generateReport() {
  const startDate = $("#startDate").val()
  const endDate = $("#endDate").val()
  const category = $("#reportCategory").val()
  const climate = $("#reportClimate").val()

  // Simulate report generation
  showNotification("Report Generated", "Report has been generated successfully.", "success")

  // Update report chart with sample data
  const sampleData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Plants Added",
        data: [12, 19, 8, 15, 22, 18],
        borderColor: "rgba(40, 167, 69, 1)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
      },
    ],
  }

  window.reportChart.data = sampleData
  window.reportChart.update()
}

// Export report
function exportReport(format) {
  showNotification("Export Started", `${format.toUpperCase()} export has been initiated.`, "info")

  // Simulate export process
  setTimeout(() => {
    showNotification("Export Complete", `Report has been exported as ${format.toUpperCase()}.`, "success")
  }, 2000)
}

// Form validation
function validateForm(form) {
  let isValid = true

  form.find("input[required], select[required], textarea[required]").each(function () {
    if (!$(this).val()) {
      $(this).addClass("is-invalid")
      isValid = false
    } else {
      $(this).removeClass("is-invalid")
    }
  })

  return isValid
}

// Show notification
function showNotification(title, message, type) {
  // Create toast notification
  const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === "success" ? "success" : type === "warning" ? "warning" : type === "danger" ? "danger" : "info"} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `

  // Add toast container if it doesn't exist
  if (!$("#toastContainer").length) {
    $("body").append(
      '<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;"></div>',
    )
  }

  const $toast = $(toastHtml)
  $("#toastContainer").append($toast)

  const toast = new bootstrap.Toast($toast[0])
  toast.show()

  // Remove toast element after it's hidden
  $toast.on("hidden.bs.toast", function () {
    $(this).remove()
  })
}

// Refresh data function
function refreshData() {
  showNotification("Refreshing", "Data is being refreshed...", "info")

  // Simulate data refresh
  setTimeout(() => {
    showNotification("Refreshed", "Data has been refreshed successfully.", "success")
  }, 1500)
}

// Auto-refresh every 5 minutes
setInterval(refreshData, 300000)
