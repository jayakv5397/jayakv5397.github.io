(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const mobileViewport = window.matchMedia("(max-width: 760px)");

  function closeMenu({ restoreFocus = false } = {}) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    if (restoreFocus) menuToggle.focus();
  }

  // Enable the compact menu only after its keyboard and pointer handlers exist.
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(expanded));
    menuToggle.setAttribute(
      "aria-label",
      expanded ? "Close navigation" : "Open navigation",
    );
    navigation.classList.toggle("is-open", expanded);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu({ restoreFocus: true });
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-inner")) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".header-inner")) closeMenu();
  });
  mobileViewport.addEventListener("change", () => closeMenu());
  document.documentElement.classList.add("js");

  const filterGroup = document.querySelector(".project-filters");
  const filterButtons = Array.from(filterGroup.querySelectorAll("button"));
  const projectCards = Array.from(document.querySelectorAll("[data-category]"));
  const projectCount = document.querySelector(".project-count");
  filterGroup.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    const category = button.dataset.filter;
    let visibleCount = 0;
    for (const card of projectCards) {
      card.hidden = category !== "all" && card.dataset.category !== category;
      if (!card.hidden) visibleCount += 1;
    }
    for (const filterButton of filterButtons) {
      filterButton.setAttribute(
        "aria-pressed",
        String(filterButton === button),
      );
    }
    projectCount.textContent = `${visibleCount} ${category === "all" ? "selected" : category} projects`;
  });
  filterGroup.hidden = false;

  // Optional navigation enhancement; content stays usable without this API or JS.
  if ("IntersectionObserver" in window) {
    const sectionLinks = Array.from(
      navigation.querySelectorAll('a[href^="#"]'),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of sectionLinks) {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    for (const link of sectionLinks) {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    }
    observer.observe(document.querySelector("#home"));
  }

  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
})();
