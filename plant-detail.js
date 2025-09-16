// JavaScript for Plant Detail Page

// Declare $ and bootstrap variables
const $ = window.jQuery
const bootstrap = window.bootstrap

function showAlert(message, type = "info") {
  const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `

  $("body").append(alertHtml)

  setTimeout(() => {
    $(".alert").alert("close")
  }, 3000)
}

$(document).ready(() => {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Get plant ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const plantId = urlParams.get("id")

  if (plantId) {
    loadPlantDetails(plantId)
  }

  // Tab switching with URL hash
  $('button[data-bs-toggle="tab"]').on("shown.bs.tab", (e) => {
    const tabId = $(e.target).attr("data-bs-target")
    window.location.hash = tabId
  })

  // Load tab from URL hash
  if (window.location.hash) {
    const hash = window.location.hash
    $(`button[data-bs-target="${hash}"]`).tab("show")
  }

  // Favorite button functionality
  $('.btn:contains("Add to Favorites")').on("click", function () {
    toggleFavorite($(this))
  })

  // Share button functionality
  $('.btn:contains("Share")').on("click", () => {
    sharePlant()
  })

  function loadPlantDetails(plantId) {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll simulate loading
    showLoadingState()

    setTimeout(() => {
      hideLoadingState()
      // Plant details would be populated here
      console.log(`Loading plant details for ID: ${plantId}`)
    }, 1000)
  }

  function toggleFavorite($button) {
    const isFavorited = $button.hasClass("favorited")

    if (isFavorited) {
      $button.removeClass("favorited btn-success").addClass("btn-outline-success")
      $button.html('<i class="bi bi-heart"></i> Add to Favorites')
      showAlert("Removed from favorites", "info")
    } else {
      $button.addClass("favorited btn-success").removeClass("btn-outline-success")
      $button.html('<i class="bi bi-heart-fill"></i> Remove from Favorites')
      showAlert("Added to favorites!", "success")
    }
  }

  function sharePlant() {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: "Check out this plant information",
          url: window.location.href,
        })
        .then(() => {
          showAlert("Shared successfully!", "success")
        })
        .catch((error) => {
          console.log("Error sharing:", error)
          fallbackShare()
        })
    } else {
      fallbackShare()
    }
  }

  function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showAlert("Link copied to clipboard!", "success")
      })
      .catch(() => {
        showAlert("Unable to copy link", "error")
      })
  }

  function showLoadingState() {
    $(".plant-header, .tab-content").addClass("loading")
  }

  function hideLoadingState() {
    $(".plant-header, .tab-content").removeClass("loading")
  }

  // Smooth scrolling within tabs
  $(".nav-tabs .nav-link").on("click", () => {
    setTimeout(() => {
      $("html, body").animate(
        {
          scrollTop: $("#plantTabs").offset().top - 100,
        },
        300,
      )
    }, 150)
  })

  // Image zoom functionality for carousel
  $(".carousel-item img").on("click", function () {
    const imgSrc = $(this).attr("src")
    const imgAlt = $(this).attr("alt")

    const modal = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${imgAlt}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${imgSrc}" class="img-fluid" alt="${imgAlt}">
                        </div>
                    </div>
                </div>
            </div>
        `

    $("body").append(modal)
    $("#imageModal").modal("show")

    $("#imageModal").on("hidden.bs.modal", function () {
      $(this).remove()
    })
  })

  // Print functionality
  function printPlantInfo() {
    window.print()
  }

  // Add print button to action buttons
  $(".action-buttons").append(`
        <button class="btn btn-outline-secondary ms-2" onclick="printPlantInfo()">
            <i class="bi bi-printer"></i> Print
        </button>
    `)
})

// Export functions (called from modal)
function exportToPDF() {
  showAlert("Generating PDF...", "info")

  // Simulate PDF generation
  setTimeout(() => {
    showAlert("PDF export completed!", "success")
    $("#exportModal").modal("hide")

    // In a real app, this would trigger a download
    console.log("PDF export would start here")
  }, 2000)
}

function exportToExcel() {
  showAlert("Generating Excel file...", "info")

  // Simulate Excel generation
  setTimeout(() => {
    showAlert("Excel export completed!", "success")
    $("#exportModal").modal("hide")

    // In a real app, this would trigger a download
    console.log("Excel export would start here")
  }, 2000)
}
