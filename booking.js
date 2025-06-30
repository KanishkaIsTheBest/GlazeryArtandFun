// Booking System JavaScript

// Global booking state
let bookingState = {
  currentStep: 1,
  selectedService: null,
  selectedDate: null,
  selectedTimeSlot: null,
  participants: 1,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
};

// Mock services data
const services = {
  "pottery-painting": {
    id: "pottery-painting",
    name: "Pottery Painting",
    price: 25,
    duration: 120,
    maxParticipants: 12,
  },
  "kids-session": {
    id: "kids-session",
    name: "Kids Creative Session",
    price: 18,
    duration: 90,
    maxParticipants: 8,
  },
  "private-party": {
    id: "private-party",
    name: "Private Party",
    price: 45,
    duration: 150,
    maxParticipants: 20,
  },
  "wheel-throwing": {
    id: "wheel-throwing",
    name: "Wheel Throwing Workshop",
    price: 55,
    duration: 180,
    maxParticipants: 6,
  },
};

// Mock time slots data
function getMockTimeSlots(date, serviceId) {
  const slots = [
    { time: "10:00 - 12:00", price: services[serviceId].price, available: 8 },
    { time: "12:30 - 2:30", price: services[serviceId].price, available: 5 },
    { time: "3:00 - 5:00", price: services[serviceId].price, available: 12 },
    { time: "5:30 - 7:30", price: services[serviceId].price, available: 3 },
    { time: "8:00 - 10:00", price: services[serviceId].price, available: 0 },
  ];

  // Filter out evening slots for kids sessions
  if (serviceId === "kids-session") {
    return slots.slice(0, 3);
  }

  return slots;
}

// Initialize booking system
document.addEventListener("DOMContentLoaded", function () {
  initializeBookingSystem();
});

function initializeBookingSystem() {
  setupServiceSelection();
  setupCalendar();
  setupStepNavigation();
  updateSummary();
  setupFormValidation();
}

// Service Selection
function setupServiceSelection() {
  const serviceOptions = document.querySelectorAll(".service-option");

  serviceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selection from other options
      serviceOptions.forEach((opt) => opt.classList.remove("selected"));

      // Select current option
      this.classList.add("selected");

      // Update booking state
      const serviceId = this.dataset.service;
      const price = parseInt(this.dataset.price);
      const duration = parseInt(this.dataset.duration);

      bookingState.selectedService = {
        id: serviceId,
        name: services[serviceId].name,
        price: price,
        duration: duration,
        maxParticipants: services[serviceId].maxParticipants,
      };

      updateSummary();
      updateContinueButton();
    });
  });
}

// Calendar functionality
function setupCalendar() {
  generateCalendar();
  setupCalendarNavigation();
}

function setupCalendarNavigation() {
  document.getElementById("prev-month").addEventListener("click", () => {
    bookingState.currentMonth--;
    if (bookingState.currentMonth < 0) {
      bookingState.currentMonth = 11;
      bookingState.currentYear--;
    }
    generateCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    bookingState.currentMonth++;
    if (bookingState.currentMonth > 11) {
      bookingState.currentMonth = 0;
      bookingState.currentYear++;
    }
    generateCalendar();
  });
}

function generateCalendar() {
  const monthYear = document.getElementById("calendar-month-year");
  const calendarGrid = document.querySelector(".calendar-grid");

  // Update month/year display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthYear.textContent = `${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;

  // Clear existing calendar days (keep headers)
  const dayHeaders = calendarGrid.querySelectorAll(".calendar-day-header");
  calendarGrid.innerHTML = "";
  dayHeaders.forEach((header) => calendarGrid.appendChild(header));

  // Get first day of month and number of days
  const firstDay = new Date(
    bookingState.currentYear,
    bookingState.currentMonth,
    1,
  ).getDay();
  const daysInMonth = new Date(
    bookingState.currentYear,
    bookingState.currentMonth + 1,
    0,
  ).getDate();
  const today = new Date();

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day disabled";
    calendarGrid.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    // Check if this is today
    const dayDate = new Date(
      bookingState.currentYear,
      bookingState.currentMonth,
      day,
    );
    if (
      dayDate.toDateString() === today.toDateString() &&
      bookingState.currentMonth === today.getMonth() &&
      bookingState.currentYear === today.getFullYear()
    ) {
      dayElement.classList.add("today");
    }

    // Disable past dates
    if (dayDate < today && dayDate.toDateString() !== today.toDateString()) {
      dayElement.classList.add("disabled");
    } else {
      dayElement.addEventListener("click", () => selectDate(dayDate));
    }

    // Check if this date is selected
    if (
      bookingState.selectedDate &&
      dayDate.toDateString() === bookingState.selectedDate.toDateString()
    ) {
      dayElement.classList.add("selected");
    }

    calendarGrid.appendChild(dayElement);
  }
}

function selectDate(date) {
  // Remove previous selection
  document
    .querySelectorAll(".calendar-day.selected")
    .forEach((day) => day.classList.remove("selected"));

  // Add selection to clicked day
  event.target.classList.add("selected");

  // Update booking state
  bookingState.selectedDate = date;

  updateSummary();
  updateContinueButton();
  generateTimeSlots();
}

// Time slots
function generateTimeSlots() {
  if (!bookingState.selectedService || !bookingState.selectedDate) return;

  const container = document.querySelector(".time-slots-grid");
  const dateDisplay = document.querySelector(".selected-date-display");

  // Update date display
  dateDisplay.textContent = `${bookingState.selectedService.name} • ${bookingState.selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

  // Generate time slots
  const slots = getMockTimeSlots(
    bookingState.selectedDate,
    bookingState.selectedService.id,
  );

  container.innerHTML = "";

  if (slots.length === 0) {
    container.innerHTML =
      '<p class="no-slots">No available time slots for this date. Please select another date.</p>';
    return;
  }

  slots.forEach((slot, index) => {
    const slotElement = document.createElement("div");
    slotElement.className = `time-slot ${slot.available === 0 ? "unavailable" : ""}`;

    const availabilityClass =
      slot.available === 0
        ? "full"
        : slot.available <= 3
          ? "limited"
          : "available";
    const availabilityText =
      slot.available === 0
        ? "Full"
        : slot.available <= 3
          ? `${slot.available} spots left`
          : "Available";

    slotElement.innerHTML = `
            <div class="time-info">
                <div class="time-display">${slot.time}</div>
                <div class="availability-badge ${availabilityClass}">${availabilityText}</div>
            </div>
            <div class="time-price">
                <div class="price-amount">$${slot.price}</div>
                <div class="price-per">per person</div>
            </div>
        `;

    if (slot.available > 0) {
      slotElement.addEventListener("click", () => selectTimeSlot(slot, index));
    }

    container.appendChild(slotElement);
  });
}

function selectTimeSlot(slot, index) {
  // Remove previous selection
  document
    .querySelectorAll(".time-slot.selected")
    .forEach((slot) => slot.classList.remove("selected"));

  // Add selection to clicked slot
  event.currentTarget.classList.add("selected");

  // Update booking state
  bookingState.selectedTimeSlot = {
    time: slot.time,
    price: slot.price,
    available: slot.available,
  };

  updateSummary();
  updateContinueButton();
  updateParticipantsOptions();
}

// Form handling
function setupFormValidation() {
  const form = document.getElementById("booking-form");
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("input", updateContinueButton);
    input.addEventListener("change", updateFormData);
  });

  // Setup participants dropdown
  const participantsSelect = document.getElementById("participants");
  participantsSelect.addEventListener("change", (e) => {
    bookingState.participants = parseInt(e.target.value);
    updateSummary();
  });
}

function updateParticipantsOptions() {
  const participantsSelect = document.getElementById("participants");
  const maxParticipants = Math.min(
    bookingState.selectedService?.maxParticipants || 1,
    bookingState.selectedTimeSlot?.available || 1,
  );

  participantsSelect.innerHTML = '<option value="">Select number</option>';

  for (let i = 1; i <= maxParticipants; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} ${i === 1 ? "person" : "people"}`;
    if (i === bookingState.participants) {
      option.selected = true;
    }
    participantsSelect.appendChild(option);
  }
}

function updateFormData() {
  const form = document.getElementById("booking-form");
  const formData = new FormData(form);

  bookingState.customerInfo = {
    name: formData.get("customerName"),
    email: formData.get("customerEmail"),
    phone: formData.get("customerPhone"),
    specialRequests: formData.get("specialRequests"),
  };
}

// Step navigation
function setupStepNavigation() {
  updateStepDisplay();
}

function goToPreviousStep() {
  if (bookingState.currentStep > 1) {
    bookingState.currentStep--;
    updateStepDisplay();
    updateContinueButton();
  }
}

function proceedToNext() {
  if (canProceedToNext()) {
    if (bookingState.currentStep === 4) {
      submitBooking();
    } else {
      bookingState.currentStep++;
      updateStepDisplay();
      updateContinueButton();

      // Special handling for specific steps
      if (bookingState.currentStep === 3) {
        generateTimeSlots();
      } else if (bookingState.currentStep === 4) {
        updateParticipantsOptions();
      }
    }
  }
}

function updateStepDisplay() {
  // Update progress steps
  document.querySelectorAll(".step").forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove("active", "completed");

    if (stepNumber === bookingState.currentStep) {
      step.classList.add("active");
    } else if (stepNumber < bookingState.currentStep) {
      step.classList.add("completed");
    }
  });

  // Update step content
  document.querySelectorAll(".booking-step").forEach((step, index) => {
    step.classList.remove("active");
    if (index + 1 === bookingState.currentStep) {
      step.classList.add("active");
    }
  });
}

function canProceedToNext() {
  switch (bookingState.currentStep) {
    case 1:
      return bookingState.selectedService !== null;
    case 2:
      return bookingState.selectedDate !== null;
    case 3:
      return bookingState.selectedTimeSlot !== null;
    case 4:
      const form = document.getElementById("booking-form");
      const requiredFields = form.querySelectorAll("[required]");
      return Array.from(requiredFields).every((field) => field.value.trim());
    default:
      return false;
  }
}

// Summary updates
function updateSummary() {
  const summaryService = document.getElementById("summary-service");
  const summaryDate = document.getElementById("summary-date");
  const summaryTime = document.getElementById("summary-time");
  const summaryParticipants = document.getElementById("summary-participants");
  const summaryTotal = document.getElementById("summary-total");
  const summaryBreakdown = document.getElementById("summary-breakdown");

  // Update service
  summaryService.textContent = bookingState.selectedService
    ? bookingState.selectedService.name
    : "Not selected";

  // Update date
  summaryDate.textContent = bookingState.selectedDate
    ? bookingState.selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Not selected";

  // Update time
  summaryTime.textContent = bookingState.selectedTimeSlot
    ? bookingState.selectedTimeSlot.time
    : "Not selected";

  // Update participants
  summaryParticipants.textContent = `${bookingState.participants} ${bookingState.participants === 1 ? "person" : "people"}`;

  // Calculate and update total
  const basePrice = bookingState.selectedTimeSlot
    ? bookingState.selectedTimeSlot.price
    : bookingState.selectedService?.price || 0;
  const total = basePrice * bookingState.participants;

  summaryTotal.textContent = `$${total}`;
  summaryBreakdown.textContent = `${bookingState.participants} × $${basePrice}`;
}

function updateContinueButton() {
  const button = document.getElementById("continue-button");
  const canProceed = canProceedToNext();

  button.disabled = !canProceed;

  // Update button text based on current step
  const buttonTexts = {
    1: "Continue to Date",
    2: "Continue to Time",
    3: "Continue to Details",
    4: "Complete Booking",
  };

  button.textContent = buttonTexts[bookingState.currentStep];
}

// Booking submission
async function submitBooking() {
  const button = document.getElementById("continue-button");
  const originalText = button.textContent;

  try {
    // Show loading state
    button.textContent = "Processing...";
    button.disabled = true;

    // Collect all booking data
    updateFormData();

    const bookingData = {
      service: bookingState.selectedService,
      date: bookingState.selectedDate.toISOString().split("T")[0],
      timeSlot: bookingState.selectedTimeSlot,
      participants: bookingState.participants,
      customerInfo: bookingState.customerInfo,
      total: bookingState.selectedTimeSlot.price * bookingState.participants,
    };

    // Simulate API call
    await simulateBookingSubmission(bookingData);

    // Show success
    showSuccessModal();
  } catch (error) {
    console.error("Booking submission failed:", error);
    window.GlazeryUtils.showNotification(
      "Booking failed. Please try again.",
      "error",
    );

    // Reset button
    button.textContent = originalText;
    button.disabled = false;
  }
}

async function simulateBookingSubmission(bookingData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate occasional failure
  if (Math.random() < 0.1) {
    throw new Error("Booking submission failed");
  }

  // Save booking to localStorage for demo purposes
  const bookingId = `GLZ${Date.now()}`;
  const booking = {
    ...bookingData,
    id: bookingId,
    timestamp: new Date().toISOString(),
    status: "confirmed",
  };

  window.GlazeryUtils.saveToLocalStorage(`booking_${bookingId}`, booking);

  return booking;
}

function showSuccessModal() {
  const modal = document.getElementById("success-modal");
  const bookingId = document.getElementById("booking-id");
  const confirmationEmail = document.getElementById("confirmation-email");

  // Generate booking ID
  const id = `GLZ${Date.now()}`;
  bookingId.textContent = id;
  confirmationEmail.textContent = bookingState.customerInfo.email;

  // Show modal
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Send notification
  window.GlazeryUtils.showNotification(
    "Booking confirmed successfully!",
    "success",
  );
}

// Utility functions
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeString) {
  const [start, end] = timeString.split(" - ");
  return `${start} - ${end}`;
}

// Export for use in other files
window.BookingSystem = {
  bookingState,
  goToPreviousStep,
  proceedToNext,
  showSuccessModal,
  updateSummary,
};
