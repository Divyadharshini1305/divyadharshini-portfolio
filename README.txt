DIVYADHARSHINI D — PORTFOLIO WEBSITE
=====================================

HOW TO RUN
----------
No build process, no dependencies, no server required.
Simply double-click "index.html" (or right-click > Open With > your browser).

FOLDER STRUCTURE
----------------
portfolio/
├── index.html      → All page content and structure
├── style.css       → All styling (design system, layout, responsive rules)
├── script.js       → All interactivity (nav, scroll reveal, mobile menu, particles)
├── assets/
│   ├── resume.pdf  → Linked from the "Download Resume" button
│   └── profile.jpg → (optional) add a professional photo here — see below
└── README.txt      → This file

ADDING A PROFILE PHOTO
-----------------------
No photo was supplied, so the site currently ships without one — it was not
invented. If you'd like to add one:
  1. Save a professional photo as assets/profile.jpg
  2. Open index.html and add an <img> tag wherever you'd like it to appear
     (e.g. in the About or Hero section), for example:
     <img src="assets/profile.jpg" alt="Divyadharshini D" class="profile-photo">
  3. Style it in style.css as desired.

EDITING CONTENT
----------------
- All text content lives directly in index.html — search for the section
  you want to edit (marked with HTML comments like <!-- ================= HERO ================= -->).
- Colors, fonts and spacing are controlled by CSS variables at the top of
  style.css (the :root block) — change values there to re-theme the site.
- The LinkedIn button in the Contact section currently points to "#" as a
  placeholder — replace it with your real LinkedIn profile URL in index.html.

BROWSER SUPPORT
----------------
Built with modern, standards-based HTML5, CSS3 (custom properties, grid,
flexbox) and vanilla JavaScript (IntersectionObserver). Works in all current
versions of Chrome, Firefox, Edge and Safari.

CREDITS
-------
Fonts: Space Grotesk, Inter, Orbitron (Google Fonts)
No external frameworks, libraries, or build tools used.
