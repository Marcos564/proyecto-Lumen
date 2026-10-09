interface PulseSpinnerProps{
    color?: string,
    size?: number
}

export const PulseSpinner = ({ color = "#00b4d8", size = 52 } : PulseSpinnerProps) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    {/* Outer Glowing Ring */}
    <span
      className="absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping"
      style={{ backgroundColor: color }}
    />
    
    {/* Central SVG Container */}
    <div
      className="relative flex items-center justify-center rounded-full p-3 shadow-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full animate-pulse"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
  </div>
);