/**
 * Santhosh M - Portfolio Interactivity Engine (Pure Vanilla JS)
 * Year: 2030 (AI Engineer Concept Portfolio)
 * Absolute pure JavaScript. Zero frameworks/libraries used.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initCustomCursor();
  initBackgroundParticles();
  initTypewriter();
  initScrollAnimations();
  initMobileMenu();
  initResumeModal();
  initContactForm();
  initActiveNavigation();
});

/* ==========================================
   1. CUSTOM CURSOR & SPOTLIGHT ENGINE
   ========================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');
  const root = document.documentElement;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  // Track global coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update spotlight location in CSS variables
    root.style.setProperty('--cursor-x', `${mouseX}px`);
    root.style.setProperty('--cursor-y', `${mouseY}px`);

    // Position dot element immediately
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth follower delay using animation loop
  function updateFollower() {
    // Linear interpolation easing algorithm (smooth trailer effect)
    const easing = 0.15;
    followerX += (mouseX - followerX) * easing;
    followerY += (mouseY - followerY) * easing;

    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }

    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Attach hover styles to links, buttons and interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-panel, .timeline-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-link');
    });
  });
}

/* ==========================================
   2. PSP SYMBOLS BACKGROUND PARTICLES (CANVAS)
   ========================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const particleCount = 150; // Balanced density of fly-around symbols
  let mouse = { x: null, y: null, radius: 160 };

  // Track cursor within parent frame
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle high resolution devices
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Symbol Types Constants
  // 0 = Triangle, 1 = Circle, 2 = Cross, 3 = Square
  const COLORS = [
    'rgba(0, 243, 255, 0.35)', // Neon Cyan
    'rgba(157, 0, 255, 0.35)', // Neon Purple
    'rgba(255, 0, 170, 0.35)', // Neon Pink/Magenta
    'rgba(0, 102, 255, 0.35)'  // Neon Blue
  ];

  class PspParticle {
    constructor() {
      this.reset();
      // randomize starting coordinates fully across view on initialization
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() > 0.5 ? -30 : window.innerHeight + 30; // spawn slightly out of bounds
      this.size = Math.random() * 12 + 6; // compact elegant sizes
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() * 0.4) + 0.1; // slide gently downwards
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.type = Math.floor(Math.random() * 4); // Random symbol
      this.glowPower = Math.random() * 8 + 4;
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      // Basic continuous floating movement
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      // Mouse Interaction Force: push symbols away slightly if mouse gets too close
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Apply a gentle vector nudge away from user click/hover points
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }

      // Out of bounds reset
      if (this.y > window.innerHeight + 40 || this.y < -40 || this.x > window.innerWidth + 40 || this.x < -40) {
        this.reset();
        // Spawning positions
        if (Math.random() > 0.5) {
          this.y = -20;
          this.x = Math.random() * window.innerWidth;
        } else {
          this.x = Math.random() > 0.5 ? -20 : window.innerWidth + 20;
          this.y = Math.random() * window.innerHeight;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      
      // Neon Blur shadows
      ctx.shadowBlur = this.glowPower;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      const s = this.size;

      switch (this.type) {
        case 0: // △ Triangle
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.86, s * 0.5);
          ctx.lineTo(-s * 0.86, s * 0.5);
          ctx.closePath();
          break;

        case 1: // ○ Circle
          ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
          break;

        case 2: // ✕ Cross
          ctx.moveTo(-s * 0.7, -s * 0.7);
          ctx.lineTo(s * 0.7, s * 0.7);
          ctx.moveTo(s * 0.7, -s * 0.7);
          ctx.lineTo(-s * 0.7, s * 0.7);
          break;

        case 3: // □ Square
          ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
          break;
      }

      ctx.stroke();
      ctx.restore();
    }
  }

  // Populate list
  for (let i = 0; i < particleCount; i++) {
    particles.push(new PspParticle());
  }

  // Render Loop
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw all active floating symbols
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================
   3. TYPEWRITER (HERO DISPLAY SUB-HEADER)
   ========================================== */
function initTypewriter() {
  const textElement = document.querySelector('.hero-typing .typed-text');
  if (!textElement) return;

  const roles = [
    'AI & Data Science Student',
    'Machine Learning Enthusiast',
    'Full Stack Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 150; // Milliseconds between keys typing

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 50; // Deletes faster
    } else {
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 120; // Normal typing speed
    }

    // Complete typing a full phrase
    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2000; // Keep full text showing for some time
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Loop around to first
      delay = 500; // Pause before typing next word
    }

    setTimeout(type, delay);
  }

  // Run typewriter loop
  setTimeout(type, 1000);
}

/* ==========================================
   4. SCROLL REVEAL & SKILLS PROGRESS ANIMATOR
   ========================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once for performance
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters center stage
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Specialized Skill progress-bar animator
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const targetPercent = bar.getAttribute('data-percent');
          bar.style.width = `${targetPercent}%`;
        });
      }
    });
  }, { threshold: 0.1 });

  skillCategoryCards.forEach(card => skillsObserver.observe(card));
}

/* ==========================================
   5. MOBILE SLIDEOUT MENU NAVIGATION
   ========================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navList.classList.toggle('active');
  });

  // Automatically wrap back drawer when clicking tabs
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navList.classList.remove('active');
    });
  });
}

/* ==========================================
   6. INTERACTIVE RÉSUMÉ PREVIEW DIALOG
   ========================================== */
function initResumeModal() {
  const openTriggers = document.querySelectorAll('.open-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!modal) return;

  // Show modal
  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Block background scroll
    });
  });

  // Hide modal
  const hideModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // Hotkey escape closure
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      hideModal();
    }
  });
}

/* ==========================================
   7. INTERACTIVE FORM HANDLER (WITH CUSTOM TOASTS)
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successToast = document.getElementById('toast-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual feedback for simulated secure storage post
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing Secure Port...';
    submitBtn.disabled = true;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      // Simulate completed micro-service transaction
      submitBtn.innerHTML = '<i data-lucide="check"></i> Form Securely Delivered';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      // Reset Form fields
      form.reset();

      // Show Gorgeous Glowing Status Overlay
      if (successToast) {
        successToast.classList.add('active');
        setTimeout(() => {
          successToast.classList.remove('active');
        }, 5000); // Display for 5 seconds
      }

      // Restore submit parameters
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }, 2000);

    }, 1800);
  });
}

/* ==========================================
   8. ACTIVE LINK DETECTOR ON VIEWPORT SCROLL
   ========================================== */
function initActiveNavigation() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links li');
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160;

    // Sticky nav bar background addition
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Capture active viewport focus
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.querySelector('a')?.getAttribute('href')?.substring(1);
      if (href === currentSectionId) {
        item.classList.add('active');
      }
    });
  });
}
