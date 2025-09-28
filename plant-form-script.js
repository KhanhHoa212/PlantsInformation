// Plant Form Multi-Step Functionality
class PlantFormWizard {
  constructor() {
    this.currentStep = 1
    this.totalSteps = 4
    this.init()
  }

  init() {
    this.bindEvents()
    this.initSearchFilters()
    this.updateStepDisplay()
  }

  bindEvents() {
    // Next button
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (this.validateCurrentStep()) {
        this.nextStep()
      }
    })

    // Previous button
    document.getElementById("prevBtn").addEventListener("click", () => {
      this.prevStep()
    })

    // Form submission
    document.getElementById("addPlantForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.submitForm()
    })

    // Modal reset on close
    document.getElementById("addPlantModal").addEventListener("hidden.bs.modal", () => {
      this.resetForm()
    })

    // Image preview
    const imageUrlInput = document.querySelector('input[name="imageUrl"]')
    const imageFileInput = document.querySelector('input[name="imageFile"]')

    if (imageUrlInput) {
      imageUrlInput.addEventListener("input", (e) => {
        this.previewImage(e.target.value)
      })
    }

    if (imageFileInput) {
      imageFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.previewImage(e.target.result)
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  initSearchFilters() {
    // Region search filter
    const regionSearch = document.getElementById("regionSearch")
    if (regionSearch) {
      regionSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("regionList", e.target.value)
      })
    }

    // Soil search filter
    const soilSearch = document.getElementById("soilSearch")
    if (soilSearch) {
      soilSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("soilList", e.target.value)
      })
    }

    // Disease search filter
    const diseaseSearch = document.getElementById("diseaseSearch")
    if (diseaseSearch) {
      diseaseSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("diseaseList", e.target.value)
      })
    }
  }

  filterCheckboxes(listId, searchTerm) {
    const list = document.getElementById(listId)
    const checkboxes = list.querySelectorAll(".form-check")

    checkboxes.forEach((checkbox) => {
      const label = checkbox.querySelector(".form-check-label").textContent.toLowerCase()
      const matches = label.includes(searchTerm.toLowerCase())
      checkbox.style.display = matches ? "block" : "none"
    })
  }

  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`)
    const requiredFields = currentStepElement.querySelectorAll("[required]")

    let isValid = true
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid")
        isValid = false
      } else {
        field.classList.remove("is-invalid")
      }
    })

    if (!isValid) {
      this.showAlert("Please fill in all required fields.", "warning")
    }

    return isValid
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++
      this.updateStepDisplay()
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--
      this.updateStepDisplay()
    }
  }

  updateStepDisplay() {
    // Update form steps
    document.querySelectorAll(".form-step").forEach((step) => {
      step.classList.remove("active")
    })
    document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add("active")

    // Update progress steps
    document.querySelectorAll(".step").forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.remove("active", "completed")

      if (stepNumber === this.currentStep) {
        step.classList.add("active")
      } else if (stepNumber < this.currentStep) {
        step.classList.add("completed")
      }
    })

    // Update buttons
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const submitBtn = document.getElementById("submitBtn")

    prevBtn.style.display = this.currentStep === 1 ? "none" : "inline-block"

    if (this.currentStep === this.totalSteps) {
      nextBtn.style.display = "none"
      submitBtn.style.display = "inline-block"
    } else {
      nextBtn.style.display = "inline-block"
      submitBtn.style.display = "none"
    }
  }

  previewImage(src) {
    const preview = document.getElementById("imagePreview")
    const img = preview.querySelector("img")

    if (src) {
      img.src = src
      preview.style.display = "block"
    } else {
      preview.style.display = "none"
    }
  }

  submitForm() {
    if (!this.validateCurrentStep()) {
      return
    }

    // Collect form data
    const formData = new FormData(document.getElementById("addPlantForm"))

    // Get selected checkboxes
    const selectedRegions = Array.from(document.querySelectorAll('input[name="regionIds"]:checked')).map(
      (cb) => cb.value,
    )
    const selectedSoils = Array.from(document.querySelectorAll('input[name="soilTypeIds"]:checked')).map(
      (cb) => cb.value,
    )
    const selectedDiseases = Array.from(document.querySelectorAll('input[name="diseaseIds"]:checked')).map(
      (cb) => cb.value,
    )

    // Add arrays to form data
    formData.delete("regionIds")
    formData.delete("soilTypeIds")
    formData.delete("diseaseIds")

    selectedRegions.forEach((id) => formData.append("regionIds", id))
    selectedSoils.forEach((id) => formData.append("soilTypeIds", id))
    selectedDiseases.forEach((id) => formData.append("diseaseIds", id))

    console.log("[v0] Form data collected:", Object.fromEntries(formData))

    // Here you would normally send the data to your backend
    // For demo purposes, we'll just show a success message
    this.showAlert("Plant added successfully!", "success")

    // Close modal after a delay
    setTimeout(() => {
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("addPlantModal"))
      modal.hide()
    }, 1500)
  }

  resetForm() {
    this.currentStep = 1
    document.getElementById("addPlantForm").reset()
    document.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid")
    })
    document.getElementById("imagePreview").style.display = "none"
    this.updateStepDisplay()
  }

  showAlert(message, type = "info") {
    // Create alert element
    const alertDiv = document.createElement("div")
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    alertDiv.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;"
    alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

    document.body.appendChild(alertDiv)

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove()
      }
    }, 3000)
  }
}

// Initialize the wizard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PlantFormWizard()
})

// Additional utility functions
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  sidebar.classList.toggle("collapsed")
}

// Search functionality for plant table
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('input[placeholder="Search plants..."]')
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const tableRows = document.querySelectorAll("#plantsTable tbody tr")

      tableRows.forEach((row) => {
        const plantName = row.cells[1].textContent.toLowerCase()
        const scientificName = row.cells[2].textContent.toLowerCase()
        const matches = plantName.includes(searchTerm) || scientificName.includes(searchTerm)
        row.style.display = matches ? "" : "none"
      })
    })
  }
})
