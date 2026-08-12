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
  const mouseGlow = document.getElementById('mouseGlow');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up:not(.hero .reveal-up)'
  );
  const heroReveals = document.querySelectorAll('.hero .reveal-up');

  /* ---------- Cinematic cyber portal intro ----------
     Opens from the center like a circular energy aperture, then reveals the
     existing portfolio. It is intentionally original and uses CSS/SVG-like
     geometry rather than movie assets. */
  const portalIntro = document.getElementById('portalIntro');
  const portalAperture = document.getElementById('portalAperture');
  const portalStatus = document.getElementById('portalStatus');
  const portalSparks = document.getElementById('portalSparks');

  const runPortalIntro = () => {
    if (!portalIntro) return;
    if (prefersReducedMotion) {
      portalIntro.remove();
      return;
    }

    const sparkColors = ['#ff3b3f', '#1fd6e8', '#c084fc', '#f5b942'];
    if (portalSparks) {
      for (let i = 0; i < 96; i += 1) {
        const spark = document.createElement('span');
        spark.className = 'portal-spark';
        spark.style.setProperty('--angle', `${(360 / 96) * i + (Math.random() * 8 - 4)}deg`);
        spark.style.setProperty('--radius', `${105 + Math.random() * 55}px`);
        spark.style.setProperty('--spin', `${Math.random() > .5 ? 1 : -1}turn`);
        spark.style.setProperty('--delay', `${Math.random() * 3.2}s`);
        spark.style.setProperty('--spark-w', `${1 + Math.random() * 2}px`);
        spark.style.setProperty('--spark-h', `${6 + Math.random() * 13}px`);
        spark.style.setProperty('--spark-color', sparkColors[i % sparkColors.length]);
        portalSparks.appendChild(spark);
      }
    }

    const start = performance.now();
    const total = 6200;
    const revealStart = 3650;
    const revealEnd = 5350;
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.72;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / total, 1);

      /* Tiny aperture first, then a strong outward expansion. */
      let radius = 0;
      if (elapsed < 1100) {
        radius = 6 + easeOut(elapsed / 1100) * 30;
      } else if (elapsed < revealStart) {
        radius = 36 + ((elapsed - 1100) / (revealStart - 1100)) * 24;
      } else if (elapsed < revealEnd) {
        radius = 68 + easeInOut((elapsed - revealStart) / (revealEnd - revealStart)) * (maxRadius - 68);
      } else {
        radius = maxRadius;
      }

      portalIntro.style.setProperty('--portal-radius', `${radius}px`);
      if (portalAperture) {
        const ringScale = Math.min(3.8, 1 + radius / 85);
        portalAperture.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      }

      if (portalStatus) {
        if (elapsed < 1300) portalStatus.textContent = 'SYSTEM INITIALIZING';
        else if (elapsed < 3500) portalStatus.textContent = 'CHANNEL OPENING';
        else if (elapsed < 5400) portalStatus.textContent = 'PORTAL EXPANDING';
        else portalStatus.textContent = 'SYSTEM ONLINE';
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        portalIntro.classList.add('is-finished');
        window.setTimeout(() => portalIntro.remove(), 650);
      }
    };

    requestAnimationFrame(frame);
  };

  runPortalIntro();

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
    const PARTICLE_COUNT = 18;
    const variants = ['particle-purple', 'particle-indigo', 'particle-cyan', '', 'particle-purple', 'particle-gold'];
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

  /* ---------- Mouse-following ambient glow (desktop only) ----------
     Purple/blue radial that trails the cursor at very low opacity.
     Disabled on touch devices and when reduced motion is requested. */
  const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (mouseGlow && supportsFinePointer && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      mouseGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mouseGlow.classList.add('is-active');
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      mouseGlow.classList.remove('is-active');
    });

    rafId = requestAnimationFrame(render);
  }

  /* ---------- AI Scan Console (Smart Plant Diagnosis) ----------
     Wrapped in its own try/catch so any failure here is isolated
     and can never take down navigation, reveal, or the rest of init. */
  try {
    const scanConsoleEl = document.getElementById('scanConsole');
    const scanLogEl = document.getElementById('scanLog');
    const scanMeterFill = document.getElementById('scanMeterFill');
    const scanMeterValue = document.getElementById('scanMeterValue');
    const scanResultText = document.getElementById('scanResultText');

    if (scanConsoleEl && scanLogEl && scanMeterFill && scanMeterValue && scanResultText) {
      const SCAN_STEPS = [
        'Initializing vision model…',
        'Analyzing leaf structure…',
        'Cross-referencing pathogen database…',
        'No lesions or discoloration found.'
      ];
      const SCAN_CONFIDENCE = 97;
      const SCAN_RESULT = 'DIAGNOSIS: HEALTHY — no treatment needed';

      const typeLogLine = (text) => new Promise((resolve) => {
        const li = document.createElement('li');
        const prompt = document.createElement('span');
        prompt.className = 'lp';
        prompt.textContent = '>';
        const label = document.createElement('span');
        label.textContent = text;
        li.appendChild(prompt);
        li.appendChild(label);
        scanLogEl.appendChild(li);

        if (prefersReducedMotion) {
          li.classList.add('done');
          resolve();
          return;
        }

        requestAnimationFrame(() => {
          const fullWidth = li.scrollWidth;
          li.style.setProperty('--type-width', `${fullWidth}px`);
          li.style.setProperty('--type-steps', String(text.length + 2));
          const duration = Math.max(0.32, text.length * 0.022);
          li.style.setProperty('--type-dur', `${duration}s`);
          li.classList.add('typing');
          window.setTimeout(() => {
            li.classList.remove('typing');
            li.classList.add('done');
            resolve();
          }, duration * 1000 + 90);
        });
      });

      const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion ? 0 : ms));

      const animateMeter = () => new Promise((resolve) => {
        scanMeterFill.style.width = `${SCAN_CONFIDENCE}%`;
        if (prefersReducedMotion) {
          scanMeterValue.textContent = `${SCAN_CONFIDENCE}%`;
          resolve();
          return;
        }
        const durationMs = 950;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min(1, (now - startTime) / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3);
          scanMeterValue.textContent = `${Math.round(eased * SCAN_CONFIDENCE)}%`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(step);
      });

      const runScan = async () => {
        scanConsoleEl.classList.add('scanning');
        for (const line of SCAN_STEPS) {
          await typeLogLine(line);
          await wait(90);
        }
        await animateMeter();
        scanResultText.textContent = SCAN_RESULT;
        scanConsoleEl.classList.add('scan-complete');
      };

      if (prefersReducedMotion) {
        runScan();
      } else if ('IntersectionObserver' in window) {
        const scanObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                runScan();
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.45 }
        );
        scanObserver.observe(scanConsoleEl);
      } else {
        runScan();
      }
    }
  } catch (err) {
    // Scan console is a non-critical enhancement; fail silently.
  }
});
