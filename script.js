document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const languageToggle = document.getElementById("languageToggle");
  const projectsMoreBtn = document.getElementById("projectsMoreBtn");

  // ===== Theme =====
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") body.classList.add("light");

  function updateThemeButton() {
    if (!themeToggle) return;
    const isLight = body.classList.contains("light");
    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem(
        "portfolio-theme",
        body.classList.contains("light") ? "light" : "dark"
      );
      updateThemeButton();
    });
  }

  // ===== Mobile menu =====
  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      menuToggle.textContent = isOpen ? "×" : "☰";
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    });
  }

  updateThemeButton();

  // ===== Reveal animation =====
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ===== Selected Work: View More =====
  function updateMoreButtonLabel() {
    if (!projectsMoreBtn) return;

    const expanded = projectsMoreBtn.getAttribute("aria-expanded") === "true";
    const label = projectsMoreBtn.querySelector(".more-label");
    const arrow = projectsMoreBtn.querySelector(".more-arrow");

    if (label) {
      label.textContent = expanded
        ? (currentLanguage === "bn" ? "কম দেখুন" : "Show Less")
        : (currentLanguage === "bn" ? "আরও প্রজেক্ট দেখুন" : "View More Projects");
    }

    if (arrow) arrow.textContent = expanded ? "↑" : "↓";
  }

  if (projectsMoreBtn) {
    projectsMoreBtn.addEventListener("click", () => {
      const extraProjects = document.querySelectorAll(".more-project");
      const expanded = projectsMoreBtn.getAttribute("aria-expanded") === "true";

      extraProjects.forEach((project) => {
        project.classList.toggle("is-visible", !expanded);
      });

      projectsMoreBtn.setAttribute("aria-expanded", String(!expanded));
      projectsMoreBtn.classList.toggle("expanded", !expanded);
      updateMoreButtonLabel();
    });
  }

  // ===== English / Bangla language switch =====
  let currentLanguage = localStorage.getItem("portfolio-language") || "en";

  function applyLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang === "bn" ? "bn" : "en";

    document.querySelectorAll("[data-en][data-bn]").forEach((el) => {
      el.textContent = lang === "bn" ? el.dataset.bn : el.dataset.en;
    });

    const prefix = document.querySelector("[data-en-prefix][data-bn-prefix]");
    if (prefix) {
      prefix.textContent =
        lang === "bn" ? prefix.dataset.bnPrefix : prefix.dataset.enPrefix;
    }

    // Keep the person's name translated correctly.
    const personName = document.querySelector(".person-name[data-en][data-bn]");
    if (personName) {
      personName.textContent =
        lang === "bn" ? personName.dataset.bn : personName.dataset.en;
    }

    if (languageToggle) {
      languageToggle.textContent = lang === "bn" ? "English" : "বাংলা";
      languageToggle.setAttribute(
        "aria-label",
        lang === "bn"
          ? "Switch to English"
          : "বাংলা ভাষায় পরিবর্তন করুন"
      );
    }

    updateMoreButtonLabel();
    localStorage.setItem("portfolio-language", lang);
  }

  if (languageToggle) {
    languageToggle.addEventListener("click", () => {
      applyLanguage(currentLanguage === "en" ? "bn" : "en");
    });

    applyLanguage(currentLanguage);
  }
});
