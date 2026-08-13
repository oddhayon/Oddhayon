import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { StudyItem, Exam, Language, StudyItemType, Priority } from "../../types";
import { SubjectSelect } from "../common/SubjectSelect";

interface BulkCreateStudyItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBulk?: (items: StudyItem[]) => void;
  onBulkCreate?: (items: Omit<StudyItem, "id" | "status" | "createdAt" | "updatedAt" | "userId">[]) => void;
  exams: Exam[];
  defaultExamId?: string;
  language: Language;
}

export const BulkCreateStudyItemModal: React.FC<BulkCreateStudyItemModalProps> = ({
  isOpen,
  onClose,
  onSaveBulk,
  onBulkCreate,
  exams,
  defaultExamId,
  language,
}) => {
  const [rawText, setRawText] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("");
  const [type, setType] = useState<StudyItemType>("reading");
  const [priority, setPriority] = useState<Priority>("normal");
  const [examId, setExamId] = useState(defaultExamId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    // Split line by line
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const createdItems: StudyItem[] = lines.map((line, idx) => ({
      id: "item_" + Date.now() + "_" + idx + "_" + Math.random().toString(36).substring(2, 6),
      userId: "guest",
      title: line,
      subject,
      chapter: chapter.trim() || undefined,
      type,
      priority,
      status: "not_started",
      examId: examId || (exams.length > 0 ? exams[0].id : "general"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    if (onSaveBulk) {
      onSaveBulk(createdItems);
    } else if (onBulkCreate) {
      onBulkCreate(createdItems);
    }

    setRawText("");
    setChapter("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "একসাথে একাধিক টপিক যুক্ত করুন" : "Bulk Import Topics"}
      subtitle={
        language === "bn"
          ? "প্রতিটি লাইনে একটি করে টপিকের নাম লিখুন। পুরো সিলেবাস একসাথে ইমপোর্ট হয়ে যাবে।"
          : "Enter one study topic per line to quickly import an entire syllabus section."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-['Hind_Siliguri']">
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
              {language === "bn" ? "অধ্যায় (Chapter - ঐচ্ছিক)" : "Chapter (Optional)"}
            </label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder={language === "bn" ? "যেমন: অধ্যায় ৩" : "e.g. Chapter 3"}
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
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "টপিকের তালিকা (প্রতি লাইনে একটি করে)" : "Topics List (One per line)"}
          </label>
          <textarea
            rows={6}
            required
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              language === "bn"
                ? "ভেক্টর যোগের সামান্তরিক সূত্র\nভেক্টর ডট ও ক্রস গুণন\nনৌকার বেগ ও নদীর স্রোত গাণিতিক সমস্যা\nবৃষ্টি ও ছাতার অংকসমূহ"
                : "Vector addition parallelogram law\nVector dot and cross product\nRiver boat relative velocity math problems"
            }
            className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-mono text-xs text-stone-900 dark:text-white focus:outline-none"
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
            {language === "bn" ? "একসাথে ইমপোর্ট করুন" : "Bulk Import"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
