/**
 * Feather Touch Foundation School and Day Care Centre
 * Client ES Module
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const iconMenu = navToggle.querySelector('.icon--menu');
    const iconClose = navToggle.querySelector('.icon--close');

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNav.classList.toggle('nav--open', !isExpanded);

      if (iconMenu && iconClose) {
        iconMenu.style.display = isExpanded ? 'block' : 'none';
        iconClose.style.display = isExpanded ? 'none' : 'block';
      }
    });

    // Close mobile nav when clicking on a link
    primaryNav.querySelectorAll('.nav__link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('nav--open')) {
          primaryNav.classList.remove('nav--open');
          navToggle.setAttribute('aria-expanded', 'false');
          if (iconMenu && iconClose) {
            iconMenu.style.display = 'block';
            iconClose.style.display = 'none';
          }
        }
      });
    });
  }

  // Admissions Enquiry Form (Preview Interaction)
  const enquiryForm = document.getElementById('enquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (enquiryForm && formFeedback) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check honeypot
      const honeypot = enquiryForm.querySelector('input[name="extra_notes"]');
      if (honeypot && honeypot.value) {
        return;
      }

      formFeedback.style.display = 'block';
      formFeedback.className = 'form-feedback alert alert--success';
      formFeedback.textContent = 'Thank you! Your enquiry has been received in preview mode. Our admissions team will reach out once official launch is complete.';
      enquiryForm.reset();
    });
  }
});
