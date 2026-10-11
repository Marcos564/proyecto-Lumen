interface DotsSpinnerProps {
  color?: string;
}
export const DotsSpinner = ({ color = "#00b4d8" }: DotsSpinnerProps) => (
  <div className="flex items-center gap-2 py-2">
    <div
      className="w-3.5 h-3.5 rounded-full animate-bounce"
      style={{ backgroundColor: color, animationDelay: "0ms" }}
    />
    <div
      className="w-3.5 h-3.5 rounded-full animate-bounce"
      style={{ backgroundColor: color, animationDelay: "150ms" }}
    />
    <div
      className="w-3.5 h-3.5 rounded-full animate-bounce"
      style={{ backgroundColor: color, animationDelay: "300ms" }}
    />
  </div>
);
