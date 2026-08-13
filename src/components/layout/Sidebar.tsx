import React from "react";
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  BrainCircuit, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  Plus,
  User
} from "lucide-react";
import { Language } from "../../types";

export type ActiveTab = 
  | "dashboard"
  | "exams"
  | "study_items"
  | "materials"
  | "practice"
  | "mistakes"
  | "analytics"
  | "profile"
  | "settings";

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
  onQuickAddStudyItem: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  language,
  onQuickAddStudyItem,
}) => {
  const navItems: { id: ActiveTab; labelBn: string; labelEn: string; icon: any }[] = [
    {
      id: "dashboard",
      labelBn: "ড্যাশবোর্ড",
      labelEn: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "exams",
      labelBn: "পরীক্ষাসমূহ",
      labelEn: "Exams",
      icon: GraduationCap,
    },
    {
      id: "study_items",
      labelBn: "পড়ার তালিকা",
      labelEn: "Study List",
      icon: BookOpen,
    },
    {
      id: "materials",
      labelBn: "লেকচার ও নোট",
      labelEn: "Notes & Material",
      icon: FileText,
    },
    {
      id: "practice",
      labelBn: "অনুশীলন ও টেস্ট",
      labelEn: "Practice Engine",
      icon: BrainCircuit,
    },
    {
      id: "mistakes",
      labelBn: "ভুল উত্তর ব্যাংক",
      labelEn: "Mistake Book",
      icon: AlertCircle,
    },
    {
      id: "analytics",
      labelBn: "অগ্রগতি বিশ্লেষণ",
      labelEn: "Analytics",
      icon: BarChart3,
    },
    {
      id: "profile",
      labelBn: "আমার প্রফাইল",
      labelEn: "My Profile",
      icon: User,
    },
    {
      id: "settings",
      labelBn: "সেটিংস",
      labelEn: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-stone-200/80 bg-[#f7f6f2] p-4 space-y-6 shrink-0 transition-colors font-['Hind_Siliguri']">
      {/* Quick Action Button - Tactile 3D */}
      <button
        onClick={onQuickAddStudyItem}
        className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-white font-bold border border-stone-800 border-b-4 border-b-stone-950 active:translate-y-[2px] active:border-b-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 text-amber-400" />
        <span>{language === "bn" ? "পড়ার বিষয় যুক্ত করুন" : "Add Study Item"}</span>
      </button>

      {/* Nav Menu */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-stone-900 text-white border border-stone-800 border-b-3 border-b-black shadow-2xs active:translate-y-[1px]"
                  : "bg-white/80 hover:bg-white text-stone-700 border border-stone-200/80 border-b-2 border-b-stone-300/80 active:translate-y-[1px]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-stone-500"}`} />
              <span>{language === "bn" ? item.labelBn : item.labelEn}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="pt-4 border-t border-stone-200/80 text-[10px] text-stone-400 space-y-1">
        <p className="font-semibold text-stone-600">অধ্যয়ন AI v1.0</p>
        <p>{language === "bn" ? "স্মার্ট এআই অধ্যয়ন ও পরীক্ষা" : "Smart AI Study & Exam System"}</p>
      </div>
    </aside>
  );
};
