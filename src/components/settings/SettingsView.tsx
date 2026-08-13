import React, { useState } from "react";
import { User, Languages, Trash2, Check, RefreshCw } from "lucide-react";
import { UserProfile, Language } from "../../types";

interface SettingsViewProps {
  user: UserProfile;
  language: Language;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLanguageChange: (lang: Language) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  language,
  onUpdateUser,
  onLanguageChange,
  onResetData,
}) => {
  const [name, setName] = useState(user.name);
  const [grade, setGrade] = useState(user.grade || "HSC / College");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      grade: grade.trim(),
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          {language === "bn" ? "সেটিংস ও প্রোফাইল" : "Settings & Profile"}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          {language === "bn"
            ? "আপনার প্রোফাইল তথ্য, সিস্টেম ভাষা এবং লোকাল ডাটা পরিচালনা করুন"
            : "Manage your student profile, default language, and local data"}
        </p>
      </div>

      {/* User Profile Form */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "শিক্ষার্থীর তথ্য" : "Student Information"}
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "শিক্ষার্থীর নাম" : "Full Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "শ্রেণী / শিক্ষাগত স্তর" : "Class / Grade / Level"}
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., HSC 2026, SSC, College Year 1"
              className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedMsg ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {language === "bn" ? "সেভ সম্পন্ন হয়েছে!" : "Profile saved!"}
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              {language === "bn" ? "প্রোফাইল সেভ করুন" : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Language Preference */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "ইন্টারফেস ভাষা (Language)" : "Interface Language"}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onLanguageChange("bn")}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              language === "bn"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
            }`}
          >
            <div>
              <div className="font-bold text-sm">বাংলা (Bengali)</div>
              <div className="text-[10px] opacity-70">বাংলা ভাষায় ইন্টারফেস ও টিউটর</div>
            </div>
            {language === "bn" && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onLanguageChange("en")}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              language === "en"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs"
                : "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
            }`}
          >
            <div>
              <div className="font-bold text-sm">English</div>
              <div className="text-[10px] opacity-70">English interface & AI explanations</div>
            </div>
            {language === "en" && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "ডাটা ব্যবস্থাপনা" : "Data Management"}
        </h3>

        <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200/80 dark:border-rose-900/60">
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
              {language === "bn" ? "পরীক্ষা ও ডেমো ডাটা রিসেট করুন" : "Reset Application Sample Data"}
            </h4>
            <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-0.5">
              {language === "bn"
                ? "ডিফল্ট নমুনা ডাটা পুনঃস্থাপিত হবে"
                : "Reverts to clean state with default sample exams"}
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm(language === "bn" ? "সকল ডাটা রিসেট করতে নিশ্চিত?" : "Reset all app data?")) {
                onResetData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "রিসেট করুন" : "Reset Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
