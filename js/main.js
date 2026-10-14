(() => {
  const root = document.documentElement;
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const hero = document.querySelector(".hero");

  const THEME_KEY = "cursor-theme";
  const THEME_COLORS = { light: "#f7f7f4", dark: "#14120b" };

  const getTheme = () =>
    root.getAttribute("data-theme") === "dark" ? "dark" : "light";

  const setTheme = (theme) => {
    const next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
    if (themeMeta) themeMeta.setAttribute("content", THEME_COLORS[next]);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        next === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
      );
    }
  };

  themeToggle?.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
  setTheme(getTheme());

  const updateNav = () => {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 8);
    if (hero) {
      nav.classList.toggle("is-over-hero", y < hero.offsetTop + hero.offsetHeight - 72);
    }
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    nodes.forEach((el) => io.observe(el));
  } else {
    nodes.forEach((el) => el.classList.add("is-visible"));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
})();
