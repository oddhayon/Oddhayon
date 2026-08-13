import React from "react";

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  quickPresets?: number[];
  language?: "bn" | "en";
  icon?: React.ReactNode;
  subtitle?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  quickPresets,
  language = "bn",
  icon,
  subtitle,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2 p-3.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 rounded-2xl transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-stone-500 dark:text-stone-400">{icon}</span>}
          <div>
            <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
              {label}
            </span>
            {subtitle && (
              <span className="block text-[11px] text-stone-500 dark:text-stone-400">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xs font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
          <span>{value}</span>
          {unit && <span className="text-[10px] text-stone-400 font-sans">{unit}</span>}
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative pt-2 pb-1 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percentage}%, #e7e5e4 ${percentage}%, #e7e5e4 100%)`,
          }}
        />
      </div>

      {/* Ticks and Min/Max labels */}
      <div className="flex items-center justify-between text-[10px] text-stone-400 font-semibold px-0.5">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>

      {/* Quick Presets */}
      {quickPresets && quickPresets.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[10px] text-stone-400 font-bold">
            {language === "bn" ? "দ্রুত সিলেক্ট:" : "Presets:"}
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {quickPresets.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => onChange(preset)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  value === preset
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {preset} {unit}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
