import React from "react";
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  BrainCircuit, 
  AlertCircle 
} from "lucide-react";
import { ActiveTab } from "./Sidebar";
import { Language } from "../../types";

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const primaryItems: { id: ActiveTab; labelBn: string; labelEn: string; icon: any }[] = [
    { id: "dashboard", labelBn: "হোম", labelEn: "Home", icon: LayoutDashboard },
    { id: "exams", labelBn: "পরীক্ষা", labelEn: "Exams", icon: GraduationCap },
    { id: "study_items", labelBn: "পড়া", labelEn: "Study", icon: BookOpen },
    { id: "practice", labelBn: "টেস্ট", labelEn: "Test", icon: BrainCircuit },
    { id: "mistakes", labelBn: "ভুল উত্তর", labelEn: "Mistakes", icon: AlertCircle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f7f6f2]/95 backdrop-blur-md border-t border-stone-200 border-b-stone-300 px-2 py-2 shadow-md font-['Hind_Siliguri']">
      <div className="grid grid-cols-5 gap-1.5 w-full max-w-lg mx-auto">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`h-12 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer select-none w-full overflow-hidden ${
                isActive
                  ? "bg-stone-900 text-white border border-stone-800 border-b-3 border-b-black shadow-2xs active:translate-y-[1px]"
                  : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 border-b-2 border-b-stone-300 active:translate-y-[1px]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400 scale-105" : "text-stone-500"}`} />
              <span className={`text-[10px] mt-0.5 leading-none truncate max-w-full px-0.5 ${isActive ? "font-bold text-white" : "font-semibold text-stone-700"}`}>
                {language === "bn" ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
