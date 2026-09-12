/**
 * Feather Touch Foundation School & Day Care Centre
 * Client Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initProgrammeTabs();
  initFaqAccordion();
  initModals();
  initGallery();
  initEnquiryForms();
  initContactPlaceholders();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navClose = document.querySelector('.mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu open / close
  function openMobileMenu() {
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    navClose.focus();
  }

  function closeMobileMenu() {
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    menuToggle.focus();
  }

  if (menuToggle && navOverlay) {
    menuToggle.addEventListener('click', openMobileMenu);
    navClose.addEventListener('click', closeMobileMenu);
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) closeMobileMenu();
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Active navigation link tracking via IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

/* ==========================================================================
   2. PROGRAMME TABS SELECTOR
   ========================================================================== */
function initProgrammeTabs() {
  const tabBtns = document.querySelectorAll('.programmes-tabs-nav .tab-btn');
  const tabPanels = document.querySelectorAll('.programme-tab-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show matching panel
      tabPanels.forEach(panel => {
        if (panel.getAttribute('id') === `panel-${targetId}`) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', 'true');
        }
      });
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION (Keyboard Accessible)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Optional: Close other FAQs to maintain a clean view
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   4. MODALS (Accessible Dialog System)
   ========================================================================== */
let lastFocusedElement = null;

function openModal(modalId, defaultProgramme = '') {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // If a programme was passed, set select field
  if (defaultProgramme) {
    const progSelect = modal.querySelector('select[name="programme"]');
    if (progSelect) {
      progSelect.value = defaultProgramme;
    }
  }

  // Focus first input
  const firstInput = modal.querySelector('input, select, textarea');
  if (firstInput) {
    firstInput.focus();
  }
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function initModals() {
  const triggers = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('.modal-close, [data-close-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const programme = trigger.getAttribute('data-programme') || '';
      openModal(modalId, programme);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElem = document.querySelector('.modal-overlay.open');
      if (openModalElem) {
        closeModal(openModalElem);
      }
    }
  });
}

/* ==========================================================================
   5. GALLERY FILTERING & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-nav .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCategory = document.getElementById('lightbox-category');

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox view for photo placeholders
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || '';
      const desc = item.getAttribute('data-description') || '';
      const category = item.getAttribute('data-category-label') || '';

      if (lightbox && lightboxTitle && lightboxDesc) {
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        if (lightboxCategory) lightboxCategory.textContent = category;
        openModal('gallery-lightbox');
      }
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

/* ==========================================================================
   6. ENQUIRY FORMS - HONEST CLIENT VALIDATION & FLOW
   ========================================================================== */
function initEnquiryForms() {
  const forms = document.querySelectorAll('.enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const parentNameInput = form.querySelector('input[name="parent_name"]');
      const childNameInput = form.querySelector('input[name="child_name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const programmeSelect = form.querySelector('select[name="programme"]');
      const messageInput = form.querySelector('textarea[name="message"]');
      const feedbackBox = form.querySelector('.form-feedback');

      // Validation
      if (!parentNameInput.value.trim()) {
        parentNameInput.classList.add('error');
        isValid = false;
      } else {
        parentNameInput.classList.remove('error');
      }

      if (!childNameInput.value.trim()) {
        childNameInput.classList.add('error');
        isValid = false;
      } else {
        childNameInput.classList.remove('error');
      }

      const phoneVal = phoneInput.value.replace(/\D/g, '');
      if (!phoneVal || phoneVal.length < 10) {
        phoneInput.classList.add('error');
        isValid = false;
      } else {
        phoneInput.classList.remove('error');
      }

      if (!isValid) {
        if (feedbackBox) {
          feedbackBox.innerHTML = '<span style="color: #E53E3E; font-weight: 600;">Please fill in all required fields with a valid contact number.</span>';
        }
        return;
      }

      const enquiryType = form.getAttribute('data-type') || 'Admission Enquiry';
      const config = window.FEATHER_TOUCH_CONFIG || {};

      // If WhatsApp number is configured with real digits:
      if (config.whatsappRaw) {
        const text = `Hello, I would like to make an ${enquiryType} for ${childNameInput.value.trim()} (${programmeSelect ? programmeSelect.value : 'Preschool'}). Parent Name: ${parentNameInput.value.trim()}, Contact: ${phoneInput.value.trim()}. ${messageInput && messageInput.value.trim() ? 'Note: ' + messageInput.value.trim() : ''}`;
        const url = `https://wa.me/${config.whatsappRaw}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        if (feedbackBox) {
          feedbackBox.innerHTML = '<span style="color: #2A9D8F; font-weight: 600;">Redirecting to Feather Touch WhatsApp Desk...</span>';
        }
      } else {
        // Honest non-simulated feedback explaining placeholder state
        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div style="background-color: #FEF7EE; border: 1.5px solid #F4A261; border-radius: 8px; padding: 12px; margin-top: 12px;">
              <p style="color: #934C00; font-weight: 700; margin-bottom: 4px;">Enquiry Form Validated</p>
              <p style="color: #613200; font-size: 0.88rem; line-height: 1.5;">
                Thank you, <strong>${escapeHtml(parentNameInput.value.trim())}</strong>! Details for <strong>${escapeHtml(childNameInput.value.trim())}</strong> (${escapeHtml(programmeSelect ? programmeSelect.value : 'Preschool')}) have passed client-side validation.
              </p>
              <p style="color: #613200; font-size: 0.82rem; margin-top: 6px; line-height: 1.4;">
                <em>Notice: Official school contact numbers are currently in placeholder mode (<code>${escapeHtml(config.phone || '[School Contact Number]')}</code> and <code>${escapeHtml(config.whatsapp || '[WhatsApp Number]')}</code>). Direct messaging will activate once verified school numbers are supplied in <code>config.js</code>.</em>
              </p>
            </div>
          `;
        }
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   7. CONTACT PLACEHOLDERS & SAFEGUARDS
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

function initContactPlaceholders() {
  const config = window.FEATHER_TOUCH_CONFIG || {};

  const callBtns = document.querySelectorAll('.action-call-btn');
  const waBtns = document.querySelectorAll('.action-whatsapp-btn');
  const directionsBtns = document.querySelectorAll('.action-directions-btn');

  callBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!config.phoneRaw) {
        e.preventDefault();
        showToast("Phone number " + (config.phone || "[School Contact Number]") + " is to be configured once verified by school administration.");
      }
    });
  });

  waBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!config.whatsappRaw) {
        e.preventDefault();
        showToast("WhatsApp number " + (config.whatsapp || "[WhatsApp Number]") + " is to be configured once verified by school administration.");
      }
    });
  });

  directionsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!config.googleMapsDirectionsUrl) {
        e.preventDefault();
        showToast("Location " + (config.googleMaps || "[Google Maps Location — to be configured]") + " is to be configured once verified by school administration.");
      }
    });
  });
}
