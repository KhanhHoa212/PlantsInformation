// Main JavaScript file for Plant Lookup Website

// Wait for jQuery to be available
;(() => {
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

      // Sample plant data
      const featuredPlants = [
        {
          id: 1,
          name: "Rose",
          scientificName: "Rosa rubiginosa",
          category: "flowers",
          image: "/beautiful-red-rose.png",
          description: "Classic flowering plant known for its beauty and fragrance.",
          climate: "temperate",
          soil: "loamy",
        },
        {
          id: 2,
          name: "Oak Tree",
          scientificName: "Quercus robur",
          category: "trees",
          image: "/majestic-oak-tree.jpg",
          description: "Large deciduous tree native to Europe and Asia.",
          climate: "temperate",
          soil: "clay",
        },
        {
          id: 3,
          name: "Basil",
          scientificName: "Ocimum basilicum",
          category: "herbs",
          image: "/fresh-basil-herb-plant.jpg",
          description: "Aromatic herb commonly used in cooking.",
          climate: "tropical",
          soil: "sandy",
        },
        {
          id: 4,
          name: "Tomato",
          scientificName: "Solanum lycopersicum",
          category: "vegetables",
          image: "/ripe-red-tomatoes.png",
          description: "Popular vegetable fruit used in many cuisines.",
          climate: "temperate",
          soil: "loamy",
        },
        {
          id: 5,
          name: "Lavender",
          scientificName: "Lavandula angustifolia",
          category: "flowers",
          image: "/purple-lavender-flowers-field.jpg",
          description: "Fragrant flowering plant with many uses.",
          climate: "arid",
          soil: "sandy",
        },
        {
          id: 6,
          name: "Mint",
          scientificName: "Mentha spicata",
          category: "herbs",
          image: "/fresh-mint-leaves-plant.jpg",
          description: "Refreshing herb with cooling properties.",
          climate: "temperate",
          soil: "loamy",
        },
      ]

      // Load featured plants on home page
      if ($("#featuredPlants").length) {
        loadFeaturedPlants()
      }

      // Search functionality
      $("#searchInput, #heroSearch").on("keypress", function (e) {
        if (e.which === 13) {
          e.preventDefault()
          performSearch($(this).val())
        }
      })

      // Quick filter buttons
      $(".filter-btn").on("click", function () {
        const filterType = $(this).data("filter")
        applyQuickFilter(filterType)
      })

      // Functions
      function loadFeaturedPlants() {
        const container = $("#featuredPlants")
        container.empty()

        featuredPlants.forEach((plant) => {
          const plantCard = createPlantCard(plant)
          container.append(plantCard)
        })

        // Add fade-in animation
        container.find(".plant-card").addClass("fade-in-up")
      }

      function createPlantCard(plant) {
        return `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card plant-card h-100" 
                             data-bs-toggle="popover" 
                             data-bs-placement="top" 
                             data-bs-content="${plant.description}"
                             data-bs-trigger="hover">
                            <img src="${plant.image}" class="card-img-top" alt="${plant.name}">
                            <div class="card-body">
                                <h5 class="card-title">${plant.name}</h5>
                                <p class="scientific-name">${plant.scientificName}</p>
                                <div class="plant-badges mb-3">
                                    <span class="badge bg-success me-1">${capitalizeFirst(plant.category)}</span>
                                    <span class="badge bg-info me-1">${capitalizeFirst(plant.climate)}</span>
                                    <span class="badge bg-warning">${capitalizeFirst(plant.soil)} Soil</span>
                                </div>
                                <a href="plant-detail.html?id=${plant.id}" class="btn btn-success">
                                    <i class="bi bi-eye"></i> View Details
                                </a>
                            </div>
                        </div>
                    </div>
                `
      }

      function performSearch(query) {
        if (query.trim() === "") {
          showAlert("Please enter a search term", "warning")
          return
        }

        // Simulate search - in real app, this would make an API call
        showAlert(`Searching for "${query}"...`, "info")

        setTimeout(() => {
          window.location.href = `plants.html?search=${encodeURIComponent(query)}`
        }, 1000)
      }

      function applyQuickFilter(filterType) {
        // Simulate filter application
        showAlert(`Applying ${filterType} filter...`, "info")

        setTimeout(() => {
          window.location.href = `plants.html?filter=${filterType}`
        }, 1000)
      }

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

      // Smooth scrolling for anchor links
      $('a[href^="#"]').on("click", function (e) {
        e.preventDefault()
        const target = $($(this).attr("href"))
        if (target.length) {
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 100,
            },
            500,
          )
        }
      })

      // Add loading states to buttons
      $(".btn").on("click", function () {
        const $btn = $(this)
        if (!$btn.hasClass("no-loading")) {
          const originalText = $btn.html()
          $btn.html('<span class="spinner-border spinner-border-sm me-2"></span>Loading...')
          $btn.prop("disabled", true)

          setTimeout(() => {
            $btn.html(originalText)
            $btn.prop("disabled", false)
          }, 2000)
        }
      })

      // Initialize autocomplete for search (basic implementation)
      const plantNames = featuredPlants.map((plant) => plant.name)

      $("#searchInput, #heroSearch").on("input", function () {
        const query = $(this).val().toLowerCase()
        if (query.length > 2) {
          const matches = plantNames.filter((name) => name.toLowerCase().includes(query))

          // In a real app, you'd show these matches in a dropdown
          console.log("Autocomplete matches:", matches)
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
