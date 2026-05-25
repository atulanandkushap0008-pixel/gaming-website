document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Custom Cursor
  // ==========================================
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
    });

    // Add hover states for interactive elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .filter-btn, .gallery-card, .lightbox-close, .lightbox-nav');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  // ==========================================
  // 2. Navigation Scroll States
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Toggle scrolled state on navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic active links highlight based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll links execution (overriding default instant jumps for smoother transitions)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile drawer menu if open
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        
        const offset = 80; // Navbar offset height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 3. Mobile Navigation Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('nav-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // ==========================================
  // 4. Parallax Background Scroll Effect
  // ==========================================
  const heroImage = document.getElementById('hero-bg-image');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (heroImage) {
          const scrollPos = window.scrollY;
          // Slowly scale down and translate down as player scrolls down
          heroImage.style.transform = `scale(${1.05 + scrollPos * 0.00015}) translateY(${scrollPos * 0.15}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==========================================
  // 5. Scroll Reveal System using Intersection Observer
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger stat counters if this entry is the hero section or holds stats
        if (entry.target.classList.contains('hero-section') || entry.target.querySelector('.stat-value')) {
          initStatsCounters();
        }
        
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  // Register targets
  const elementsToReveal = document.querySelectorAll('.reveal-fade-in, .reveal-slide-left, .reveal-slide-right');
  elementsToReveal.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 6. Numerical Stats Incrementing Animation
  // ==========================================
  let statsTriggered = false;

  function initStatsCounters() {
    if (statsTriggered) return;
    statsTriggered = true;

    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds animation
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out quadratic progress formula
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        if (target >= 1000000) {
          stat.textContent = (currentValue / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
          stat.textContent = currentValue.toLocaleString();
        } else {
          stat.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          if (target >= 1000000) {
            stat.textContent = (target / 1000000).toFixed(1) + 'M+';
          } else {
            stat.textContent = target.toLocaleString();
          }
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // ==========================================
  // 7. Interactive Game Gallery Filters
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Force small scale/fade animation when revealed
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300); // match fade transition timing
        }
      });
    });
  });

  // ==========================================
  // 8. Custom Lightbox Popup System
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentGalleryIndex = 0;
  let activeGalleryData = [];

  // Gather info on all gallery cards currently displayed/valid
  function updateGalleryList() {
    activeGalleryData = [];
    const visibleCards = document.querySelectorAll('.gallery-item');
    
    visibleCards.forEach((item, index) => {
      // Only navigate visible ones (ignoring filtered out cards)
      if (item.style.display !== 'none') {
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('.gallery-title').textContent;
        const desc = item.querySelector('.gallery-desc').textContent;
        
        activeGalleryData.push({
          src: img.getAttribute('src'),
          title: title,
          desc: desc,
          elementIndex: index
        });
      }
    });
  }

  // Open Lightbox
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    card.querySelector('.gallery-img-wrapper').addEventListener('click', (e) => {
      updateGalleryList();
      
      const currentSrc = card.querySelector('.gallery-img').getAttribute('src');
      currentGalleryIndex = activeGalleryData.findIndex(item => item.src === currentSrc);
      
      showLightboxImage();
      lightbox.classList.add('active');
    });
  });

  function showLightboxImage() {
    const data = activeGalleryData[currentGalleryIndex];
    if (data) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.setAttribute('src', data.src);
        lightboxTitle.textContent = data.title;
        lightboxDesc.textContent = data.desc;
        lightboxImg.style.opacity = '1';
      }, 150);
    }
  }

  // Close actions
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Prev/Next Nav Controls
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryData.length) % activeGalleryData.length;
      showLightboxImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryData.length;
      showLightboxImage();
    });
  }

  // Keyboard navigation shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
    } else if (e.key === 'ArrowLeft') {
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryData.length) % activeGalleryData.length;
      showLightboxImage();
    } else if (e.key === 'ArrowRight') {
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryData.length;
      showLightboxImage();
    }
  });

  // ==========================================
  // 9. Contact Form validation and Dispatch Simulation
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        const inputGroup = input.parentElement;
        
        if (!input.value.trim()) {
          inputGroup.classList.add('invalid');
          isFormValid = false;
        } else {
          inputGroup.classList.remove('invalid');
        }
        
        // Custom check for email input
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value.trim())) {
            inputGroup.classList.add('invalid');
            isFormValid = false;
          }
        }
      });

      if (isFormValid) {
        // Trigger loading submit status
        contactForm.classList.add('submitting');
        
        // Mock a backend pipeline processing delay
        setTimeout(() => {
          contactForm.classList.remove('submitting');
          formSuccessMessage.classList.add('visible');
          contactForm.reset();
        }, 1800);
      }
    });

    // Remove error border and labels error on keypresses
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        const inputGroup = input.parentElement;
        if (input.value.trim()) {
          inputGroup.classList.remove('invalid');
        }
      });
    });
  }

  // Reset Contact Form from Success screen
  if (resetFormBtn && formSuccessMessage) {
    resetFormBtn.addEventListener('click', () => {
      formSuccessMessage.classList.remove('visible');
    });
  }

  // ==========================================
  // 10. Newsletter Sync Alert
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      
      if (input && input.value.trim()) {
        alert(`INTEL CHANNEL ESTABLISHED: Frequency synced with ${input.value.trim()}`);
        input.value = '';
      }
    });
  }
});
