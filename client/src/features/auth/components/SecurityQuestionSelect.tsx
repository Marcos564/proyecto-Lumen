/*
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
export const SecurityQuestionSelect = ({ value, onChange, options, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1.5 text-left relative">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Pregunta de Seguridad</label>
      <div className="relative">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pl-11 pr-10 py-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 rounded-xl text-slate-800 text-sm font-medium text-left transition-all flex items-center justify-between"
        >
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600/70">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <span className="truncate">{value || "Seleccione una pregunta..."}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl py-1 max-h-48 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center justify-between transition-colors"
              >
                <span>{option}</span>
                {value === option && <Check className="w-4 h-4 text-teal-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
*/
