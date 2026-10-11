import { CheckCircle2 } from "lucide-react";
interface SignInSuccessMessageProps {
  children?: React.ReactNode | React.ReactNode[];
}
export function SignInSuccessMessage({ children }: SignInSuccessMessageProps) {
  return (
    <div className="text-center py-6 space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-2">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">¡Sesión Iniciada!</h3>
      <p className="text-sm text-slate-600 max-w-sm mx-auto">
        Ha ingresado exitosamente a la consola de administración de{" "}
        <strong>Lumen</strong>.
      </p>
      <div className="pt-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
