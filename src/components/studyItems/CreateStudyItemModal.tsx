import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { StudyItem, Exam, Language } from "../../types";
import { SubjectSelect } from "../common/SubjectSelect";

interface CreateStudyItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (item: StudyItem) => void;
  onCreate?: (itemData: Omit<StudyItem, "id" | "status" | "createdAt" | "updatedAt" | "userId">) => void;
  exams: Exam[];
  defaultExamId?: string;
  language: Language;
}

export const CreateStudyItemModal: React.FC<CreateStudyItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreate,
  exams,
  defaultExamId,
  language,
}) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("");
  const [type, setType] = useState<StudyItem["type"]>("reading");
  const [priority, setPriority] = useState<StudyItem["priority"]>("normal");
  const [examId, setExamId] = useState<string>(defaultExamId || "");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newStudyItemData = {
      title: title.trim(),
      subject,
      chapter: chapter.trim() || undefined,
      type,
      priority,
      examId: examId || (exams.length > 0 ? exams[0].id : "general"),
      targetDate: targetDate || undefined,
    };

    const fullStudyItem: StudyItem = {
      id: "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userId: "guest",
      status: "not_started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newStudyItemData,
    };

    if (onSave) {
      onSave(fullStudyItem);
    } else if (onCreate) {
      onCreate(newStudyItemData);
    }

    setTitle("");
    setChapter("");
    setTargetDate("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "পড়ার বিষয় / টপিক যুক্ত করুন" : "Add Study Topic"}
      subtitle={
        language === "bn"
          ? "পড়ার জন্য লেকচার, থিওরি, সূত্র বা গাণিতিক সমস্যা তালিকাভুক্ত করুন"
          : "Add theory concepts, math problem sets, or formula topics"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-['Hind_Siliguri']">
        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "টপিকের নাম / শিরোনাম (Topic Title)" : "Topic Title"}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              language === "bn"
                ? "যেমন: নিউটনিয়ান বলবিদ্যা - ভরবেগের সংরক্ষণ সূত্র"
                : "e.g., Conservation of Linear Momentum Proofs"
            }
            className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <SubjectSelect
              label={language === "bn" ? "বিষয় (Subject)" : "Subject"}
              value={subject}
              onChange={setSubject}
              language={language}
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "অধ্যায় (Chapter)" : "Chapter"}
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder={language === "bn" ? "যেমন: অধ্যায় ৪ - কাজ ও শক্তি" : "e.g. Chapter 4"}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "ধরণ (Type)" : "Type"}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="reading">Reading (পড়া)</option>
              <option value="formula">Formula (সূত্র)</option>
              <option value="short_q">Math / Short Q (গাণিতিক)</option>
              <option value="mcq">MCQ Practice</option>
              <option value="creative">Creative / CQ</option>
              <option value="revision">Revision (রিভিশন)</option>
              <option value="practice_set">Practice Set</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "অগ্রাধিকার (Priority)" : "Priority"}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="high">High Priority (জরুরী)</option>
              <option value="urgent">Urgent Priority (খুব জরুরী)</option>
              <option value="normal">Normal Priority (সাধারণ)</option>
              <option value="low">Low Priority (কম গুরুত্বপূর্ণ)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "সংযুক্ত পরীক্ষা (Link Exam)" : "Link Exam"}
            </label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="">{language === "bn" ? "-- কোনো পরীক্ষা সংযুক্ত নেই --" : "-- None --"}</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "টার্গেট তারিখ" : "Target Date"}
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl transition-all cursor-pointer"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-stone-900 hover:bg-black text-white font-bold border border-stone-800 border-b-3 border-b-stone-950 rounded-xl transition-all cursor-pointer active:translate-y-[1px]"
          >
            {language === "bn" ? "টপিক যুক্ত করুন" : "Add Topic"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
