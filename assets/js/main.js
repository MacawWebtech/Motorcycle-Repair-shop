/* Torque & Tread — site behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- Theme toggle (light default, saved preference) ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  function applyTheme(t) {
    if (t === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    if (themeBtn) themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  }
  try { applyTheme(localStorage.getItem('tt-theme') || 'light'); } catch (e) {}
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('tt-theme', next); } catch (e) {}
  });

  /* ---------- Text direction toggle (LTR / RTL, saved preference) ---------- */
  var dirBtn = document.querySelector('.dir-toggle');
  function applyDir(d) {
    root.setAttribute('dir', d);
    if (dirBtn) {
      var rtl = d === 'rtl';
      dirBtn.setAttribute('aria-pressed', rtl ? 'true' : 'false');
      dirBtn.setAttribute('aria-label', rtl ? 'Switch text direction to left-to-right' : 'Switch text direction to right-to-left');
      dirBtn.querySelector('.dir-toggle__label').textContent = rtl ? 'LTR' : 'RTL';
    }
  }
  try { applyDir(localStorage.getItem('tt-dir') === 'rtl' ? 'rtl' : 'ltr'); } catch (e) {}
  if (dirBtn) dirBtn.addEventListener('click', function () {
    var next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
    applyDir(next);
    try { localStorage.setItem('tt-dir', next); } catch (e) {}
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--ride', (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0).toFixed(1) + '%');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNavTop() {
    if (!header || !nav) return;
    var r = header.getBoundingClientRect();
    nav.style.setProperty('--nav-top', Math.max(0, r.bottom) + 'px');
  }
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    root.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      setNavTop();
      nav.classList.toggle('is-open', open);
      root.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) closeNav(); else setNavTop(); });
  }
  /* Sub-menu (Home layouts) — click/tap to open, works with keyboard */
  document.querySelectorAll('.has-sub > .nav__link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.parentElement;
      var open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-sub.is-open').forEach(function (li) {
      if (!li.contains(e.target) && window.innerWidth > 1080) {
        li.classList.remove('is-open');
        li.querySelector('.nav__link').setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Services page: service picker (accessible tabs) ---------- */
  var picker = document.querySelector('[data-picker]');
  if (picker) {
    var tabs = Array.prototype.slice.call(picker.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    picker.classList.remove('no-js-panels');
    function select(i, focus, updateHash) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (updateHash && history.replaceState) history.replaceState(null, '', '#' + panels[i].id);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        select(i, false, true);
        if (window.innerWidth <= 1080) panels[i].scrollIntoView({ block: 'start' });
      });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, next = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') next = (i + 1) % n;
        if (k === 'ArrowUp' || k === 'ArrowLeft') next = (i - 1 + n) % n;
        if (k === 'Home') next = 0;
        if (k === 'End') next = n - 1;
        if (next !== null) { e.preventDefault(); select(next, true, true); }
      });
    });
    var start = 0;
    var hash = location.hash.slice(1);
    panels.forEach(function (p, i) { if (p.id === hash) start = i; });
    select(start, false, false);
    if (hash && start >= 0) {
      tabs[start].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }

  /* ---------- Brands page: category filter ---------- */
  var filterBar = document.querySelector('[data-brand-filter]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-categories]');
    var status = document.getElementById('brand-filter-status');
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (!b) return;
      var f = b.getAttribute('data-filter');
      filterBar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var shown = 0;
      cards.forEach(function (c) {
        var match = f === 'all' || c.getAttribute('data-categories').split(' ').indexOf(f) > -1;
        c.hidden = !match;
        if (match) shown++;
      });
      if (status) status.textContent = shown + ' brands shown';
    });
  }

  /* ---------- Forms: client-side validation ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var val = (input.value || '').trim();
        var ok = val.length > 0;
        if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if (ok && input.type === 'tel') ok = /^[+\d][\d\s-]{7,16}$/.test(val);
        if (field) field.classList.toggle('is-invalid', !ok);
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }
      var success = form.querySelector('.form-success') || document.getElementById(form.getAttribute('data-success'));
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      setTimeout(function () {
        if (success) { success.classList.add('is-visible'); success.focus && success.focus(); }
        form.reset();
        if (btn) btn.disabled = false;
      }, 500);
    });
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('is-invalid') && input.value.trim()) {
          field.classList.remove('is-invalid');
          input.setAttribute('aria-invalid', 'false');
        }
      });
    });
  });

  /* Don't allow past dates in the booking form */
  var dateInput = document.getElementById('date');
  if (dateInput) {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    dateInput.min = d.toISOString().slice(0, 10);
  }
  /* Preselect a service when arriving from "Book this service" links */
  var svcSelect = document.getElementById('service');
  if (svcSelect) {
    var q = new URLSearchParams(location.search).get('service');
    if (q) Array.prototype.forEach.call(svcSelect.options, function (o) { if (o.value === q) svcSelect.value = q; });
  }

  /* ---------- Coming soon countdown ---------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var target = new Date(cd.getAttribute('data-countdown')).getTime();
    var parts = { d: cd.querySelector('[data-d]'), h: cd.querySelector('[data-h]'), m: cd.querySelector('[data-m]'), s: cd.querySelector('[data-s]') };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      parts.d.textContent = pad(Math.floor(diff / 864e5));
      parts.h.textContent = pad(Math.floor(diff / 36e5) % 24);
      parts.m.textContent = pad(Math.floor(diff / 6e4) % 60);
      parts.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Scroll reveal: smooth fade-in-up (page content only) ----------
     Only elements inside <main> are animated: the top bar, header and footer
     are never touched. Uses the individual `translate` property so it cannot
     clash with hover transforms, and every helper class is removed again once
     an element has finished animating. Skipped for reduced-motion users and
     when IntersectionObserver is unavailable (content then simply shows). */
  (function () {
    var main = document.getElementById('main') || document.querySelector('main');
    if (!main || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var DURATION = 900;          /* ms, keep in sync with --reveal-duration */
    var STEP = 90;               /* ms stagger between siblings revealed together */
    var MAX_STAGGER = 5;

    function collect(el) {
      if (el.classList.contains('visually-hidden') || el.hasAttribute('hidden')) return [];
      var tag = el.tagName;
      /* Horizontal swipe carousel on phones: fade the whole strip in once */
      if (el.classList.contains('steps') && window.matchMedia('(max-width: 640px)').matches) return [el];
      if (tag === 'UL' || tag === 'OL') return Array.prototype.slice.call(el.children);
      if (tag === 'DIV' && !el.className) return Array.prototype.reduce.call(el.children, function (a, c) { return a.concat(collect(c)); }, []);
      return [el];
    }
    function finish(el) {
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--reveal-delay');
    }
    function play(el, delay) {
      el.style.setProperty('--reveal-delay', delay + 'ms');
      el.classList.add('is-visible');
      setTimeout(function () { finish(el); }, delay + DURATION + 120);
    }

    /* Hero: play on load with a gentle stagger */
    var heroItems = [];
    main.querySelectorAll('.hero').forEach(function (hero) {
      var content = hero.querySelector('.hero__content, .split-hero__text');
      if (content) heroItems = heroItems.concat(Array.prototype.slice.call(content.children));
      var ticket = hero.querySelector('.job-ticket');
      if (ticket) heroItems.push(ticket);
    });
    heroItems.forEach(function (el) { el.classList.add('reveal'); });

    /* Everything else: reveal as it scrolls into view */
    var targets = [];
    main.querySelectorAll('section:not(.hero)').forEach(function (sec) {
      var box = sec.querySelector(':scope > .container') || sec;
      Array.prototype.forEach.call(box.children, function (k) { targets = targets.concat(collect(k)); });
    });
    targets.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left); });
      entries.forEach(function (e) {
        /* Already scrolled past (page opened part-way down): show without animating */
        if (!e.isIntersecting && e.boundingClientRect.top < 0) { finish(e.target); io.unobserve(e.target); }
      });
      batch.forEach(function (e, i) {
        play(e.target, Math.min(i, MAX_STAGGER) * STEP);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    requestAnimationFrame(function () {
      heroItems.forEach(function (el, i) { play(el, 80 + Math.min(i, 6) * 110); });
      targets.forEach(function (el) { io.observe(el); });
    });
  })();

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
