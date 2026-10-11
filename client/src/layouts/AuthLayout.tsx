import { Lock } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Paw Print Motif (Translucent Watermark) */}
      <div className="absolute right-10 top-10 opacity-[0.03] text-teal-900 pointer-events-none">
        <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Lumen Brand Logo Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
            {/* Custom Paw / Medical Cross Icon */}
            <img
              src="/favicon.svg"
              alt="Lumen Logo"
              className="mx-auto w-16 h-16"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">
            Lumen
          </span>
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
        {/* System Helper Tip */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Conexión cifrada de alta seguridad médica</span>
        </div>
      </div>
    </div>
  );
}
