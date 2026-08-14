import React, { useState } from "react";
import { Flame, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Award, Sparkles } from "lucide-react";
import { Language } from "../../types";

interface StreakCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  language: Language;
}

export const StreakCalendarModal: React.FC<StreakCalendarModalProps> = ({
  isOpen,
  onClose,
  streakCount,
  language,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeekBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্রবার", "শনি"];
  const daysOfWeekEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Active study days logic (simulation based on streakCount up to today)
  const today = new Date().getDate();
  const activeDaysSet = new Set<number>();
  for (let i = 0; i < Math.min(streakCount, 30); i++) {
    const dayNum = today - i;
    if (dayNum > 0) {
      activeDaysSet.add(dayNum);
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 font-['Hind_Siliguri'] animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 border-b-6 border-b-stone-300 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 border border-amber-600 border-b-3 border-b-amber-700 flex items-center justify-center font-black shadow-2xs">
              <Flame className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-stone-900 leading-tight">
                {language === "bn" ? "স্ট্রিক ক্যালেন্ডার" : "Streak Calendar"}
              </h2>
              <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <span>{streakCount} {language === "bn" ? "দিনের টানা অধ্যয়ন স্ট্রিক!" : "Day Active Streak!"}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2 text-xs font-bold text-stone-800">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white text-stone-600 hover:text-stone-900 rounded-lg transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            {language === "bn" ? monthNamesBn[month] : monthNamesEn[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-white text-stone-600 hover:text-stone-900 rounded-lg transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-stone-400">
            {(language === "bn" ? daysOfWeekBn : daysOfWeekEn).map((day, idx) => (
              <div key={idx} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5 text-xs font-bold">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-9" />
            ))}

            {/* Day Numbers */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isActiveDay = activeDaysSet.has(dayNum);
              const isToday = dayNum === today && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div
                  key={dayNum}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    isActiveDay
                      ? "bg-amber-400 text-stone-950 border border-amber-300 border-b-3 border-b-amber-600 shadow-2xs font-black"
                      : isToday
                      ? "bg-stone-900 text-white border border-stone-800 border-b-2 border-b-black font-extrabold"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 font-medium"
                  }`}
                >
                  <span>{dayNum}</span>
                  {isActiveDay && (
                    <Flame className="w-2.5 h-2.5 fill-stone-950 text-stone-950 -mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Stats Footer */}
        <div className="bg-amber-50/70 border border-amber-200 border-b-3 border-b-amber-300 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-stone-900">
                {language === "bn" ? "স্ট্রিক ধরে রাখুন" : "Keep the Streak Alive!"}
              </p>
              <p className="text-[11px] text-stone-600">
                {language === "bn" ? "প্রতিদিন অন্তত ১টি টপিক শেষ করো" : "Complete at least 1 task daily"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-amber-700 block">{activeDaysSet.size}</span>
            <span className="text-[10px] font-bold text-stone-500">{language === "bn" ? "সক্রিয় দিন" : "Active Days"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
