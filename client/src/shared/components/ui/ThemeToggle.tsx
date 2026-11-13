import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className={`theme-toggle relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-colors ${className}`}
    >
      <Sun
        aria-hidden
        className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        aria-hidden
        className={`absolute h-5 w-5 transition-all duration-300 ease-out ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
