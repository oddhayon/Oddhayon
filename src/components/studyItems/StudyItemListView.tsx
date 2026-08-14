import React, { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  ListPlus, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Calendar 
} from "lucide-react";
import { StudyItem, Exam, Language } from "../../types";
import { getAllSubjects } from "../../utils/subjectUtils";

interface StudyItemListViewProps {
  studyItems: StudyItem[];
  exams: Exam[];
  language: Language;
  onToggleStatus: (item: StudyItem) => void;
  onOpenCreateModal?: () => void;
  onOpenAddStudyItem?: () => void;
  onOpenBulkCreateModal?: () => void;
  onOpenBulkCreate?: () => void;
  onDeleteStudyItem: (itemId: string) => void;
}

export const StudyItemListView: React.FC<StudyItemListViewProps> = ({
  studyItems,
  exams,
  language,
  onToggleStatus,
  onOpenCreateModal,
  onOpenAddStudyItem,
  onOpenBulkCreateModal,
  onOpenBulkCreate,
  onDeleteStudyItem,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleOpenSingle = onOpenAddStudyItem || onOpenCreateModal || (() => {});
  const handleOpenBulk = onOpenBulkCreate || onOpenBulkCreateModal || (() => {});

  const filteredItems = studyItems.filter((item) => {
    if (selectedSubject !== "all" && item.subject !== selectedSubject) return false;
    if (selectedType !== "all" && item.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 font-['Hind_Siliguri']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === "bn" ? "পড়ার বিষয় ও সিলেবাস তালিকা" : "Study Items & Master Checklist"}</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === "bn"
              ? "লেকচার টপিক, সূত্র রিভিশন ও প্র্যাকটিস কাজের তালিকা যুক্ত ও সম্পন্ন চিহ্নিত করো।"
              : "Organize theory topics, math formulas, and revision queues with priority tags."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenBulk}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98"
          >
            <ListPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === "bn" ? "একসাথে একাধিক যুক্ত করো" : "Bulk Import"}</span>
          </button>

          <button
            onClick={handleOpenSingle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{language === "bn" ? "টপিক যোগ করো" : "Add Topic"}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-stone-500 font-bold">
            <Filter className="w-4 h-4" />
            <span>{language === "bn" ? "বিষয় অনুযায়ী ফিল্টার করো:" : "Filter by Subject:"}</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">{language === "bn" ? "সকল ধরণ (All Types)" : "All Types"}</option>
              <option value="theory">Theory (তত্ত্ব)</option>
              <option value="formula">Formula (সূত্র)</option>
              <option value="math_problem">Math Problem (গাণিতিক সমস্যা)</option>
              <option value="mcq">MCQ Practice</option>
              <option value="cq">CQ Creative</option>
            </select>
          </div>
        </div>

        {/* Horizontal Subject Filter Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`px-3 py-1.5 rounded-xl font-bold border text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedSubject === "all"
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 dark:border-white shadow-2xs"
                : "bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100"
            }`}
          >
            {language === "bn" ? "সকল বিষয় (All)" : "All Subjects"}
          </button>

          {Array.from(new Set([...getAllSubjects(), ...studyItems.map((i) => i.subject).filter(Boolean)])).map((sub) => {
            const isSel = selectedSubject === sub;
            return (
              <button
                type="button"
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl font-bold border text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSel
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-xs text-stone-400 space-y-3">
          <p className="font-semibold">
            {language === "bn" ? "কোনো পড়ার বিষয় পাওয়া যায়নি।" : "No study items found."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleOpenSingle}
              className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {language === "bn" ? "নতুন টপিক যোগ করো" : "Add Topic"}
            </button>
            <button
              onClick={handleOpenBulk}
              className="px-4 py-2 bg-stone-100 text-stone-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              {language === "bn" ? "একসাথে একাধিক যুক্ত করো" : "Bulk Import"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isDone = item.status === "completed" || item.status === "mastered";
            const linkedExam = exams.find((e) => e.id === item.examId);

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-stone-900 border rounded-2xl p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? "border-stone-200/60 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 opacity-70"
                    : "border-stone-200 dark:border-stone-800 hover:border-emerald-500/50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleStatus(item)}
                    className={`w-6 h-6 rounded-xl border mt-0.5 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      isDone
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-stone-300 dark:border-stone-600 hover:border-emerald-500"
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold text-stone-900 dark:text-stone-100 ${
                          isDone ? "line-through text-stone-400 dark:text-stone-500" : ""
                        }`}
                      >
                        {item.title}
                      </h3>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {item.type}
                      </span>

                      {item.priority && (
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.priority === "high"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : item.priority === "medium"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      )}
                    </div>

                    {item.chapter && (
                      <p className="text-xs text-stone-500">
                        {item.subject} • {item.chapter}
                      </p>
                    )}

                    {linkedExam && (
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                        Linked Exam: {linkedExam.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  {item.targetDate && (
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.targetDate}
                    </span>
                  )}

                  <button
                    onClick={() => onDeleteStudyItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
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
