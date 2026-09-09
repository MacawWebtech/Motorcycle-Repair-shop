/**
 * TORQUE & TREAD — main.js
 * Vanilla ES6+ JavaScript. No external dependencies.
 * Modules:
 *   - Page loader
 *   - Sticky header
 *   - Mobile navigation
 *   - Theme (light/dark) toggle with localStorage
 *   - Scroll reveal animations
 *   - Smooth scrolling
 *   - Testimonial slider
 *   - Brand filter grid
 *   - Contact / appointment form validation
 *   - Newsletter form (coming soon page)
 *   - Countdown timer (coming soon page)
 *   - Load more reviews (reviews page)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initStickyHeader();
    initMobileNav();
    initThemeToggle();
    initScrollReveal();
    initSmoothScroll();
    initTestimonialSlider();
    initBrandFilter();
    initAppointmentForm();
    initQuickEnquiryForm();
    initNewsletterForm();
    initCountdown();
    initLoadMoreReviews();
    initStatCounters();
    setActiveNavLink();
  });

  /* --------------------------------------------------------------------
   * Page loader
   * ------------------------------------------------------------------ */
  function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 250);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
      loader.classList.add('is-hidden');
    }
  }

  /* --------------------------------------------------------------------
   * Sticky header — adds a solid background after scrolling
   * ------------------------------------------------------------------ */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const toggleSolid = () => {
      if (window.scrollY > 40) {
        header.classList.add('is-solid');
      } else if (!header.classList.contains('header-light-page')) {
        header.classList.remove('is-solid');
      }
    };

    toggleSolid();
    window.addEventListener('scroll', toggleSolid, { passive: true });
  }

  /* --------------------------------------------------------------------
   * Mobile navigation — hamburger open/close, backdrop, body scroll lock
   * ------------------------------------------------------------------ */
  function initMobileNav() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    const closeBtn = document.querySelector('.mobile-nav-close');
    if (!toggleBtn || !nav) return;

    let lockedScrollY = 0;

    const openNav = () => {
      nav.classList.add('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      backdrop && backdrop.classList.add('is-open');
      // Remember where the page was, then pin it there with position:fixed.
      // This (rather than plain overflow:hidden) is what actually stops
      // background scroll on touch devices while the menu is open.
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = `-${lockedScrollY}px`;
      document.documentElement.classList.add('nav-open');
      document.body.classList.add('nav-open');
    };

    const closeNav = () => {
      nav.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      backdrop && backdrop.classList.remove('is-open');
      document.documentElement.classList.remove('nav-open');
      document.body.classList.remove('nav-open');
      document.body.style.top = '';
      window.scrollTo(0, lockedScrollY);
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = nav.classList.contains('mobile-open');
      isOpen ? closeNav() : openNav();
    });

    closeBtn && closeBtn.addEventListener('click', closeNav);
    backdrop && backdrop.addEventListener('click', closeNav);

    document.querySelectorAll('.main-nav .nav-links a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* --------------------------------------------------------------------
   * Theme toggle — light / dark mode with localStorage + system preference
   * ------------------------------------------------------------------ */
  function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.querySelector('.theme-toggle');
    const STORAGE_KEY = 'torque-tread-theme';

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });

    // React to system changes only if user hasn't chosen manually
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* --------------------------------------------------------------------
   * Scroll reveal — fades/slides sections into view (respects reduced motion)
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Give siblings revealed together (cards, list rows, team members, etc.)
    // a subtle staggered delay based on their position within their parent.
    const groups = new Map();
    targets.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((siblings) => {
      if (siblings.length < 2) return;
      siblings.forEach((el, i) => {
        const delay = Math.min(i, 7) * 0.08;
        el.style.setProperty('--reveal-delay', `${delay}s`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Only hint the compositor for the brief moment the element is
            // actually animating; leaving will-change on permanently (for
            // what can be 100+ elements on a single page) keeps that many
            // GPU layers alive forever and is a major cause of scroll jank.
            el.style.willChange = 'opacity, transform';
            el.classList.add('is-visible');
            const clearHint = () => { el.style.willChange = 'auto'; };
            el.addEventListener('transitionend', clearHint, { once: true });
            // Fallback in case transitionend never fires (e.g. element
            // hidden mid-transition by a parent display change).
            setTimeout(clearHint, 900);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------
   * Smooth scroll for in-page anchor links
   * ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const headerOffset = 90;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* --------------------------------------------------------------------
   * Testimonial slider — previous/next + dot navigation, touch-friendly
   * ------------------------------------------------------------------ */
  function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonial-track');
    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    const prevBtn = slider.parentElement.querySelector('.slider-arrow.prev');
    const nextBtn = slider.parentElement.querySelector('.slider-arrow.next');
    const dotsWrap = slider.parentElement.querySelector('.slider-dots');
    let current = 0;

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
        });
      }
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

    // Basic touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => (touchStartX = e.touches[0].clientX), { passive: true });
    track.addEventListener(
      'touchend',
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
          delta > 0 ? goTo(current - 1) : goTo(current + 1);
        }
      },
      { passive: true }
    );

    // Autoplay, paused on hover/focus
    let autoplay = setInterval(() => goTo(current + 1), 6000);
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', () => (autoplay = setInterval(() => goTo(current + 1), 6000)));
  }

  /* --------------------------------------------------------------------
   * Brand filter grid (brands.html)
   * ------------------------------------------------------------------ */
  function initBrandFilter() {
    const filterBar = document.querySelector('.brand-filter-bar');
    if (!filterBar) return;

    const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));
    const items = Array.from(document.querySelectorAll('.brand-grid-item'));

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach((item) => {
          const matches = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('is-hidden', !matches);
        });
      });
    });
  }

  /* --------------------------------------------------------------------
   * Appointment / contact form validation
   * ------------------------------------------------------------------ */
  function initAppointmentForm() {
    const form = document.querySelector('#appointmentForm');
    if (!form) return;

    const successBanner = form.parentElement.querySelector('.form-success-banner');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+()\-.\s]{7,20}$/;

    const validators = {
      fullName: (v) => v.trim().length >= 2 || 'Please enter your full name.',
      phone: (v) => phonePattern.test(v.trim()) || 'Please enter a valid phone number.',
      email: (v) => emailPattern.test(v.trim()) || 'Please enter a valid email address.',
      motorcycleBrand: (v) => v.trim().length > 0 || 'Please select your motorcycle brand.',
      serviceRequired: (v) => v.trim().length > 0 || 'Please select a service.',
      preferredDate: (v) => v.trim().length > 0 || 'Please choose a preferred date.',
    };

    function validateField(field) {
      const rule = validators[field.name];
      const wrapper = field.closest('.form-field');
      if (!rule || !wrapper) return true;

      const result = rule(field.value);
      const errorEl = wrapper.querySelector('.form-error');

      if (result === true) {
        wrapper.classList.remove('has-error');
        return true;
      }

      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = result;
      return false;
    }

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-field').classList.contains('has-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = Array.from(form.querySelectorAll('input, select, textarea')).filter((f) =>
        validators.hasOwnProperty(f.name)
      );
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        const firstError = form.querySelector('.form-field.has-error');
        firstError && firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // Simulated network request. Replace with a real endpoint, e.g.:
      // fetch('https://formspree.io/f/your-form-id', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        form.reset();
        if (successBanner) {
          successBanner.classList.add('is-visible');
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------
   * Quick enquiry strip (home-v2.html) — lightweight 3-field callback form
   * ------------------------------------------------------------------ */
  function initQuickEnquiryForm() {
    const form = document.querySelector('#quickEnquiryForm');
    if (!form) return;

    const phonePattern = /^[0-9+()\-.\s]{7,20}$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameField = form.querySelector('[name="quickName"]');
      const phoneField = form.querySelector('[name="quickPhone"]');
      let valid = true;

      [nameField, phoneField].forEach((field) => {
        const wrapper = field.closest('.form-field');
        if (!field.value.trim()) {
          wrapper && wrapper.classList.add('has-error');
          valid = false;
        } else {
          wrapper && wrapper.classList.remove('has-error');
        }
      });

      if (phoneField.value.trim() && !phonePattern.test(phoneField.value.trim())) {
        phoneField.closest('.form-field').classList.add('has-error');
        valid = false;
      }

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      btn.classList.add('is-loading');

      setTimeout(() => {
        btn.classList.remove('is-loading');
        form.reset();
        const success = document.querySelector('#quickEnquirySuccess');
        if (success) success.classList.add('is-visible');
      }, 900);
    });
  }

  /* --------------------------------------------------------------------
   * Newsletter form (coming-soon.html)
   * ------------------------------------------------------------------ */
  function initNewsletterForm() {
    const form = document.querySelector('#newsletterForm');
    if (!form) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const wrapper = input.closest('.form-field');
      const errorEl = wrapper ? wrapper.querySelector('.form-error') : null;

      if (!emailPattern.test(input.value.trim())) {
        wrapper && wrapper.classList.add('has-error');
        if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
        return;
      }

      wrapper && wrapper.classList.remove('has-error');
      const btn = form.querySelector('button[type="submit"]');
      btn.classList.add('is-loading');

      // Prepared for Mailchimp / ConvertKit integration:
      // fetch('YOUR_MAILCHIMP_OR_CONVERTKIT_ENDPOINT', { method: 'POST', body: new FormData(form) })
      setTimeout(() => {
        btn.classList.remove('is-loading');
        form.reset();
        const successMsg = document.querySelector('#newsletterSuccess');
        if (successMsg) successMsg.classList.add('is-visible');
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------
   * Countdown timer (coming-soon.html)
   * Update LAUNCH_DATE below to change the target launch date/time.
   * ------------------------------------------------------------------ */
  function initCountdown() {
    const wrapper = document.querySelector('[data-countdown]');
    if (!wrapper) return;

    const LAUNCH_DATE = new Date(wrapper.dataset.countdown || '2026-12-01T00:00:00');

    const daysEl = wrapper.querySelector('.cd-days');
    const hoursEl = wrapper.querySelector('.cd-hours');
    const minsEl = wrapper.querySelector('.cd-mins');
    const secsEl = wrapper.querySelector('.cd-secs');

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function tick() {
      const now = new Date();
      let diff = Math.max(0, LAUNCH_DATE - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const mins = Math.floor(diff / (1000 * 60));
      diff -= mins * (1000 * 60);
      const secs = Math.floor(diff / 1000);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl) minsEl.textContent = pad(mins);
      if (secsEl) secsEl.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* --------------------------------------------------------------------
   * Load more reviews (reviews.html) — reveals hidden review cards
   * ------------------------------------------------------------------ */
  function initLoadMoreReviews() {
    const btn = document.querySelector('#loadMoreReviews');
    if (!btn) return;

    btn.addEventListener('click', () => {
      btn.classList.add('is-loading');
      setTimeout(() => {
        document.querySelectorAll('.review-card.is-hidden').forEach((card, i) => {
          if (i < 3) card.classList.remove('is-hidden');
        });
        btn.classList.remove('is-loading');
        if (!document.querySelector('.review-card.is-hidden')) {
          btn.style.display = 'none';
        }
      }, 700);
    });
  }

  /* --------------------------------------------------------------------
   * Animated stat counters (home / about stat strips)
   * ------------------------------------------------------------------ */
  function initStatCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (el) => {
      const target = parseInt(el.dataset.countTo, 10) || 0;
      if (prefersReduced) {
        el.textContent = target;
        return;
      }
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* --------------------------------------------------------------------
   * Highlights the current page in the main navigation
   * ------------------------------------------------------------------ */
  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav .nav-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });
  }
})();
