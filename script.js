/* ===================================================================
   DIVYADHARSHINI D — PORTFOLIO
   Vanilla JS: navigation, scroll reveal, particles, HUD interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Grab every element up front (avoids TDZ / ordering bugs) ---------- */
  const yearEl = document.getElementById('year');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const particlesContainer = document.getElementById('particles');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up:not(.hero .reveal-up)'
  );
  const heroReveals = document.querySelectorAll('.hero .reveal-up');

  /* ---------- Footer year ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Active section indicator (scroll-position based) ----------
     Instead of relying solely on IntersectionObserver firing per-section
     (which can leave short sections "stuck" on the previous active link),
     this compares every section's position against a fixed probe line and
     always picks the single closest match, so there's never a gap where
     no link is marked active. */
  const setActiveLink = (id) => {
    navLinkEls.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const updateActiveSection = () => {
    if (!sections.length) return;
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const probeLine = navHeight + window.innerHeight * 0.25;

    let currentId = sections[0].id;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeLine) {
        currentId = section.id;
      } else {
        break;
      }
    }

    // Near the bottom of the page, force the last section active even if
    // its content doesn't reach the probe line (e.g. a short final section).
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) currentId = sections[sections.length - 1].id;

    setActiveLink(currentId);
  };

  /* ---------- Back to top + navbar scrolled state ---------- */
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }

  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
    toggleBackToTop();
    updateActiveSection();
  };

  // Throttle scroll work to animation frames.
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        onScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Scroll reveal (supports up / left / right variants) ---------- */
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Hero entrance (runs once, on load) ---------- */
  requestAnimationFrame(() => {
    heroReveals.forEach((el) => el.classList.add('in-view'));
  });

  /* ---------- Smooth scroll for in-page links (with sticky nav offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return; // skip bare "#"
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Ambient hero particles (mixed accent colors) ---------- */
  if (particlesContainer && !prefersReducedMotion) {
    const PARTICLE_COUNT = 26;
    const variants = ['', 'particle-cyan', 'particle-gold'];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('span');
      p.className = `particle ${variants[i % variants.length]}`.trim();
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${Math.random() * 20}%`;
      p.style.animationDuration = `${6 + Math.random() * 8}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      particlesContainer.appendChild(p);
    }
  }
});
