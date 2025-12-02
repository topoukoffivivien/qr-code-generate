import { ref, watch, onMounted, onUnmounted } from "vue";

export function useTheme() {
  const theme = ref("system"); // "light" | "dark" | "system"
  let removeListener = null;

  // Apply theme to DOM
  const apply = () => {
    if (theme.value === "light") {
      document.documentElement.dataset.theme = "light";
    } else if (theme.value === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      // system mode
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
    }
  };

  // Change theme manually
  const setTheme = (value) => {
    theme.value = value;
  };

  // Toggle light → dark → system
  const toggleTheme = () => {
    theme.value =
      theme.value === "light"
        ? "dark"
        : theme.value === "dark"
        ? "system"
        : "light";
  };

  // Real-time system theme listener
  const setupSystemListener = () => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme.value === "system") apply();
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  };

  // INIT
  onMounted(() => {
    // load saved theme
    const saved = localStorage.getItem("theme");
    if (saved) theme.value = saved;

    apply();
    removeListener = setupSystemListener();
  });

  onUnmounted(() => {
    if (removeListener) removeListener();
  });

  // Watch changes & persist them
  watch(theme, (val) => {
    localStorage.setItem("theme", val);
    apply();
  });

  const isDark = () => {
    if (theme.value === "dark") return true;
    if (theme.value === "light") return false;

    // system mode
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };
}
