import React, { useEffect, useState } from "react";
import { APP_LOGO } from "../auth/AuthPage";

export const LoadingScreen: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#faf8f5] dark:bg-stone-950 flex flex-col items-center justify-center z-50 font-['Hind_Siliguri']">
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          {/* Pulsing rings */}
          <div className="absolute inset-0 bg-amber-200/40 dark:bg-amber-900/40 rounded-full blur-xl animate-ping opacity-75"></div>
          <div className="absolute -inset-4 bg-indigo-200/30 dark:bg-indigo-900/30 rounded-full blur-2xl animate-pulse"></div>
          
          <img
            src={APP_LOGO}
            alt="অধ্যয়ন"
            className="w-20 h-20 relative z-10 drop-shadow-md animate-bounce"
            style={{ animationDuration: "2s" }}
          />
        </div>

        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2">
          অধ্যয়ন
        </h2>
        
        <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
          তোমার স্টাডি ডেটা সাজাচ্ছি{dots}
        </p>

        {/* Progress Bar Track */}
        <div className="w-48 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mt-5 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-[progress_1.5s_ease-in-out_infinite] w-1/2"></div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}} />
    </div>
  );
};
