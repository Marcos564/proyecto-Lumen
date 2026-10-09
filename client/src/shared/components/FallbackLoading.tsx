import React from "react";
import { ShieldCheck } from "lucide-react";
import { RingSpinner, DotsSpinner, PulseSpinner } from "../index"; // Eliminada la extensión .ts

export interface FallbackLoadingProps {
  title?: string;
  subtitle?: string;
  variant?: "ring" | "pulse" | "dots";
  brandColor?: string;
  fullScreen?: boolean;
  blurOverlay?: boolean;
  showCard?: boolean;
  badgeText?: string;
  darkMode?: boolean;
}

export function FallbackLoading({
  title = "Cargando sistema...",
  subtitle = "Por favor, espere un momento mientras verificamos las credenciales...",
  variant = "ring",
  brandColor = "#00b4d8",
  fullScreen = true,
  blurOverlay = false,
  showCard = true,
  badgeText = "SISTEMA LUMEN",
  darkMode = false,
}: FallbackLoadingProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center transition-all duration-300
        ${fullScreen ? "fixed inset-0 z-50 min-h-screen w-full" : "w-full py-12"}
        ${
          blurOverlay
            ? darkMode
              ? "backdrop-blur-md bg-slate-950/70"
              : "backdrop-blur-md bg-slate-50/70"
            : darkMode
            ? "bg-slate-950"
            : "bg-slate-50/80"
        }
        ${darkMode ? "text-slate-100" : "text-slate-800"}
      `}
    >
      {/* Contenedor principal */}
      <div
        className={`
          relative flex flex-col items-center text-center transition-all duration-300
          ${
            showCard
              ? `p-8 sm:p-10 rounded-2xl max-w-md w-11/12 shadow-xl border ${
                  darkMode
                    ? "bg-slate-900/90 border-slate-800/80 shadow-slate-950/50"
                    : "bg-white/95 border-slate-200/80 shadow-slate-200/60"
                }`
              : "p-4 max-w-md w-full bg-transparent"
          }
        `}
      >
        {/* Badge institucional */}
        {badgeText && (
          <div
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-6
              ${
                darkMode
                  ? "bg-slate-800/80 text-slate-300 border border-slate-700"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }
            `}
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: brandColor }} />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Renderizado dinámico de variantes de spinner */}
        <div className="mb-6 flex items-center justify-center min-h-[56px]">
          {variant === "ring" && <RingSpinner color={brandColor} size={52} />}

          {variant === "pulse" && (
            <div
              className="w-12 h-12 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: brandColor }}
            />
          )}

          {variant === "dots" && (
            <div className="flex space-x-2 items-center h-12">
              <div
                className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.3s]"
                style={{ backgroundColor: brandColor }}
              />
              <div
                className="w-3 h-3 rounded-full animate-bounce [animation-delay:-0.15s]"
                style={{ backgroundColor: brandColor }}
              />
              <div
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ backgroundColor: brandColor }}
              />
            </div>
          )}
        </div>

        {/* Título principal */}
        <h3
          className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h3>

        {/* Subtítulo */}
        <p
          className={`text-sm leading-relaxed max-w-xs ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>

        {/* Barra de progreso indeterminada */}
        <div
          className={`w-full rounded-full h-1.5 mt-8 overflow-hidden relative ${
            darkMode ? "bg-slate-800" : "bg-slate-200/60"
          }`}
        >
          <div
            className="h-full rounded-full animate-pulse w-full origin-left"
            style={{
              backgroundColor: brandColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}