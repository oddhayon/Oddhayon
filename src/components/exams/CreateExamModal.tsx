import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Exam, Language } from "../../types";
import { Plus, ListPlus } from "lucide-react";
import { SubjectSelect } from "../common/SubjectSelect";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (exam: Exam) => void;
  onCreate?: (examData: Omit<Exam, "id" | "preparationScore" | "createdAt" | "updatedAt" | "userId">) => void;
  language: Language;
}

export const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreate,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Single form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [examDate, setExamDate] = useState("");
  const [targetBoard, setTargetBoard] = useState("");

  // Bulk form states
  const [bulkRawText, setBulkRawText] = useState("");
  const [bulkSubject, setBulkSubject] = useState("Physics");
  const [bulkExamDate, setBulkExamDate] = useState("");
  const [bulkTargetBoard, setBulkTargetBoard] = useState("");

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !examDate) return;

    const newExamData = {
      title: title.trim(),
      subject,
      examDate,
      targetBoard: targetBoard.trim() || undefined,
    };

    const fullExam: Exam = {
      id: "exam_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      userId: "guest",
      preparationScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newExamData,
    };

    if (onSave) {
      onSave(fullExam);
    } else if (onCreate) {
      onCreate(newExamData);
    }

    setTitle("");
    setSubject("Physics");
    setExamDate("");
    setTargetBoard("");
    onClose();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkRawText.trim() || !bulkExamDate) return;

    const lines = bulkRawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    lines.forEach((lineTitle, idx) => {
      const newExamData = {
        title: lineTitle,
        subject: bulkSubject,
        examDate: bulkExamDate,
        targetBoard: bulkTargetBoard.trim() || undefined,
      };

      const fullExam: Exam = {
        id: "exam_" + Date.now() + "_" + idx + "_" + Math.random().toString(36).substring(2, 6),
        userId: "guest",
        preparationScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...newExamData,
      };

      if (onSave) {
        onSave(fullExam);
      } else if (onCreate) {
        onCreate(newExamData);
      }
    });

    setBulkRawText("");
    setBulkExamDate("");
    setBulkTargetBoard("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "নতুন পরীক্ষা যুক্ত করুন" : "Add Target Exam"}
      subtitle={
        language === "bn"
          ? "আপনার আসন্ন পরীক্ষার বিষয় এবং তারিখ সেট করুন (একক বা একসাথে একাধিক)"
          : "Define single or multiple upcoming target exams"
      }
    >
      <div className="space-y-4 text-xs font-['Hind_Siliguri']">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "single"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "bn" ? "একটি পরীক্ষা" : "Single Exam"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "bulk"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            }`}
          >
            <ListPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === "bn" ? "একসাথে একাধিক পরীক্ষা" : "Bulk Exams"}</span>
          </button>
        </div>

        {activeTab === "single" ? (
          /* Single Exam Form */
          <form onSubmit={handleSingleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === "bn" ? "পরীক্ষার নাম (Exam Title)" : "Exam Title"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "যেমন: HSC Physics 1st Paper Final"
                    : "e.g., HSC Physics Final Exam 2026"
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
                  {language === "bn" ? "পরীক্ষার তারিখ" : "Exam Date"}
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === "bn" ? "বোর্ড/প্রতিষ্ঠান (ঐচ্ছিক)" : "Target Board/Institute (Optional)"}
              </label>
              <input
                type="text"
                value={targetBoard}
                onChange={(e) => setTargetBoard(e.target.value)}
                placeholder={
                  language === "bn" ? "যেমন: ঢাকা বোর্ড / BUET Admission" : "e.g., Dhaka Board / BUET"
                }
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
              />
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
                {language === "bn" ? "সংরক্ষণ করুন" : "Create Exam"}
              </button>
            </div>
          </form>
        ) : (
          /* Bulk Exams Form */
          <form onSubmit={handleBulkSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <SubjectSelect
                  label={language === "bn" ? "বিষয় (Subject)" : "Subject"}
                  value={bulkSubject}
                  onChange={setBulkSubject}
                  language={language}
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {language === "bn" ? "পরীক্ষার তারিখ" : "Exam Date"}
                </label>
                <input
                  type="date"
                  required
                  value={bulkExamDate}
                  onChange={(e) => setBulkExamDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === "bn" ? "পরীক্ষার নামসমূহ (প্রতি লাইনে একটি)" : "Exam Titles (One per line)"}
              </label>
              <textarea
                rows={5}
                required
                value={bulkRawText}
                onChange={(e) => setBulkRawText(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "Physics 1st Paper Model Test 1\nPhysics 1st Paper Model Test 2\nPhysics Chapterwise Final Board Exam"
                    : "Physics 1st Paper Model Test 1\nPhysics 1st Paper Model Test 2\nPhysics Final Board Test"
                }
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-mono text-xs text-stone-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                {language === "bn" ? "বোর্ড/প্রতিষ্ঠান (ঐচ্ছিক)" : "Board/Institute (Optional)"}
              </label>
              <input
                type="text"
                value={bulkTargetBoard}
                onChange={(e) => setBulkTargetBoard(e.target.value)}
                placeholder={language === "bn" ? "যেমন: ঢাকা বোর্ড" : "e.g., Dhaka Board"}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none"
              />
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
                {language === "bn" ? "একসাথে যুক্ত করুন" : "Bulk Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
