import { Lock } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Design Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative Paw Print Motif (Translucent Watermark) */}
      <div className="absolute right-10 top-10 opacity-[0.03] text-teal-900 pointer-events-none">
        <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* Lumen Brand Logo Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
            {/* Custom Paw / Medical Cross Icon */}
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M4.5 10c1.38 0 2.5-1.12 2.5-2.5S5.88 5 4.5 5 2 6.12 2 7.5 3.12 10 4.5 10zm15 0c1.38 0 2.5-1.12 2.5-2.5S20.88 5 19.5 5 17 6.12 17 7.5s1.12 2.5 2.5 2.5zm-11.5 2c1.38 0 2.5-1.12 2.5-2.5S9.38 7 8 7s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm8 0c1.38 0 2.5-1.12 2.5-2.5S17.38 7 16 7s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm-4 2c-3.04 0-5.5 2.46-5.5 5.5 0 1.25.42 2.4 1.13 3.32.3.39.81.68 1.3.68h6.14c.49 0 1-.29 1.3-.68.71-.92 1.13-2.07 1.13-3.32 0-3.04-2.46-5.5-5.5-5.5z"/>
            </svg>
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
