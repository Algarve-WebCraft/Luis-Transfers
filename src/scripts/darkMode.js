const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark-mode", isDark);

  document.querySelectorAll("#dark-mode-toggle").forEach((button) => {
    button.setAttribute("aria-pressed", String(isDark));
  });
}

function switchTheme(theme) {
  applyTheme(theme);
  localStorage.setItem("theme", theme);
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("#dark-mode-toggle");

  if (!button) return;

  const isDark = document.documentElement.classList.contains("dark-mode");
  const newTheme = isDark ? "light" : "dark";

  const updateTheme = () => switchTheme(newTheme);

  if (document.startViewTransition) {
    document.startViewTransition(updateTheme);
  } else {
    updateTheme();
  }
});

themeQuery.addEventListener("change", (event) => {
  if (localStorage.getItem("theme") !== null) return;

  applyTheme(event.matches ? "dark" : "light");
});
