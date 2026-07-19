/* ==========================================================================
   APPOINTMENT BOOKING WIZARD LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if data is loaded
  if (!window.dentalData) {
    console.error('Dental clinic data not loaded.');
    return;
  }

  const { doctors, services } = window.dentalData;

  // --- State Variables ---
  let currentStep = 1;
  let selectedService = null;
  let selectedDoctor = null;
  let selectedDate = null;
  let selectedTime = null;
  
  // Calendar Navigation State
  let currentCalendarMonth = new Date().getMonth();
  let currentCalendarYear = new Date().getFullYear();

  // --- DOM Elements ---
  const steps = document.querySelectorAll('.booking-step-content');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const progressBar = document.querySelector('.stepper-progress-active');
  
  const btnPrev = document.getElementById('booking-prev');
  const btnNext = document.getElementById('booking-next');
  
  // Selection containers
  const servicesSelectContainer = document.getElementById('services-select-grid');
  const doctorsSelectContainer = document.getElementById('doctors-select-grid');
  
  // Calendar & Slot widgets
  const calendarTitle = document.getElementById('calendar-current-month');
  const calendarGrid = document.getElementById('calendar-days-grid');
  const prevMonthBtn = document.getElementById('calendar-prev-month');
  const nextMonthBtn = document.getElementById('calendar-next-month');
  const slotsGrid = document.getElementById('slots-grid');
  const slotsEmptyState = document.getElementById('slots-empty-state');
  const selectedDateLabel = document.getElementById('selected-date-label');
  
  // Patient Form inputs
  const patientForm = document.getElementById('patient-details-form');
  const patientInputs = {
    name: document.getElementById('patient-name'),
    email: document.getElementById('patient-email'),
    phone: document.getElementById('patient-phone'),
    notes: document.getElementById('patient-notes')
  };

  // Loading overlay & success state
  const loadingOverlay = document.getElementById('booking-loading');
  const wizardWrapper = document.getElementById('booking-wizard-wrapper');
  const successPanel = document.getElementById('booking-success-panel');
  
  // Summary tags
  const summaryLabels = {
    service: document.getElementById('summary-service'),
    doctor: document.getElementById('summary-doctor'),
    date: document.getElementById('summary-date'),
    time: document.getElementById('summary-time'),
    price: document.getElementById('summary-price')
  };

  // --- Initialization ---
  function initWizard() {
    renderServiceCards();
    renderDoctorCards();
    updateNavigationButtons();
    
    // Wire up step navigation
    btnNext.addEventListener('click', handleNextStep);
    btnPrev.addEventListener('click', handlePrevStep);
    
    // Wire up calendar navigation
    prevMonthBtn.addEventListener('click', () => changeCalendarMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeCalendarMonth(1));
    
    // Setup form validation listeners on input
    Object.keys(patientInputs).forEach(key => {
      const input = patientInputs[key];
      if (input && key !== 'notes') {
        input.addEventListener('input', () => validateInput(input));
      }
    });

    // Handle success actions
    document.getElementById('btn-print-confirmation')?.addEventListener('click', () => window.print());
    document.getElementById('btn-book-another')?.addEventListener('click', resetWizard);
  }

  // --- Step 1: Render Cards ---
  function renderServiceCards() {
    servicesSelectContainer.innerHTML = '';
    services.forEach(service => {
      const card = document.createElement('div');
      card.className = 'card-select-item';
      card.dataset.serviceId = service.id;
      if (selectedService && selectedService.id === service.id) {
        card.classList.add('selected');
      }
      
      card.innerHTML = `
        <h4>${service.title}</h4>
        <p>${service.shortDescription}</p>
        <div style="margin-top: var(--space-sm); font-weight: 700; color: var(--color-primary); font-size: 0.85rem;">
          ${service.price} • ${service.duration}
        </div>
      `;
      
      card.addEventListener('click', () => selectServiceItem(service, card));
      servicesSelectContainer.appendChild(card);
    });
  }

  function renderDoctorCards() {
    doctorsSelectContainer.innerHTML = '';
    doctors.forEach(doctor => {
      const card = document.createElement('div');
      card.className = 'card-select-item';
      card.dataset.doctorId = doctor.id;
      if (selectedDoctor && selectedDoctor.id === doctor.id) {
        card.classList.add('selected');
      }
      
      card.innerHTML = `
        <div class="wizard-doc-item">
          <div class="wizard-doc-avatar">
            <img src="${doctor.image}" alt="${doctor.name}">
          </div>
          <div class="wizard-doc-info">
            <h4>${doctor.name}</h4>
            <p>${doctor.title}</p>
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => selectDoctorItem(doctor, card));
      doctorsSelectContainer.appendChild(card);
    });
  }

  function selectServiceItem(service, element) {
    // Deselect other services
    servicesSelectContainer.querySelectorAll('.card-select-item').forEach(item => {
      item.classList.remove('selected');
    });
    // Toggle/Select current
    selectedService = service;
    element.classList.add('selected');
    
    // Clear subsequent step state
    clearStep2State();
    updateNavigationButtons();
  }

  function selectDoctorItem(doctor, element) {
    // Deselect other doctors
    doctorsSelectContainer.querySelectorAll('.card-select-item').forEach(item => {
      item.classList.remove('selected');
    });
    // Toggle/Select current
    selectedDoctor = doctor;
    element.classList.add('selected');
    
    // Clear subsequent step state
    clearStep2State();
    updateNavigationButtons();
  }

  function clearStep2State() {
    selectedDate = null;
    selectedTime = null;
    selectedDateLabel.textContent = 'Please select a date from the calendar';
    slotsGrid.innerHTML = '';
    slotsEmptyState.style.display = 'block';
  }

  // --- Step 2: Calendar & Time Slots Generation ---
  function changeCalendarMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear -= 1;
    } else if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear += 1;
    }
    renderCalendar();
  }

  function renderCalendar() {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    calendarTitle.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
    
    // Clear weekdays header placeholders (if any) and dates
    calendarGrid.innerHTML = '';
    
    // Add Weekday labels
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
      const el = document.createElement('div');
      el.className = 'calendar-weekday';
      el.textContent = day;
      calendarGrid.appendChild(el);
    });
    
    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      calendarGrid.appendChild(emptyCell);
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14); // Next 14 days schedule
    maxDate.setHours(23,59,59,999);
    
    // Generate dates
    for (let day = 1; day <= totalDays; day++) {
      const dateToCheck = new Date(currentCalendarYear, currentCalendarMonth, day);
      const dayOfWeek = dateToCheck.getDay();
      
      const dayBtn = document.createElement('button');
      dayBtn.className = 'calendar-day-btn';
      dayBtn.textContent = day;
      
      const ariaLabelOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dayBtn.setAttribute('aria-label', dateToCheck.toLocaleDateString('en-US', ariaLabelOptions));
      
      // Highlight today
      if (dateToCheck.getTime() === today.getTime()) {
        dayBtn.classList.add('today');
      }
      
      // Determine if date is eligible
      const isPast = dateToCheck < today;
      const isTooFar = dateToCheck > maxDate;
      const isSunday = dayOfWeek === 0;
      
      // Check if selected doctor works this day of week
      let doctorWorks = true;
      if (selectedDoctor && selectedDoctor.schedule) {
        doctorWorks = selectedDoctor.schedule.days.includes(dayOfWeek);
      }
      
      const isDisabled = isPast || isTooFar || isSunday || !doctorWorks;
      
      if (isDisabled) {
        dayBtn.disabled = true;
      } else {
        // Check if selected
        if (selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === currentCalendarMonth && 
            selectedDate.getFullYear() === currentCalendarYear) {
          dayBtn.classList.add('selected');
        }
        
        dayBtn.addEventListener('click', () => {
          // Deselect previous
          calendarGrid.querySelectorAll('.calendar-day-btn').forEach(btn => {
            btn.classList.remove('selected');
          });
          
          selectedDate = dateToCheck;
          dayBtn.classList.add('selected');
          
          handleDateSelection();
        });
      }
      
      calendarGrid.appendChild(dayBtn);
    }
    
    // Disable previous month button if we are in the current month
    const currentRealMonth = new Date().getMonth();
    const currentRealYear = new Date().getFullYear();
    prevMonthBtn.disabled = (currentCalendarMonth === currentRealMonth && currentCalendarYear === currentRealYear);
  }

  function handleDateSelection() {
    selectedTime = null;
    updateNavigationButtons();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateLabel.textContent = selectedDate.toLocaleDateString('en-US', options);
    
    generateTimeSlots();
  }

  function generateTimeSlots() {
    slotsGrid.innerHTML = '';
    slotsEmptyState.style.display = 'none';
    
    if (!selectedDoctor || !selectedDate) return;
    
    const schedule = selectedDoctor.schedule;
    const startHour = schedule.hours.start;
    const endHour = schedule.hours.end;
    
    const today = new Date();
    const currentHour = today.getHours();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    // Generate slots (every 1 hour)
    let slotsCreated = 0;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // 12-hour format display
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const timeString = `${displayHour}:00 ${suffix}`;
      
      const slotBtn = document.createElement('button');
      slotBtn.className = 'slot-btn';
      slotBtn.textContent = timeString;
      
      // Calculate slot conditions
      const isPastSlot = isToday && hour <= currentHour + 1; // Must book 1 hour in advance
      
      // Simulate existing bookings (pseudo-random based on date/hour/doctor to look consistent but realistic)
      const seed = selectedDate.getDate() + hour + selectedDoctor.name.charCodeAt(0);
      const isAlreadyBooked = (seed % 3 === 0); // ~33% chance booked
      
      if (isPastSlot || isAlreadyBooked) {
        slotBtn.disabled = true;
      } else {
        if (selectedTime === timeString) {
          slotBtn.classList.add('selected');
        }
        
        slotBtn.addEventListener('click', () => {
          slotsGrid.querySelectorAll('.slot-btn').forEach(btn => {
            btn.classList.remove('selected');
          });
          selectedTime = timeString;
          slotBtn.classList.add('selected');
          updateNavigationButtons();
        });
      }
      
      slotsGrid.appendChild(slotBtn);
      slotsCreated++;
    }
    
    if (slotsCreated === 0) {
      slotsGrid.innerHTML = '';
      slotsEmptyState.style.display = 'block';
      slotsEmptyState.textContent = 'No appointments available for this date.';
    }
  }

  // --- Step 3: Form Verification ---
  function validateInput(input) {
    const parent = input.closest('.form-group');
    let isValid = true;
    
    if (input.required && input.value.trim() === '') {
      isValid = false;
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value);
    } else if (input.type === 'tel') {
      // Basic phone format check: digits and spaces/hyphens/parentheses (at least 7 numbers)
      const digits = input.value.replace(/\D/g, '');
      isValid = digits.length >= 7;
    }
    
    if (isValid) {
      parent.classList.remove('has-error');
      input.classList.remove('error');
    } else {
      parent.classList.add('has-error');
      input.classList.add('error');
    }
    
    return isValid;
  }

  function validateStep3Form() {
    let allValid = true;
    
    const requiredInputs = [patientInputs.name, patientInputs.email, patientInputs.phone];
    requiredInputs.forEach(input => {
      const isValid = validateInput(input);
      if (!isValid) allValid = false;
    });
    
    return allValid;
  }

  function updateSummaryLabels() {
    if (summaryLabels.service && selectedService) {
      summaryLabels.service.textContent = selectedService.title;
    }
    if (summaryLabels.doctor && selectedDoctor) {
      summaryLabels.doctor.textContent = selectedDoctor.name;
    }
    if (summaryLabels.date && selectedDate) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      summaryLabels.date.textContent = selectedDate.toLocaleDateString('en-US', options);
    }
    if (summaryLabels.time && selectedTime) {
      summaryLabels.time.textContent = selectedTime;
    }
    if (summaryLabels.price && selectedService) {
      summaryLabels.price.textContent = selectedService.price;
    }
  }

  // --- Navigation Controls ---
  function handleNextStep() {
    if (currentStep === 1) {
      if (selectedService && selectedDoctor) {
        currentStep = 2;
        // Init calendar UI
        currentCalendarMonth = new Date().getMonth();
        currentCalendarYear = new Date().getFullYear();
        renderCalendar();
      }
    } else if (currentStep === 2) {
      if (selectedDate && selectedTime) {
        currentStep = 3;
        updateSummaryLabels();
      }
    } else if (currentStep === 3) {
      if (validateStep3Form()) {
        submitAppointment();
        return; // Don't advance step directly, done inside submitAppointment
      }
    }
    
    updateStepUI();
  }

  function handlePrevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  }

  function updateStepUI() {
    // Hide all steps, show active
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update stepper classes
    stepIndicators.forEach((indicator, index) => {
      const stepNum = index + 1;
      indicator.classList.remove('active', 'completed');
      
      if (stepNum === currentStep) {
        indicator.classList.add('active');
      } else if (stepNum < currentStep) {
        indicator.classList.add('completed');
      }
    });

    // Update stepper progress bar line length
    const percent = ((currentStep - 1) / (stepIndicators.length - 1)) * 80; // max 80% matches positions
    const activeProgressLine = document.querySelector('.stepper-progress-active');
    if (activeProgressLine) {
      activeProgressLine.style.width = `${percent}%`;
    }

    updateNavigationButtons();
  }

  function updateNavigationButtons() {
    // Prev Button
    if (currentStep === 1) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }

    // Next Button state and text
    let canProceed = false;
    if (currentStep === 1) {
      canProceed = (selectedService !== null && selectedDoctor !== null);
      btnNext.innerHTML = `Continue <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    } else if (currentStep === 2) {
      canProceed = (selectedDate !== null && selectedTime !== null);
      btnNext.innerHTML = `Continue <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    } else if (currentStep === 3) {
      canProceed = true; // Button triggers form check on click
      btnNext.innerHTML = `Confirm Booking <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }

    btnNext.disabled = !canProceed;
  }

  // --- Submission Process ---
  function submitAppointment() {
    loadingOverlay.classList.add('active');
    
    // Simulate loading for realistic UX
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
      wizardWrapper.style.display = 'none';
      successPanel.style.display = 'block';
      
      populateSuccessScreen();
    }, 1800);
  }

  function populateSuccessScreen() {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    // Generate an invoice/booking reference number
    const refNum = 'DC-' + Math.floor(100000 + Math.random() * 900000);
    
    document.getElementById('success-ref-val').textContent = refNum;
    document.getElementById('success-service-val').textContent = selectedService.title;
    document.getElementById('success-doctor-val').textContent = selectedDoctor.name;
    document.getElementById('success-datetime-val').textContent = `${formattedDate} at ${selectedTime}`;
    document.getElementById('success-patient-val').textContent = patientInputs.name.value;
    document.getElementById('success-price-val').textContent = selectedService.price;
  }

  function resetWizard() {
    // Clear state variables
    currentStep = 1;
    selectedService = null;
    selectedDoctor = null;
    selectedDate = null;
    selectedTime = null;
    
    // Clear forms and highlights
    patientForm.reset();
    
    // Clear validation error classes
    patientForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    patientForm.querySelectorAll('.form-input').forEach(input => input.classList.remove('error'));
    
    servicesSelectContainer.querySelectorAll('.card-select-item').forEach(item => item.classList.remove('selected'));
    doctorsSelectContainer.querySelectorAll('.card-select-item').forEach(item => item.classList.remove('selected'));
    
    // Toggle visual panels
    successPanel.style.display = 'none';
    wizardWrapper.style.display = 'block';
    
    // Update view
    updateStepUI();
  }

  // Execute wizard initialization
  initWizard();
});
