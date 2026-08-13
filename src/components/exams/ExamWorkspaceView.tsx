import React, { useState } from "react";
import { 
  ArrowLeft, 
  GraduationCap, 
  Plus, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  Sparkles
} from "lucide-react";
import { Exam, StudyItem, Material, Language } from "../../types";

export type ChapterStatus = "not_started" | "in_progress" | "mastered";
import { ProgressBar } from "../common/ProgressBar";

interface ExamWorkspaceViewProps {
  exam: Exam;
  studyItems: StudyItem[];
  materials: Material[];
  language: Language;
  onBack: () => void;
  onAddChapter: (chapName: string) => void;
  onUpdateChapterStatus: (chapName: string, status: ChapterStatus) => void;
  onOpenAddStudyItem: () => void;
  onOpenUploadMaterial: () => void;
}

export const ExamWorkspaceView: React.FC<ExamWorkspaceViewProps> = ({
  exam,
  studyItems,
  materials,
  language,
  onBack,
  onAddChapter,
  onUpdateChapterStatus,
  onOpenAddStudyItem,
  onOpenUploadMaterial,
}) => {
  const [newChapterInput, setNewChapterInput] = useState("");

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterInput.trim()) return;
    onAddChapter(newChapterInput.trim());
    setNewChapterInput("");
  };

  const daysLeft = Math.ceil(
    (new Date(exam.examDate).getTime() - Date.now()) / (1000 * 3600 * 24)
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors text-stone-700 dark:text-stone-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {exam.subject} • {exam.targetBoard || "General Board"}
          </span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {exam.title}
          </h1>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
            <span>{language === "bn" ? "প্রস্তুতি সূচক" : "Overall Preparation"}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              {exam.preparationScore}%
            </span>
          </div>
          <ProgressBar progress={exam.preparationScore} color="indigo" size="md" />
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-bold block">
              {language === "bn" ? "পরীক্ষার কাউন্টডাউন" : "Exam Countdown"}
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 block">
              {daysLeft > 0 ? `${daysLeft} ${language === "bn" ? "দিন বাকি" : "Days Left"}` : "Exam Day!"}
            </span>
          </div>
          <Calendar className="w-8 h-8 text-indigo-500/40" />
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-bold block">
              {language === "bn" ? "চ্যাপ্টার সংখ্যা" : "Syllabus Chapters"}
            </span>
            <span className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1 block">
              {exam.chapters ? exam.chapters.length : 0} {language === "bn" ? "টি চ্যাপ্টার" : "Chapters"}
            </span>
          </div>
          <BookOpen className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

      {/* Chapters Syllabus Management */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {language === "bn" ? "চ্যাপ্টার অনুযায়ী কভারেজ ট্র্যাকার" : "Chapter-wise Syllabus Tracker"}
            </h2>
            <p className="text-xs text-stone-500">
              {language === "bn" ? "প্রতিটি অধ্যায়ের স্ট্যাটাস আপডেট করুন (Not Started -> In Progress -> Mastered)" : "Track status from Not Started to Revision Mastered"}
            </p>
          </div>

          <form onSubmit={handleAddChapterSubmit} className="flex gap-2">
            <input
              type="text"
              value={newChapterInput}
              onChange={(e) => setNewChapterInput(e.target.value)}
              placeholder={language === "bn" ? "নতুন অধ্যায়ের নাম..." : "New chapter name..."}
              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold rounded-xl text-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {(!exam.chapters || exam.chapters.length === 0) ? (
          <div className="text-xs text-stone-400 text-center py-6">
            {language === "bn" ? "কোনো চ্যাপ্টার যুক্ত করা হয়নি।" : "No chapters defined for this syllabus yet."}
          </div>
        ) : (
          <div className="space-y-2.5">
            {exam.chapters.map((chap, idx) => {
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {chap.name}
                    </h4>
                    {chap.weightage && (
                      <span className="text-[10px] text-stone-400">
                        {language === "bn" ? `সম্ভাব্য নম্বর weightage: ${chap.weightage}%` : `Weightage: ${chap.weightage}%`}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateChapterStatus(chap.name, "not_started")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chap.status === "not_started"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-stone-200/60 dark:bg-stone-800 text-stone-500"
                      }`}
                    >
                      {language === "bn" ? "শুরু হয়নি" : "Not Started"}
                    </button>

                    <button
                      onClick={() => onUpdateChapterStatus(chap.name, "in_progress")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chap.status === "in_progress"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-stone-200/60 dark:bg-stone-800 text-stone-500"
                      }`}
                    >
                      {language === "bn" ? "চলমান" : "In Progress"}
                    </button>

                    <button
                      onClick={() => onUpdateChapterStatus(chap.name, "mastered")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chap.status === "mastered"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-stone-200/60 dark:bg-stone-800 text-stone-500"
                      }`}
                    >
                      {language === "bn" ? "আয়ত্তে এসেছে" : "Mastered"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Linked Study Items & Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Linked Study Tasks */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>{language === "bn" ? "সংযুক্ত পড়ার বিষয়" : "Linked Study Tasks"}</span>
            </h3>

            <button
              onClick={onOpenAddStudyItem}
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {studyItems.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              {language === "bn" ? "এই পরীক্ষার সঙ্গে সংযুক্ত কোনো পড়ার বিষয় নেই।" : "No study tasks linked to this exam."}
            </p>
          ) : (
            <div className="space-y-2">
              {studyItems.map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-stone-800 dark:text-stone-200">{st.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    {st.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Linked OCR / Materials */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>{language === "bn" ? "সংযুক্ত লেকচার ও OCR নোট" : "Linked Material & OCR"}</span>
            </h3>

            <button
              onClick={onOpenUploadMaterial}
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {materials.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              {language === "bn" ? "কোনো লেকচার বা নোট যুক্ত করা নেই।" : "No OCR notes linked to this exam."}
            </p>
          ) : (
            <div className="space-y-2">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200 block">{m.title}</span>
                    <span className="text-[10px] text-stone-400">
                      {m.extractedFormulas.length} {language === "bn" ? "টি ফর্মুলা বের করা হয়েছে" : "formulas extracted"}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    OCR Analyzed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
