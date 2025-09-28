// Plant Management Wizard JavaScript
class PlantWizard {
  constructor() {
    this.currentStep = 1
    this.totalSteps = 4
    this.formData = {}
    this.bootstrap = window.bootstrap
    this.init()
  }

  init() {
    this.bindEvents()
    this.initializeSearchFilters()
    this.initializeImageUpload()
  }

  bindEvents() {
    // Navigation buttons
    document.getElementById("nextBtn").addEventListener("click", () => this.nextStep())
    document.getElementById("prevBtn").addEventListener("click", () => this.prevStep())

    // Form validation on input change
    document.querySelectorAll("input[required], select[required]").forEach((input) => {
      input.addEventListener("change", () => this.validateCurrentStep())
    })

    // Modal reset on close
    document.getElementById("addPlantWizardModal").addEventListener("hidden.bs.modal", () => {
      this.resetWizard()
    })
  }

  initializeSearchFilters() {
    // Soil types search
    const soilSearch = document.getElementById("soilSearch")
    if (soilSearch) {
      soilSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("soilCheckboxes", e.target.value)
      })
    }

    // Regions search
    const regionSearch = document.getElementById("regionSearch")
    if (regionSearch) {
      regionSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("regionCheckboxes", e.target.value)
      })
    }

    // Diseases search
    const diseaseSearch = document.getElementById("diseaseSearch")
    if (diseaseSearch) {
      diseaseSearch.addEventListener("input", (e) => {
        this.filterCheckboxes("diseaseCheckboxes", e.target.value)
      })
    }
  }

  filterCheckboxes(containerId, searchTerm) {
    const container = document.getElementById(containerId)
    const items = container.querySelectorAll(".checkbox-item")

    items.forEach((item) => {
      const label = item.querySelector("label").textContent.toLowerCase()
      const matches = label.includes(searchTerm.toLowerCase())
      item.style.display = matches ? "flex" : "none"
    })
  }

  initializeImageUpload() {
    const uploadArea = document.getElementById("imageUploadArea")
    const imageInput = document.getElementById("imageInput")
    const imagePreview = document.getElementById("imagePreview")

    // Click to upload
    uploadArea.addEventListener("click", () => imageInput.click())

    // Drag and drop
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      uploadArea.classList.add("dragover")
    })

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover")
    })

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      uploadArea.classList.remove("dragover")
      const files = e.dataTransfer.files
      this.handleImageFiles(files)
    })

    // File input change
    imageInput.addEventListener("change", (e) => {
      this.handleImageFiles(e.target.files)
    })
  }

  handleImageFiles(files) {
    const imagePreview = document.getElementById("imagePreview")
    imagePreview.innerHTML = ""

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageCard = document.createElement("div")
          imageCard.className = "col-md-3 mb-3"
          imageCard.innerHTML = `
                        <div class="card">
                            <img src="${e.target.result}" class="card-img-top" style="height: 150px; object-fit: cover;">
                            <div class="card-body p-2">
                                <small class="text-muted">${file.name}</small>
                                <button type="button" class="btn btn-sm btn-outline-danger float-end" onclick="this.closest('.col-md-3').remove()">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `

          if (imagePreview.children.length === 0) {
            imagePreview.innerHTML = '<div class="row"></div>'
          }
          imagePreview.querySelector(".row").appendChild(imageCard)
        }
        reader.readAsDataURL(file)
      }
    })
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData()

      if (this.currentStep < this.totalSteps) {
        this.currentStep++
        this.updateWizardDisplay()

        if (this.currentStep === this.totalSteps) {
          this.populateReview()
        }
      } else {
        this.submitForm()
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--
      this.updateWizardDisplay()
    }
  }

  validateCurrentStep() {
    const currentStepContent = document.querySelector(`.step-content[data-step="${this.currentStep}"]`)
    const requiredFields = currentStepContent.querySelectorAll("input[required], select[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid")
        isValid = false
      } else {
        field.classList.remove("is-invalid")
      }
    })

    return isValid
  }

  saveCurrentStepData() {
    const currentStepContent = document.querySelector(`.step-content[data-step="${this.currentStep}"]`)
    const formElements = currentStepContent.querySelectorAll("input, select, textarea")

    formElements.forEach((element) => {
      if (element.type === "checkbox") {
        if (!this.formData[element.name]) {
          this.formData[element.name] = []
        }
        if (element.checked) {
          this.formData[element.name].push(element.value)
        }
      } else {
        this.formData[element.name] = element.value
      }
    })
  }

  updateWizardDisplay() {
    // Update step indicators
    document.querySelectorAll(".step").forEach((step, index) => {
      const stepNumber = index + 1
      step.classList.remove("active", "completed")

      if (stepNumber < this.currentStep) {
        step.classList.add("completed")
        step.querySelector(".step-circle").innerHTML = '<i class="bi bi-check"></i>'
      } else if (stepNumber === this.currentStep) {
        step.classList.add("active")
        step.querySelector(".step-circle").textContent = stepNumber
      } else {
        step.querySelector(".step-circle").textContent = stepNumber
      }
    })

    // Update step content
    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active")
    })
    document.querySelector(`.step-content[data-step="${this.currentStep}"]`).classList.add("active")

    // Update navigation buttons
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    prevBtn.style.display = this.currentStep > 1 ? "block" : "none"

    if (this.currentStep === this.totalSteps) {
      nextBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Add Plant'
      nextBtn.classList.remove("btn-wizard-primary")
      nextBtn.classList.add("btn-wizard-primary")
    } else {
      nextBtn.innerHTML = 'Next<i class="bi bi-arrow-right ms-2"></i>'
    }
  }

  populateReview() {
    const reviewContent = document.getElementById("reviewContent")
    let html = ""

    // Basic Information
    html += `
            <div class="review-item">
                <span class="review-label">Plant Name:</span>
                <span class="review-value">${this.formData.plantName || "Not specified"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Scientific Name:</span>
                <span class="review-value">${this.formData.scientificName || "Not specified"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Category:</span>
                <span class="review-value">${this.formData.category || "Not specified"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Climate:</span>
                <span class="review-value">${this.formData.climate || "Not specified"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Growth Cycle:</span>
                <span class="review-value">${this.formData.growthCycle || "Not specified"}</span>
            </div>
        `

    // Soil Types
    if (this.formData["soilTypes[]"] && this.formData["soilTypes[]"].length > 0) {
      html += `
                <div class="review-item">
                    <span class="review-label">Soil Types:</span>
                    <span class="review-value">${this.formData["soilTypes[]"].join(", ")}</span>
                </div>
            `
    }

    // Regions
    if (this.formData["regions[]"] && this.formData["regions[]"].length > 0) {
      html += `
                <div class="review-item">
                    <span class="review-label">Regions:</span>
                    <span class="review-value">${this.formData["regions[]"].join(", ")}</span>
                </div>
            `
    }

    // Diseases
    if (this.formData["diseases[]"] && this.formData["diseases[]"].length > 0) {
      html += `
                <div class="review-item">
                    <span class="review-label">Common Diseases:</span>
                    <span class="review-value">${this.formData["diseases[]"].join(", ")}</span>
                </div>
            `
    }

    reviewContent.innerHTML = html
  }

  submitForm() {
    // Show loading state
    const nextBtn = document.getElementById("nextBtn")
    const originalText = nextBtn.innerHTML
    nextBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Adding Plant...'
    nextBtn.disabled = true

    // Simulate form submission
    setTimeout(() => {
      // Here you would normally send the data to your server
      console.log("Form Data:", this.formData)

      // Show success message
      this.showNotification("success", "Plant added successfully!")

      // Close modal and reset
      const modal = this.bootstrap.Modal.getInstance(document.getElementById("addPlantWizardModal"))
      modal.hide()

      // Reset button
      nextBtn.innerHTML = originalText
      nextBtn.disabled = false

      // Optionally refresh the plants table
      // this.refreshPlantsTable();
    }, 2000)
  }

  resetWizard() {
    this.currentStep = 1
    this.formData = {}

    // Reset form
    document.getElementById("plantWizardForm").reset()

    // Reset step display
    this.updateWizardDisplay()

    // Clear image preview
    document.getElementById("imagePreview").innerHTML = ""

    // Clear search filters
    document.querySelectorAll(".checkbox-search input").forEach((input) => {
      input.value = ""
    })

    // Show all checkbox items
    document.querySelectorAll(".checkbox-item").forEach((item) => {
      item.style.display = "flex"
    })
  }

  showNotification(type, message) {
    const colorMap = {
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    }

    const toast = document.createElement("div")
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colorMap[type] || "#6b7280"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-weight: 500;
        `
    toast.textContent = message

    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }
}

// Initialize wizard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PlantWizard()

  // Initialize sidebar toggle
  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("show")
  })

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl))
})
