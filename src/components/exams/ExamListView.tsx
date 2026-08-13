import React from "react";
import { GraduationCap, Plus, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Exam, Language } from "../../types";
import { ProgressBar } from "../common/ProgressBar";

interface ExamListViewProps {
  exams: Exam[];
  language: Language;
  onSelectExam: (exam: Exam) => void;
  onOpenCreateModal?: () => void;
  onOpenCreateExam?: () => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamListView: React.FC<ExamListViewProps> = ({
  exams,
  language,
  onSelectExam,
  onOpenCreateModal,
  onOpenCreateExam,
  onDeleteExam,
}) => {
  const handleOpen = onOpenCreateExam || onOpenCreateModal || (() => {});

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 font-['Hind_Siliguri']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{language === "bn" ? "পরীক্ষাসমূহ ও সিলেবাস হাব" : "Exams & Syllabus Hub"}</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === "bn"
              ? "পরীক্ষা সিলেবাস পরিচালনা করুন, সাবজেক্টের চ্যাপ্টার যুক্ত করুন এবং পড়ার অগ্রগতি ট্র্যাক করুন।"
              : "Manage targeted exam syllabi, chapter priorities, and progress timelines."}
          </p>
        </div>

        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{language === "bn" ? "নতুন পরীক্ষা যুক্ত করুন" : "Add Target Exam"}</span>
        </button>
      </div>

      {/* Exam Grid */}
      {exams.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-xs text-stone-400 font-semibold">
            {language === "bn" ? "কোনো পরীক্ষা যুক্ত করা হয়নি।" : "No target exams registered yet."}
          </p>
          <button
            onClick={handleOpen}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
          >
            {language === "bn" ? "নতুন পরীক্ষা যুক্ত করুন" : "Create Target Exam"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((ex) => {
            const daysLeft = Math.ceil(
              (new Date(ex.examDate).getTime() - Date.now()) / (1000 * 3600 * 24)
            );

            return (
              <div
                key={ex.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs hover:border-indigo-500/50 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {ex.subject}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteExam(ex.id);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {ex.title}
                    </h3>
                    {ex.targetBoard && (
                      <p className="text-xs text-stone-400 mt-0.5">{ex.targetBoard}</p>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>{language === "bn" ? "সিলেবাস কভারেজ" : "Syllabus Progress"}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {ex.preparationScore}%
                      </span>
                    </div>
                    <ProgressBar progress={ex.preparationScore} color="indigo" size="sm" />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {ex.examDate}
                      {daysLeft > 0 ? ` (${daysLeft}d left)` : " (Today)"}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectExam(ex)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                  >
                    <span>{language === "bn" ? "সিলেবাস খুলুন" : "Open Workspace"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
