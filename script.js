const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const successMessage = document.getElementById("formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\-\s]{10,15}$/;

  const showError = (field, message) => {
    const wrapper = field.closest(".form-field");
    const errorText = wrapper.querySelector(".error-text");
    wrapper.classList.add("invalid");
    errorText.textContent = message;
  };

  const clearError = (field) => {
    const wrapper = field.closest(".form-field");
    const errorText = wrapper.querySelector(".error-text");
    wrapper.classList.remove("invalid");
    errorText.textContent = "";
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (!value) {
      showError(field, "This field is required.");
      return false;
    }

    if (field.type === "email" && !emailPattern.test(value)) {
      showError(field, "Enter a valid email address.");
      return false;
    }

    if (field.type === "tel" && !phonePattern.test(value)) {
      showError(field, "Enter a valid phone number.");
      return false;
    }

    clearError(field);
    return true;
  };

  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-field")?.classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.textContent = "";

    const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
    const allValid = fields.every((field) => validateField(field));

    if (!allValid) {
      return;
    }

    successMessage.textContent = "Thank you. Your inquiry has been submitted successfully.";
    contactForm.reset();
    fields.forEach((field) => clearError(field));
  });
}
