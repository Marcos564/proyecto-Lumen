interface RingSpinnerProps{
  color?: string,
  size?: number
  classname?: string
}

export const RingSpinner = ({ color = "#00b4d8", size = 52, classname = "" } : RingSpinnerProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 50 50"
    className={`animate-spin ${classname}`}
    style={color ? { color } : undefined}
  >
    {/* Pista / Fondo translúcido */}
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-20"
    />
    {/* Anillo de carga */}
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeDasharray="80 100"
      strokeLinecap="round"
      className="opacity-100"
    />
  </svg>
);