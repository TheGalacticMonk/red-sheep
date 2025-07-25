document.addEventListener('DOMContentLoaded', function() {

  // Only run on mobile
  function isMobile() {
    return window.innerWidth <= 900;
  }

  function handleLogoOpacity() {
    const logo = document.querySelector('.mobile-header-logo');
    if (!logo) return;

    if (window.scrollY > 36 && isMobile()) {
      logo.classList.add('faded');
    } else {
      logo.classList.remove('faded');
    }
  }

  window.addEventListener('scroll', handleLogoOpacity);
  window.addEventListener('resize', handleLogoOpacity); // So it resets on resize
  document.addEventListener('DOMContentLoaded', handleLogoOpacity);

  // Wait for navigation to be loaded
  const checkElements = setInterval(() => {
    const hamburger = document.getElementById('mobileNavHamburger');
    const toggle = document.getElementById('mobileNavToggle');
    const overlay = document.getElementById('mobileNavOverlay');
    const closeBtn = document.getElementById('mobileNavClose');

    if (hamburger && toggle && overlay && closeBtn) {
      clearInterval(checkElements);
      console.log('Mobile nav elements found, initializing...');
      
      // Initialize overlay state
      overlay.setAttribute('aria-hidden', 'true');
      
      // Function to toggle menu
      function toggleMenu() {
        const isHidden = overlay.getAttribute('aria-hidden') === 'true';
        console.log('Toggling menu. Current state:', isHidden ? 'hidden' : 'visible');
        
        overlay.setAttribute('aria-hidden', !isHidden);
        document.body.style.overflow = isHidden ? 'hidden' : '';
        toggle.checked = isHidden;
      }

      // Function to close menu on desktop resize
      function handleResize() {
        if (window.innerWidth > 900) {
          overlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          toggle.checked = false;
        }
      }

      // Event listeners
      hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
      
      // Handle checkbox change
      toggle.addEventListener('change', function() {
        const isChecked = this.checked;
        console.log('Checkbox changed:', isChecked);
        overlay.setAttribute('aria-hidden', !isChecked);
        document.body.style.overflow = isChecked ? 'hidden' : '';
      });
      
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        toggle.checked = false;
      });

      // Close when clicking outside nav content
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          overlay.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          toggle.checked = false;
        }
      });

      // Handle window resize
      window.addEventListener('resize', handleResize);
      
      console.log('Mobile nav initialized successfully');
    } else {
      console.log('Waiting for mobile nav elements...');
    }
  }, 100);
});
