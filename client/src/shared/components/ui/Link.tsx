/* eslint-disable react-refresh/only-export-components */
import {
  Link as ReactRouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

type LinkVariant = "default" | "button" | "muted" | "none";

// Heredamos las props originales de react-router-dom
interface AppLinkProps extends RouterLinkProps {
  variant?: LinkVariant;
  isExternal?: boolean;
}

const STYLES: Record<LinkVariant, string> = {
  none: "",
  default: "text-teal-500 font-medium hover:underline transition-colors",
  button:
    "inline-flex items-center justify-center font-bold rounded transition-colors",
  muted: "text-gray-500 hover:text-gray-900 transition-colors",
};

export function Link({
  to,
  children,
  variant = "none",
  isExternal = false,
  className = "",
  ...props
}: AppLinkProps) {
  const combinedClasses = `${STYLES[variant]} ${className}`.trim();

  // 1. Detectar si es un enlace externo (ej: "https://github.com/projectcodingzero")
  const isHttp = typeof to === "string" &&
    (to.startsWith("http://") || to.startsWith("https://"));

  if (isExternal || isHttp) {
    return (
      <ReactRouterLink
        to={to as string}
        className={combinedClasses}
      >
        {children}
      </ReactRouterLink>
    );
  }

  // 2. Si es navegación interna, usamos el Link de react-router-dom
  return (
    <ReactRouterLink to={to} className={combinedClasses} {...props}>
      {children}
    </ReactRouterLink>
  );
}
