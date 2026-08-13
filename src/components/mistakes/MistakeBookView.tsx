import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Trash2, Sparkles, BrainCircuit, Search } from "lucide-react";
import { MistakeItem, Language } from "../../types";

interface MistakeBookViewProps {
  mistakes: MistakeItem[];
  language: Language;
  onToggleMastered: (mistakeId: string) => void;
  onDeleteMistake: (mistakeId: string) => void;
  onAskTutor: (query: string) => void;
}

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  language,
  onToggleMastered,
  onDeleteMistake,
  onAskTutor,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unmastered" | "mastered">("unmastered");

  const filteredMistakes = mistakes.filter((m) => {
    if (filter === "unmastered" && m.mastered) return false;
    if (filter === "mastered" && !m.mastered) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        m.questionText.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {language === "bn" ? "ভুল উত্তর ব্যাংক (Mistake Book)" : "Mistake Book"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {language === "bn"
              ? "পরীক্ষায় যে বিষয়গুলোতে ভুল হয়েছে সেগুলো বারে বারে রিভিশন দিয়ে মাস্টার করুন"
              : "Spaced repetition bank for targeting past test errors and weaknesses"}
          </p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "ভুল উত্তর ব্যাংকে খুঁজুন..."
                : "Search mistakes by question or subject..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>

        <div className="flex border-t border-stone-100 dark:border-stone-800 pt-2 gap-2">
          <button
            onClick={() => setFilter("unmastered")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "unmastered"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
            }`}
          >
            {language === "bn" ? "রিভিশন প্রয়োজন (Unmastered)" : "Needs Review"}
          </button>
          <button
            onClick={() => setFilter("mastered")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "mastered"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
            }`}
          >
            {language === "bn" ? "আয়ত্তে এসেছে (Mastered)" : "Mastered"}
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
            }`}
          >
            {language === "bn" ? "সকল" : "All"}
          </button>
        </div>
      </div>

      {/* List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-xs text-stone-400">
          <AlertCircle className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-700 mb-2" />
          {language === "bn"
            ? "এই তালিকায় কোনো ভুল উত্তর সংরক্ষিত নেই।"
            : "No saved mistakes found in this filter."}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                item.mastered
                  ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/10"
                  : "border-stone-200 dark:border-stone-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400">
                    {item.subject}
                  </span>
                  {item.topic && (
                    <span className="text-[10px] text-stone-400">{item.topic}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleMastered(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      item.mastered
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {item.mastered
                        ? language === "bn"
                          ? "মাস্টার করা সম্পন্ন"
                          : "Mastered"
                        : language === "bn"
                        ? "মাস্টার হিসেবে মার্ক করুন"
                        : "Mark Mastered"}
                    </span>
                  </button>

                  <button
                    onClick={() => onDeleteMistake(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question & Solution Comparison */}
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {item.questionText}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200/80 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
                  <span className="font-bold block text-[10px] uppercase text-rose-600 dark:text-rose-400 mb-1">
                    {language === "bn" ? "আপনার দেওয়া ভুল উত্তর:" : "Your Error Answer:"}
                  </span>
                  <span>{item.userAnswer}</span>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                    {language === "bn" ? "সঠিক উত্তর:" : "Correct Solution:"}
                  </span>
                  <span>{item.correctAnswer}</span>
                </div>
              </div>

              {item.explanation && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-mono">
                  {item.explanation}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() =>
                    onAskTutor(
                      `Please explain this concept step-by-step: Question: ${item.questionText}. Why is '${item.correctAnswer}' the correct answer instead of '${item.userAnswer}'?`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{language === "bn" ? "এআই টিউটর ব্যাখ্যা করুন" : "Ask AI Tutor to Explain"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
