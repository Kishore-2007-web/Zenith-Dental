/* ==========================================================================
   GLOBAL CLINIC INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if data is loaded
  if (!window.dentalData) {
    console.error('Dental clinic data not loaded.');
    return;
  }

  const { services, reviews } = window.dentalData;

  // --- 1. STICKY HEADER & BACK-TO-TOP SCROLL ---
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    // Header transition on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show Back to Top button
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  // Back to Top action
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // --- 2. MOBILE MENU DRAWER ---
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Update aria-expanded attribute
    const isExpanded = navLinks.classList.contains('active');
    burgerMenu.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    
    // Toggle body scroll to prevent background scrolling when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }

  burgerMenu?.addEventListener('click', toggleMenu);

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !burgerMenu.contains(e.target)) {
      toggleMenu();
    }
  });


  // --- 3. SERVICES DETAIL MODAL ---
  const modalOverlay = document.getElementById('service-modal');
  const modalContainer = modalOverlay?.querySelector('.modal-container');
  const modalCloseBtn = modalOverlay?.querySelector('.modal-close');
  const serviceDetailTriggers = document.querySelectorAll('.btn-service-details');

  let activeTriggerElement = null; // Store trigger element to restore focus on close

  function openServiceModal(serviceId, triggerBtn) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    activeTriggerElement = triggerBtn; // Save trigger button

    // Populate contents
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTreatments = document.getElementById('modal-treatments');
    const modalPrice = document.getElementById('modal-price');
    const modalDuration = document.getElementById('modal-duration');
    const modalBookBtn = document.getElementById('modal-book-btn');

    if (modalTitle) modalTitle.textContent = service.title;
    if (modalDesc) modalDesc.textContent = service.longDescription;
    
    if (modalTreatments) {
      modalTreatments.innerHTML = '';
      service.treatments.forEach(treatment => {
        const li = document.createElement('li');
        li.textContent = treatment;
        modalTreatments.appendChild(li);
      });
    }

    if (modalPrice) modalPrice.textContent = service.price;
    if (modalDuration) modalDuration.textContent = service.duration;
    
    if (modalBookBtn) {
      // Set attribute to identify service
      modalBookBtn.dataset.serviceId = service.id;
    }

    // Toggle active classes
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus close button inside modal for accessibility
    setTimeout(() => {
      modalCloseBtn?.focus();
    }, 100);
  }

  function closeServiceModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Restore focus to the element that triggered the modal
    if (activeTriggerElement) {
      activeTriggerElement.focus();
      activeTriggerElement = null;
    }
  }

  // Bind service modal card click triggers
  serviceDetailTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.dataset.serviceId;
      openServiceModal(serviceId, btn);
    });
  });

  // Modal focus trapping for keyboard navigation (WCAG compliance)
  modalOverlay?.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    
    const focusableElements = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Bind service "Book Now" buttons to replace inline onClick
  const serviceBookBtns = document.querySelectorAll('.btn-book-service');
  serviceBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.dataset.serviceId;
      
      // Select the service item in step 1 of booking wizard
      const wizardServiceItem = document.querySelector(`.card-select-item[data-service-id="${serviceId}"]`);
      if (wizardServiceItem) {
        // Trigger card click programmatically to select it
        wizardServiceItem.click();
      }

      // Scroll smoothly to booking section
      const bookingSection = document.getElementById('appointment');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Close modal click binders
  modalCloseBtn?.addEventListener('click', closeServiceModal);
  
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeServiceModal();
    }
  });

  // Esc key press to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeServiceModal();
    }
  });

  // Modal "Book Now" conversion trigger
  const modalBookBtn = document.getElementById('modal-book-btn');
  modalBookBtn?.addEventListener('click', () => {
    const serviceId = modalBookBtn.dataset.serviceId;
    closeServiceModal();

    // Select the service item in step 1 of booking wizard
    const wizardServiceItem = document.querySelector(`.card-select-item[data-service-id="${serviceId}"]`);
    if (wizardServiceItem) {
      // Trigger card click programmatically to select it
      wizardServiceItem.click();
    }

    // Scroll smoothly to booking section
    const bookingSection = document.getElementById('appointment');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  });


  // --- 4. REVIEWS SLIDER (CAROUSEL) ---
  const track = document.querySelector('.reviews-track');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  let currentSlide = 0;
  const slideCount = reviews.length;
  let autoplayInterval;

  function initReviewsCarousel() {
    // Generate reviews slider tracks programmatically for rich, dynamic presentation
    if (!track) return;
    track.innerHTML = '';
    
    reviews.forEach(review => {
      const slide = document.createElement('div');
      slide.className = 'review-slide';
      
      // Build rating stars SVG markup
      let starsMarkup = '';
      for (let i = 0; i < review.rating; i++) {
        starsMarkup += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }

      slide.innerHTML = `
        <div class="review-card">
          <div class="review-rating">
            ${starsMarkup}
          </div>
          <blockquote class="review-comment">
            "${review.comment}"
          </blockquote>
          <div class="review-author">
            <span class="review-name">${review.name}</span>
            <span class="review-meta">Verified Patient • Treated for <span>${review.treatment}</span></span>
          </div>
        </div>
      `;
      track.appendChild(slide);
    });

    // Create dot selectors
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => moveToSlide(i));
      dotsContainer.appendChild(dot);
    }

    // Set transition size dynamically
    updateTrackPosition();
    startAutoplay();

    // Event listeners
    prevBtn?.addEventListener('click', () => {
      moveToSlide(currentSlide === 0 ? slideCount - 1 : currentSlide - 1);
      resetAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      moveToSlide(currentSlide === slideCount - 1 ? 0 : currentSlide + 1);
      resetAutoplay();
    });

    // Support window resize
    window.addEventListener('resize', updateTrackPosition);

    // Support Swipe Gesture touch events
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        // Swipe left -> Next
        moveToSlide(currentSlide === slideCount - 1 ? 0 : currentSlide + 1);
        resetAutoplay();
      } else if (touchEndX - touchStartX > threshold) {
        // Swipe right -> Prev
        moveToSlide(currentSlide === 0 ? slideCount - 1 : currentSlide - 1);
        resetAutoplay();
      }
    }
  }

  function moveToSlide(index) {
    currentSlide = index;
    updateTrackPosition();
    
    // Update dots indicators
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function updateTrackPosition() {
    if (!track) return;
    const slideWidth = track.parentElement.getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      moveToSlide((currentSlide + 1) % slideCount);
    }, 6000); // Transitions reviews every 6 seconds
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  initReviewsCarousel();


  // --- 5. FAQs ACCORDION ---
  const faqListContainer = document.getElementById('faq-accordion-list');
  const { faqs } = window.dentalData;

  function initFaqAccordion() {
    if (!faqListContainer) return;
    faqListContainer.innerHTML = '';

    faqs.forEach((faq, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      if (index === 0) {
        // First item expanded by default for visual polish
        faqItem.classList.add('active');
      }

      faqItem.innerHTML = `
        <button class="faq-header" aria-expanded="${index === 0 ? 'true' : 'false'}">
          <span>${faq.question}</span>
          <span class="faq-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </span>
        </button>
        <div class="faq-content">
          <div class="faq-answer">
            ${faq.answer}
          </div>
        </div>
      `;

      // Event listener for toggle click
      const headerBtn = faqItem.querySelector('.faq-header');
      headerBtn.addEventListener('click', () => {
        const isActive = faqItem.classList.contains('active');
        
        // Collapse all items (Accordion behavior)
        faqListContainer.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          faqItem.classList.add('active');
          headerBtn.setAttribute('aria-expanded', 'true');
        }
      });

      faqListContainer.appendChild(faqItem);
    });
  }

  initFaqAccordion();


  // --- 6. SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal animation occurs only once
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Slightly triggers early
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
