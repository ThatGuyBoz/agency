/* =========================
   BLUEBIRD MARKETING JS
========================= */

/* =========================
   HEADER SCROLL EFFECT
========================= */

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* =========================
   SMOOTH SCROLL OFFSET FIX
========================= */

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    const targetId = link.getAttribute("href");

    if (targetId.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(targetId);

      const headerHeight = header.offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: targetPosition - headerHeight,
        behavior: "smooth"
      });
    }
  });
});

/* =========================
   SCROLL REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll(
  ".service-card, .portfolio-item, .process-steps li, .stat"
);

const revealOnScroll = () => {
  const triggerPoint = window.innerHeight * 0.85;

  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerPoint) {
      el.classList.add("reveal");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run on load

/* =========================
   CONTACT FORM VALIDATION
========================= */

const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Message sent successfully (demo).");
    form.reset();
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
