import React from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Upload, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  BrainCircuit,
  Flame,
  Calendar,
  Globe
} from "lucide-react";
import { UserProfile, Exam, StudyItem, Language } from "../../types";
import { ProgressBar } from "../common/ProgressBar";
import { ActiveTab } from "../layout/Sidebar";

interface DashboardViewProps {
  user: UserProfile;
  exams: Exam[];
  todayTasks: StudyItem[];
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onOpenStreakCalendar?: () => void;
  onSelectExam: (exam: Exam) => void;
  onOpenCreateExam: () => void;
  onOpenAddStudyItem: () => void;
  onOpenUploadMaterial: () => void;
  onOpenGenerateTest: () => void;
  onToggleTaskStatus: (item: StudyItem) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  exams,
  todayTasks,
  language,
  onLanguageChange,
  onOpenStreakCalendar,
  onSelectExam,
  onOpenCreateExam,
  onOpenAddStudyItem,
  onOpenUploadMaterial,
  onOpenGenerateTest,
  onToggleTaskStatus,
  onNavigateTab,
}) => {
  const completedTasks = todayTasks.filter(
    (t) => t.status === "completed" || t.status === "mastered"
  ).length;

  const streakCount = user.streakCount || 1;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300 font-['Hind_Siliguri']">
      {/* 2 Compact Half-Width Banners ABOVE the Welcome Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Banner 1: Streak & Calendar Banner */}
        <div className="bg-amber-500/10 border border-amber-400/40 border-b-3 border-b-amber-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs">
              <Flame className="w-5 h-5 fill-stone-950 text-stone-950" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-stone-900">
                {streakCount} {language === "bn" ? "দিনের অধ্যয়ন স্ট্রিক!" : "Day Study Streak!"}
              </p>
              <p className="text-[11px] text-stone-600 font-medium">
                {language === "bn" ? "ধারাবাহিকতায় পড়াশোনায় নিশ্চিত সাফল্য" : "Consistency builds mastery daily"}
              </p>
            </div>
          </div>
          {onOpenStreakCalendar && (
            <button
              onClick={onOpenStreakCalendar}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold border border-amber-500 border-b-2 border-b-amber-700 rounded-xl text-[11px] transition-all cursor-pointer shrink-0 active:translate-y-[1px]"
            >
              {language === "bn" ? "ক্যালেন্ডার" : "Calendar"}
            </button>
          )}
        </div>

        {/* Banner 2: Target Exam & Progress Quick Banner */}
        <div className="bg-indigo-500/10 border border-indigo-400/40 border-b-3 border-b-indigo-500/60 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 border border-indigo-500 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-stone-900">
                {language === "bn" ? "লক্ষ্য: " : "Target: "} {user.targetExam || "HSC Board Exam"}
              </p>
              <p className="text-[11px] text-stone-600 font-medium">
                {language === "bn" ? `আজকের টাস্ক: ${completedTasks}/${todayTasks.length} সম্পন্ন` : `Tasks: ${completedTasks}/${todayTasks.length} done`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("exams")}
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold border border-indigo-700 border-b-2 border-b-indigo-900 rounded-xl text-[11px] transition-all cursor-pointer shrink-0 active:translate-y-[1px]"
          >
            {language === "bn" ? "পরীক্ষা সমূহ" : "View Exams"}
          </button>
        </div>
      </div>

      {/* Welcome Banner - Minimal & Compact */}
      <div className="bg-stone-900 text-white border border-stone-800 border-b-3 border-b-stone-950 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                {language === "bn"
                  ? `স্বাগতম, ${user.name}!`
                  : `Welcome, ${user.name}!`}
              </h1>
              {onLanguageChange && (
                <button
                  onClick={() => onLanguageChange(language === "bn" ? "en" : "bn")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-700 border-b-2 border-b-stone-950 rounded-xl text-xs font-bold text-amber-300 transition-all cursor-pointer active:translate-y-[1px]"
                  title="Toggle Language (বাংলা / English)"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === "bn" ? "English" : "বাংলা"}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {language === "bn"
                ? "পরীক্ষার প্রস্তুতি ও অধ্যয়ন ট্র্যাক পরিচালনা করো"
                : "Manage your exam preparations and daily learning goals"}
            </p>
          </div>

          {/* Quick Action Grid - Minimal Compact Buttons with Subtle Gradients */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddStudyItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-white to-stone-100 hover:from-stone-50 hover:to-stone-200 text-stone-900 font-bold border border-stone-200 border-b-3 border-b-stone-300 active:translate-y-[1px] rounded-xl text-xs transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === "bn" ? "নতুন পড়ার টপিক" : "Add Task"}</span>
            </button>

            <button
              onClick={onOpenUploadMaterial}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold border border-indigo-700 border-b-3 border-b-indigo-900 active:translate-y-[1px] rounded-xl text-xs transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === "bn" ? "ছবি আপলোড" : "Upload OCR"}</span>
            </button>

            <button
              onClick={onOpenGenerateTest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold border border-amber-500 border-b-3 border-b-amber-700 active:translate-y-[1px] rounded-xl text-xs transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === "bn" ? "এআই টেস্ট" : "AI Quiz"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Exams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              {language === "bn" ? "তোমার নিবন্ধিত পরীক্ষাসমূহ" : "Your Active Exams"}
            </h2>
            <p className="text-xs text-stone-500">
              {language === "bn" ? "ওয়ার্কস্পেসে ঢুকতে পরীক্ষার কার্ডে ক্লিক করো" : "Click exam card to open dedicated syllabus workspace"}
            </p>
          </div>

          <button
            onClick={onOpenCreateExam}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-800 font-bold border border-stone-200 border-b-3 border-b-stone-300 active:translate-y-[1px] active:border-b-2 rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-stone-600" />
            <span>{language === "bn" ? "পরীক্ষা যোগ করো" : "Add Exam"}</span>
          </button>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white border border-stone-200 border-b-4 border-b-stone-300 rounded-2xl p-8 text-center text-xs text-stone-500 shadow-2xs">
            {language === "bn" ? "কোনো পরীক্ষা যুক্ত করা হয়নি।" : "No active exams set up yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map((ex) => {
              const daysLeft = Math.ceil(
                (new Date(ex.examDate).getTime() - Date.now()) / (1000 * 3600 * 24)
              );

              return (
                <div
                  key={ex.id}
                  onClick={() => onSelectExam(ex)}
                  className="bg-white border border-stone-200 border-b-5 border-b-stone-300 hover:border-stone-300 active:translate-y-[2px] active:border-b-2 rounded-2xl p-5 shadow-2xs transition-all cursor-pointer space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-200">
                        {ex.subject}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-2 group-hover:text-stone-700 transition-colors">
                        {ex.title}
                      </h3>
                    </div>

                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 border-b-2 border-b-amber-300 shrink-0">
                      {daysLeft > 0
                        ? `${daysLeft} ${language === "bn" ? "দিন বাকি" : "days left"}`
                        : language === "bn"
                        ? "আজ পরীক্ষা"
                        : "Today"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-stone-500">
                      <span>{language === "bn" ? "প্রস্তুতি সূচক" : "Preparation Index"}</span>
                      <span className="font-bold text-stone-900">
                        {ex.preparationScore}%
                      </span>
                    </div>
                    <ProgressBar progress={ex.preparationScore} color="indigo" size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {ex.examDate}
                    </span>
                    <span className="font-bold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {language === "bn" ? "খোলা যাক" : "Workspace"}
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Tasks & Study List */}
      <div className="bg-white border border-stone-200 border-b-5 border-b-stone-300/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              {language === "bn" ? "আজকের পড়ার টাস্কসমূহ" : "Today's Study Checklist"}
            </h2>
            <p className="text-xs text-stone-500">
              {completedTasks} of {todayTasks.length} {language === "bn" ? "টাস্ক সম্পন্ন হয়েছে" : "tasks completed"}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("study_items")}
            className="text-xs font-bold text-stone-900 hover:text-black flex items-center gap-1 py-1 px-3 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 border-b-2 border-b-stone-300 transition-all cursor-pointer"
          >
            <span>{language === "bn" ? "সবগুলো দেখো" : "View All"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-xs text-stone-400 text-center py-6 font-medium">
            {language === "bn" ? "কোনো পড়ার টপিক নেই। 'নতুন পড়ার টপিক' বাটনে ক্লিক করে যুক্ত করো।" : "No study items scheduled."}
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.slice(0, 5).map((task) => {
              const isDone = task.status === "completed" || task.status === "mastered";

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border border-stone-200 border-b-3 transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? "bg-stone-50/80 border-b-stone-200 opacity-70"
                      : "bg-white border-b-stone-300 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTaskStatus(task)}
                      className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer active:translate-y-[1px] ${
                        isDone
                          ? "bg-emerald-600 border-emerald-700 border-b-3 border-b-emerald-800 text-white"
                          : "bg-white border-stone-300 border-b-3 border-b-stone-400 hover:border-stone-400"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-bold text-stone-900 ${
                          isDone ? "line-through text-stone-400" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.chapter && (
                        <p className="text-[10px] text-stone-500 font-medium">{task.chapter}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 border-b-2 border-b-stone-300 text-stone-700 shrink-0">
                    {task.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
