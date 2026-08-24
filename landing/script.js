document.addEventListener('DOMContentLoaded', () => {
  // --- THEME SWITCHER LOGIC ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('svg');
  
  // Set default theme state
  let currentTheme = localStorage.getItem('creatorsync_landing_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('creatorsync_landing_theme', currentTheme);
    updateThemeIcon(currentTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      // Sun Icon SVG markup
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      // Moon Icon SVG markup
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  }

  // --- MOBILE NAVIGATION BAR TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const toggleIcon = menuToggle.querySelector('svg');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      // X Close icon
      toggleIcon.innerHTML = `
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      `;
    } else {
      // Menu hamburger icon
      toggleIcon.innerHTML = `
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      `;
    }
  });

  // --- TESTIMONIALS SLIDER ---
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'));
      
      // Move track
      track.style.transform = `translateX(-${slideIndex * 100}%)`;
      
      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // --- FAQ ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other opened FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- INTERSECTION OBSERVER SCROLL REVEALS & STATS COUNTING ---
  const revealElements = document.querySelectorAll('.reveal');
  const statsElements = document.querySelectorAll('.stat-count');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Stats number animator
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'));
        animateCounter(target, targetValue);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statsElements.forEach(el => statsObserver.observe(el));

  function animateCounter(element, targetValue) {
    let start = 0;
    const duration = 1500; // ms
    const stepTime = Math.abs(Math.floor(duration / targetValue)) || 10;
    
    const timer = setInterval(() => {
      start += Math.ceil(targetValue / 100) || 1;
      if (start >= targetValue) {
        element.textContent = targetValue.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        element.textContent = start.toLocaleString() + '+';
      }
    }, stepTime);
  }
});
