/* =============================================
   LUMINAE AGENCY — main.js
   ============================================= */

'use strict';

// =============================================
// CURSOR
// =============================================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

if (cursor && cursorTrail) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, input, select, textarea, .work-card, .case-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.4)';
      cursorTrail.style.borderColor = 'rgba(0, 201, 175, 0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.borderColor = 'rgba(0, 201, 175, 0.4)';
    });
  });
}

// =============================================
// SPA NAVIGATION
// =============================================
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
let currentPage = 'home';

function showPage(pageId) {
  if (pageId === currentPage) return;

  // Hide current page
  const current = document.getElementById(currentPage);
  if (current) current.classList.add('hidden');

  // Show target page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
    // Reset animation
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  currentPage = pageId;

  // Update active nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Update URL hash
  window.location.hash = pageId === 'home' ? '' : pageId;

  // Trigger reveals for new page
  setTimeout(() => {
    triggerReveals();
  }, 100);

  // Close mobile menu
  closeMobileMenu();
}

// Attach navigation to all data-page links
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (link) {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) showPage(page);
  }
});

// Handle back/forward
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (document.getElementById(hash)) {
    showPage(hash);
  }
});

// On load, check hash
(function initPage() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (document.getElementById(hash)) {
    pages.forEach(p => p.classList.add('hidden'));
    document.getElementById(hash).classList.remove('hidden');
    currentPage = hash;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === hash);
    });
  }
  setTimeout(triggerReveals, 200);
})();

// =============================================
// MOBILE MENU
// =============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  mobileMenu.classList.add('open');
  mobileMenu.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
}

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
  setTimeout(() => {
    if (!menuOpen) mobileMenu.style.display = '';
  }, 400);
}

hamburger.addEventListener('click', () => {
  menuOpen ? closeMobileMenu() : openMobileMenu();
});

// =============================================
// NAV SCROLL EFFECT
// =============================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// Also run on scroll for dynamic visibility
window.addEventListener('scroll', () => {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}, { passive: true });

// =============================================
// WORK PAGE FILTER
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const caseCards = document.querySelectorAll('.case-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    caseCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.pointerEvents = '';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        card.style.pointerEvents = 'none';
        setTimeout(() => {
          if (!show) card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// =============================================
// CONTACT FORM
// =============================================
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.remove('hidden');
      // Trigger reveal
      formSuccess.style.animation = 'pageFadeIn 0.5s ease forwards';
    }, 1200);
  });
}

// =============================================
// TYPING / COUNTER ANIMATION
// =============================================
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const text = stat.textContent;
    const match = text.match(/[\d.]+/);
    if (!match) return;

    const target = parseFloat(match[0]);
    const prefix = text.slice(0, text.indexOf(match[0]));
    const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
    const isDecimal = match[0].includes('.');
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      stat.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Observe hero stats
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// =============================================
// PARALLAX ORBS
// =============================================
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  document.querySelectorAll('.orb-1').forEach(orb => {
    orb.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  });
  document.querySelectorAll('.orb-2').forEach(orb => {
    orb.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  });
  document.querySelectorAll('.orb-3').forEach(orb => {
    orb.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".marquee-track");

  if (!track) return;

  let x = 0;
  const speed = 1; // adjust slower/faster

  function animate() {
    x -= speed;

    // reset exactly at half width (because content is duplicated)
    if (Math.abs(x) >= track.scrollWidth / 2) {
      x = 0;
    }

    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});
// =============================================
// MARQUEE — pause on hover
// =============================================
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const wrap = marqueeTrack.parentElement;
  wrap.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  wrap.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// =============================================
// SMOOTH NAV HIGHLIGHT ON SCROLL
// =============================================
// (handled via page system — no section-based scroll tracking needed)

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initial reveal for above-fold
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 120);
    });
  }, 100);

  // Trigger observer-based reveals
  setTimeout(triggerReveals, 300);
});