// JavaScript for Plants List Page

// Declare variables before using them
const $ = window.jQuery
const bootstrap = window.bootstrap
const tempusDominus = window.tempusDominus

$(document).ready(() => {
  // Initialize tooltips and popovers
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Initialize Tempus Dominus date picker
  const plantingSeasonPicker = new tempusDominus.TempusDominus(document.getElementById("plantingSeasonPicker"), {
    display: {
      viewMode: "months",
      components: {
        decades: false,
        year: true,
        month: true,
        date: false,
        hours: false,
        minutes: false,
        seconds: false,
      },
    },
    localization: {
      format: "MMMM",
    },
  })

  // Sample plant data (expanded)
  const allPlants = [
    {
      id: 1,
      name: "Rose",
      scientificName: "Rosa rubiginosa",
      category: "flowers",
      image: "/beautiful-red-rose.png",
      description: "Classic flowering plant known for its beauty and fragrance.",
      climate: "temperate",
      soil: "loamy",
      region: "europe",
      updated: "2024-01-15",
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
      region: "europe",
      updated: "2024-01-10",
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
      region: "asia",
      updated: "2024-01-20",
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
      region: "america",
      updated: "2024-01-18",
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
      region: "mediterranean",
      updated: "2024-01-12",
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
      region: "europe",
      updated: "2024-01-14",
    },
    {
      id: 7,
      name: "Sunflower",
      scientificName: "Helianthus annuus",
      category: "flowers",
      image: "/bright-yellow-sunflower.png",
      description: "Large flowering plant that follows the sun.",
      climate: "temperate",
      soil: "loamy",
      region: "america",
      updated: "2024-01-16",
    },
    {
      id: 8,
      name: "Pine Tree",
      scientificName: "Pinus sylvestris",
      category: "trees",
      image: "/tall-pine-tree-forest.jpg",
      description: "Evergreen coniferous tree.",
      climate: "temperate",
      soil: "sandy",
      region: "europe",
      updated: "2024-01-11",
    },
    {
      id: 9,
      name: "Oregano",
      scientificName: "Origanum vulgare",
      category: "herbs",
      image: "/oregano-herb-plant.jpg",
      description: "Mediterranean herb used in cooking.",
      climate: "arid",
      soil: "sandy",
      region: "mediterranean",
      updated: "2024-01-13",
    },
    {
      id: 10,
      name: "Carrot",
      scientificName: "Daucus carota",
      category: "vegetables",
      image: "/orange-carrots-in-soil.jpg",
      description: "Root vegetable rich in beta-carotene.",
      climate: "temperate",
      soil: "sandy",
      region: "europe",
      updated: "2024-01-17",
    },
    {
      id: 11,
      name: "Cactus",
      scientificName: "Opuntia ficus-indica",
      category: "flowers",
      image: "/desert-cactus-with-flowers.jpg",
      description: "Succulent plant adapted to arid conditions.",
      climate: "arid",
      soil: "sandy",
      region: "america",
      updated: "2024-01-19",
    },
    {
      id: 12,
      name: "Lettuce",
      scientificName: "Lactuca sativa",
      category: "vegetables",
      image: "/fresh-green-lettuce-leaves.jpg",
      description: "Leafy green vegetable commonly used in salads.",
      climate: "temperate",
      soil: "loamy",
      region: "mediterranean",
      updated: "2024-01-21",
    },
  ]

  let filteredPlants = [...allPlants]
  let currentPage = 1
  const plantsPerPage = 6
  let currentView = "grid"

  // Initialize page
  loadPlants()
  setupEventListeners()
  checkURLParameters()

  function setupEventListeners() {
    // Filter controls
    $("#applyFilters").on("click", applyFilters)
    $("#clearFilters").on("click", clearFilters)

    // Sort control
    $("#sortSelect").on("change", function () {
      sortPlants($(this).val())
    })

    // View controls
    $("#gridView").on("click", () => {
      setView("grid")
    })

    $("#listView").on("click", () => {
      setView("list")
    })

    // Search
    $("#searchInput").on("keypress", function (e) {
      if (e.which === 13) {
        e.preventDefault()
        searchPlants($(this).val())
      }
    })
  }

  function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search)

    // Check for category filter
    const category = urlParams.get("category")
    if (category) {
      $(`#cat${capitalizeFirst(category)}`).prop("checked", true)
      applyFilters()
    }

    // Check for region filter
    const region = urlParams.get("region")
    if (region) {
      // Apply region filter (would need additional checkboxes for regions)
      filteredPlants = allPlants.filter((plant) => plant.region === region)
      loadPlants()
    }

    // Check for search query
    const search = urlParams.get("search")
    if (search) {
      $("#searchInput").val(search)
      searchPlants(search)
    }
  }

  function applyFilters() {
    filteredPlants = [...allPlants]

    // Category filters
    const selectedCategories = []
    $('input[type="checkbox"][id^="cat"]:checked').each(function () {
      selectedCategories.push($(this).val())
    })

    if (selectedCategories.length > 0) {
      filteredPlants = filteredPlants.filter((plant) => selectedCategories.includes(plant.category))
    }

    // Climate filters
    const selectedClimates = []
    $('input[type="checkbox"][id^="clim"]:checked').each(function () {
      selectedClimates.push($(this).val())
    })

    if (selectedClimates.length > 0) {
      filteredPlants = filteredPlants.filter((plant) => selectedClimates.includes(plant.climate))
    }

    // Soil filters
    const selectedSoils = []
    $('input[type="checkbox"][id^="soil"]:checked').each(function () {
      selectedSoils.push($(this).val())
    })

    if (selectedSoils.length > 0) {
      filteredPlants = filteredPlants.filter((plant) => selectedSoils.includes(plant.soil))
    }

    currentPage = 1
    loadPlants()
    showAlert("Filters applied successfully!", "success")
  }

  function clearFilters() {
    $('input[type="checkbox"]').prop("checked", false)
    $("#plantingSeasonInput").val("")
    filteredPlants = [...allPlants]
    currentPage = 1
    loadPlants()
    showAlert("All filters cleared!", "info")
  }

  function searchPlants(query) {
    if (query.trim() === "") {
      filteredPlants = [...allPlants]
    } else {
      filteredPlants = allPlants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query.toLowerCase()) ||
          plant.scientificName.toLowerCase().includes(query.toLowerCase()) ||
          plant.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    currentPage = 1
    loadPlants()
  }

  function sortPlants(sortBy) {
    switch (sortBy) {
      case "name-asc":
        filteredPlants.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filteredPlants.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "updated":
        filteredPlants.sort((a, b) => new Date(b.updated) - new Date(a.updated))
        break
    }

    loadPlants()
  }

  function setView(viewType) {
    currentView = viewType

    if (viewType === "grid") {
      $("#gridView").addClass("active")
      $("#listView").removeClass("active")
    } else {
      $("#listView").addClass("active")
      $("#gridView").removeClass("active")
    }

    loadPlants()
  }

  function loadPlants() {
    const container = $("#plantGrid")
    container.empty()

    // Calculate pagination
    const totalPlants = filteredPlants.length
    const totalPages = Math.ceil(totalPlants / plantsPerPage)
    const startIndex = (currentPage - 1) * plantsPerPage
    const endIndex = Math.min(startIndex + plantsPerPage, totalPlants)
    const plantsToShow = filteredPlants.slice(startIndex, endIndex)

    // Update results count
    $("#resultsCount").text(`Showing ${startIndex + 1}-${endIndex} of ${totalPlants} plants`)

    // Load plants
    if (currentView === "grid") {
      plantsToShow.forEach((plant) => {
        const plantCard = createPlantCard(plant)
        container.append(plantCard)
      })
    } else {
      plantsToShow.forEach((plant) => {
        const plantListItem = createPlantListItem(plant)
        container.append(plantListItem)
      })
    }

    // Initialize popovers for new cards
    var popoverTriggerList = [].slice.call(container.find('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))

    // Update pagination
    updatePagination(totalPages)

    // Add animations
    container.find(".plant-card, .plant-list-item").addClass("fade-in-up")
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
                        <p class="card-text text-muted small">${plant.description}</p>
                        <a href="plant-detail.html?id=${plant.id}" class="btn btn-success">
                            <i class="bi bi-eye"></i> View Details
                        </a>
                    </div>
                </div>
            </div>
        `
  }

  function createPlantListItem(plant) {
    return `
            <div class="col-12 mb-3">
                <div class="card plant-list-item">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${plant.image}" class="img-fluid rounded-start h-100" alt="${plant.name}" style="object-fit: cover;">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 class="card-title">${plant.name}</h5>
                                        <p class="scientific-name">${plant.scientificName}</p>
                                    </div>
                                    <div class="plant-badges">
                                        <span class="badge bg-success me-1">${capitalizeFirst(plant.category)}</span>
                                        <span class="badge bg-info me-1">${capitalizeFirst(plant.climate)}</span>
                                        <span class="badge bg-warning">${capitalizeFirst(plant.soil)} Soil</span>
                                    </div>
                                </div>
                                <p class="card-text">${plant.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">Updated: ${formatDate(plant.updated)}</small>
                                    <a href="plant-detail.html?id=${plant.id}" class="btn btn-success">
                                        <i class="bi bi-eye"></i> View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  function updatePagination(totalPages) {
    const pagination = $("#pagination")
    pagination.empty()

    if (totalPages <= 1) return

    // Previous button
    const prevDisabled = currentPage === 1 ? "disabled" : ""
    pagination.append(`
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `)

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const active = i === currentPage ? "active" : ""
      pagination.append(`
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `)
    }

    // Next button
    const nextDisabled = currentPage === totalPages ? "disabled" : ""
    pagination.append(`
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `)

    // Pagination click handlers
    pagination.find(".page-link").on("click", function (e) {
      e.preventDefault()
      const page = Number.parseInt($(this).data("page"))
      if (page && page !== currentPage && page >= 1 && page <= totalPages) {
        currentPage = page
        loadPlants()
        $("html, body").animate({ scrollTop: 0 }, 500)
      }
    })
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

    setTimeout(() => {
      $(".alert").alert("close")
    }, 3000)
  }
})
