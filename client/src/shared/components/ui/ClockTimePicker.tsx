import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Clock, X } from "lucide-react";
import { inputClass } from "./Field";

/*
 * Selector de hora analógico compacto.
 *
 * El formulario muestra un disparador del tamaño de un input. Al tocarlo se
 * abre un popover (en un portal, para que no lo recorte el scroll del modal)
 * con un reloj de 24 h en dos anillos:
 *  - Anillo exterior: 00 a 11. Anillo interior: 12 a 23.
 *  - Al elegir la hora se pasa a los minutos (00, 05, ... 55) y al elegir el
 *    minuto se cierra el popover.
 *  - El centro muestra el valor elegido y permite volver a cambiar de modo.
 *  - `minTime` deshabilita los horarios pasados (se usa cuando la fecha es hoy).
 *
 * Se cierra con clic fuera, Escape o el botón X. Los minutos se eligen de 5 en
 * 5; si el valor inicial tiene minutos sueltos (p. ej. 17) se conservan hasta
 * que el usuario elija otro.
 */
interface ClockTimePickerProps {
  /** Hora en formato "HH:mm" (o "" si todavía no se eligió). */
  value: string;
  onChange: (value: string) => void;
  /** Hora mínima seleccionable en formato "HH:mm". */
  minTime?: string;
}

type Mode = "hour" | "minute";

const SLOTS = Array.from({ length: 12 }, (_, index) => index);
const MINUTE_STEP = 5;
const POPOVER_WIDTH = 256;
const POPOVER_HEIGHT = 320;
const GAP = 8;

const pad = (value: number) => String(value).padStart(2, "0");

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function slotStyle(index: number, radius: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return {
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  };
}

function buttonClass(selected: boolean, disabled: boolean, compact = false) {
  return [
    "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-semibold tabular-nums transition-colors",
    compact ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[11px]",
    selected
      ? "border-teal-600 bg-teal-600 text-white shadow-md"
      : "border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700",
    disabled
      ? "cursor-not-allowed opacity-30 hover:border-slate-200 hover:bg-white"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ClockTimePicker({
  value,
  onChange,
  minTime,
}: ClockTimePickerProps) {
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("hour");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const [hourText, minuteText] = value.split(":");
  const hasValue = Boolean(value);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const currentHour = Number.isFinite(hour) ? hour : 0;
  const currentMinute = Number.isFinite(minute) ? minute : 0;

  const [minHourText, minMinuteText] = (minTime ?? "").split(":");
  const minHour = Number(minHourText);
  const minMinute = Number(minMinuteText);
  const hasMin =
    Boolean(minTime) && Number.isFinite(minHour) && Number.isFinite(minMinute);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const left = clamp(
      rect.left,
      GAP,
      Math.max(GAP, window.innerWidth - POPOVER_WIDTH - GAP),
    );
    const below = rect.bottom + GAP;
    const above = rect.top - POPOVER_HEIGHT - GAP;
    const top =
      below + POPOVER_HEIGHT <= window.innerHeight - GAP
        ? below
        : Math.max(GAP, above);

    setPosition({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    // capture: true también detecta el scroll interno del modal.
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function openPicker() {
    setMode("hour");
    setOpen(true);
  }

  function isHourDisabled(candidate: number) {
    return hasMin && candidate < minHour;
  }

  function isMinuteDisabled(candidate: number) {
    if (!hasMin) return false;
    if (currentHour > minHour) return false;
    if (currentHour < minHour) return true;
    return candidate < minMinute;
  }

  function selectHour(candidate: number) {
    if (isHourDisabled(candidate)) return;
    onChange(`${pad(candidate)}:${pad(currentMinute)}`);
    setMode("minute");
  }

  function selectMinute(candidate: number) {
    if (isMinuteDisabled(candidate)) return;
    onChange(`${pad(currentHour)}:${pad(candidate)}`);
    close();
  }

  const handSlot =
    mode === "hour"
      ? currentHour % 12
      : Math.round(currentMinute / MINUTE_STEP) % 12;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : openPicker())}
        className={`${inputClass} flex items-center justify-between text-left`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        aria-label={
          hasValue
            ? `Hora seleccionada ${pad(currentHour)}:${pad(currentMinute)}. Cambiar hora`
            : "Elegir hora"
        }
      >
        <span className={hasValue ? "tabular-nums" : "text-slate-400"}>
          {hasValue ? `${pad(currentHour)}:${pad(currentMinute)}` : "Elegir hora"}
        </span>
        <Clock className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-label="Selector de hora"
            style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
            className="fixed z-[60] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Elegir horario
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar selector"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mx-auto h-56 w-56 rounded-full border border-slate-200 bg-slate-50/70 shadow-inner">
              {/* Marco y marcas del reloj */}
              <div className="pointer-events-none absolute inset-2 rounded-full border border-dashed border-slate-200" />
              {SLOTS.map((slot) => (
                <span
                  key={`tick-${slot}`}
                  className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300"
                  style={slotStyle(slot, 47)}
                />
              ))}

              {/* Aguja: apunta a la hora o al minuto según el modo */}
              {hasValue && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1/2 left-1/2 h-[38%] w-0.5 origin-bottom rounded-full bg-teal-500/70"
                  style={{ transform: `translateX(-50%) rotate(${handSlot * 30}deg)` }}
                />
              )}

              {mode === "hour" ? (
                <>
                  {SLOTS.map((slot) => {
                    const outer = slot;
                    const inner = slot + 12;
                    return (
                      <div key={`hour-${slot}`}>
                        <button
                          type="button"
                          aria-label={`Hora ${pad(outer)}`}
                          aria-pressed={hasValue && currentHour === outer}
                          disabled={isHourDisabled(outer)}
                          onClick={() => selectHour(outer)}
                          className={buttonClass(
                            hasValue && currentHour === outer,
                            isHourDisabled(outer),
                          )}
                          style={slotStyle(slot, 40)}
                        >
                          {pad(outer)}
                        </button>
                        <button
                          type="button"
                          aria-label={`Hora ${pad(inner)}`}
                          aria-pressed={hasValue && currentHour === inner}
                          disabled={isHourDisabled(inner)}
                          onClick={() => selectHour(inner)}
                          className={buttonClass(
                            hasValue && currentHour === inner,
                            isHourDisabled(inner),
                            true,
                          )}
                          style={slotStyle(slot, 24)}
                        >
                          {pad(inner)}
                        </button>
                      </div>
                    );
                  })}
                </>
              ) : (
                SLOTS.map((slot) => {
                  const candidate = slot * MINUTE_STEP;
                  return (
                    <button
                      key={`minute-${candidate}`}
                      type="button"
                      aria-label={`Minuto ${pad(candidate)}`}
                      aria-pressed={currentMinute === candidate}
                      disabled={isMinuteDisabled(candidate)}
                      onClick={() => selectMinute(candidate)}
                      className={buttonClass(
                        currentMinute === candidate,
                        isMinuteDisabled(candidate),
                      )}
                      style={slotStyle(slot, 40)}
                    >
                      {pad(candidate)}
                    </button>
                  );
                })
              )}

              {/* Display central: también sirve para alternar entre hora y minutos */}
              <button
                type="button"
                onClick={() => {
                  // Sin hora elegida no tiene sentido pasar a los minutos.
                  if (!hasValue) {
                    setMode("hour");
                    return;
                  }
                  setMode((current) => (current === "hour" ? "minute" : "hour"));
                }}
                aria-label={mode === "hour" ? "Elegir minutos" : "Elegir hora"}
                className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-teal-500 bg-white shadow-lg hover:border-teal-600"
              >
                <span className="text-base font-bold tabular-nums text-slate-800">
                  {hasValue ? `${pad(currentHour)}:${pad(currentMinute)}` : "--:--"}
                </span>
                <span className="text-[8px] font-semibold tracking-wider text-slate-400">
                  {mode === "hour" ? "HORA" : "MIN"}
                </span>
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              {mode === "hour"
                ? "Elegí la hora"
                : "Ahora los minutos (de 5 en 5)"}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
