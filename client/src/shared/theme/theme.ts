export type Theme = "light" | "dark";

export const themeKey = "@lumen:theme";

const TRANSITION_CLASS = "theme-transition";
const TRANSITION_MS = 320;

/** Lee el tema guardado. Devuelve null si el usuario todavía no eligió. */
export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(themeKey);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

/** Tema inicial: siempre claro hasta que el usuario cambie (o si ya eligió). */
export function getInitialTheme(): Theme {
  return getStoredTheme() ?? "light";
}

/** Aplica el tema al <html> y, si se pide, anima la transición. */
export function applyTheme(theme: Theme, options?: { animate?: boolean }): void {
  const root = document.documentElement;

  if (options?.animate) {
    root.classList.add(TRANSITION_CLASS);
    window.setTimeout(
      () => root.classList.remove(TRANSITION_CLASS),
      TRANSITION_MS,
    );
  }

  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
