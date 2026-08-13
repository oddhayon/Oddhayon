import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  Globe, 
  User, 
  BookOpen, 
  GraduationCap, 
  FileText,
  LogOut,
  Flame
} from "lucide-react";
import { UserProfile, Language, Exam, StudyItem, Material } from "../../types";
import { APP_LOGO } from "../auth/AuthPage";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

interface NavbarProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenTutor: () => void;
  onOpenProfile?: () => void;
  onOpenStreakCalendar?: () => void;
  globalSearchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: {
    exams: Exam[];
    studyItems: StudyItem[];
    materials: Material[];
  };
  onSelectSearchResult: (type: "exam" | "studyItem" | "material", item: any) => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenTutor,
  onOpenProfile,
  onOpenStreakCalendar,
  globalSearchQuery,
  onSearchChange,
  searchResults,
  onSelectSearchResult,
  onSignOut,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const hasResults =
    searchResults.exams.length > 0 ||
    searchResults.studyItems.length > 0 ||
    searchResults.materials.length > 0;

  const streakCount = user.streakCount || 1;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onSignOut) onSignOut();
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f7f6f2]/95 backdrop-blur-md border-b border-stone-200 border-b-stone-300/80 h-16 transition-colors font-['Hind_Siliguri']">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
        {/* Left Corner: Streak Counter */}
        <div className="flex items-center justify-start gap-2">
          <button
            onClick={onOpenStreakCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 border-b-3 border-b-amber-400 active:translate-y-[1px] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title={language === "bn" ? "স্ট্রিক ক্যালেন্ডার দেখুন" : "View Streak Calendar"}
          >
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
            <span className="font-extrabold">{streakCount} {language === "bn" ? "দিন" : "Days"}</span>
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={() => onLanguageChange(language === "bn" ? "en" : "bn")}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 border-b-3 border-b-stone-300 active:translate-y-[1px] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Toggle Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>{language === "bn" ? "বাং" : "EN"}</span>
          </button>
        </div>

        {/* Center: Logo Only */}
        <div className="flex items-center justify-center">
          <img
            src={APP_LOGO}
            alt="অধ্যয়ন"
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
          />
        </div>

        {/* Right Corner: AI Tutor & Profile Icon */}
        <div className="flex items-center justify-end gap-2">
          {/* AI Tutor Launcher Button */}
          <button
            onClick={onOpenTutor}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-black text-white border border-stone-800 border-b-3 border-b-stone-950 active:translate-y-[1px] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === "bn" ? "এআই টিউটর" : "AI Tutor"}</span>
          </button>

          {/* Profile Badge & Sign Out */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 border-b-3 border-b-stone-300 text-stone-800 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer active:translate-y-[1px] transition-all overflow-hidden"
              title={language === "bn" ? "প্রফাইল দেখুন" : "View Profile"}
            >
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4.5 h-4.5 text-stone-700" />
              )}
            </button>
            <button
              onClick={handleLogout}
              title={language === "bn" ? "সাইন আউট করুন" : "Sign Out"}
              className="p-2 bg-white hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-200 border-b-2 border-b-stone-300 rounded-xl transition-all shadow-2xs cursor-pointer active:translate-y-[1px]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

