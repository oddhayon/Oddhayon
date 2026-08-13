import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { OCRExtractionResult, Material, StudyItem, Language } from "../../types";
import { Sparkles, Check, FileText, BookOpen, Layers } from "lucide-react";

interface OCRReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  initialTitle: string;
  ocrData: OCRExtractionResult;
  language: Language;
  onConfirmSave: (material: Material, autoCreatedItems: StudyItem[]) => void;
}

export const OCRReviewModal: React.FC<OCRReviewModalProps> = ({
  isOpen,
  onClose,
  examId,
  initialTitle,
  ocrData,
  language,
  onConfirmSave,
}) => {
  const [title, setTitle] = useState(initialTitle || ocrData.title);
  const [extractedText, setExtractedText] = useState(ocrData.extractedText);
  const [createStudyItemsForQuestions, setCreateStudyItemsForQuestions] = useState(true);

  const handleSave = () => {
    const materialId = `mat_${Date.now()}`;
    const material: Material = {
      id: materialId,
      userId: "guest_student_123",
      examId: examId,
      title: title.trim() || "Uploaded Material",
      fileType: "text",
      extractedText,
      summary: ocrData.title,
      topics: ocrData.topic ? [ocrData.topic] : [],
      concepts: ocrData.concepts || [],
      formulas: ocrData.formulas || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const autoItems: StudyItem[] = [];

    if (createStudyItemsForQuestions && ocrData.questionsFound?.length > 0) {
      ocrData.questionsFound.forEach((qText, idx) => {
        autoItems.push({
          id: `item_auto_${Date.now()}_${idx}`,
          userId: "guest_student_123",
          examId: examId,
          title: qText.length > 70 ? qText.substring(0, 67) + "..." : qText,
          type: ocrData.contentType || "creative",
          chapter: ocrData.chapter || undefined,
          topic: ocrData.topic || undefined,
          description: qText,
          priority: "normal",
          status: "not_started",
          estimatedMinutes: 20,
          materialIds: [materialId],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
    }

    onConfirmSave(material, autoItems);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "AI এক্সট্র্যাক্টেড নোট রিভিউ" : "Review Extracted Content"}
      subtitle={
        language === "bn"
          ? "Gemini AI দ্বারা চিহ্নিত তথ্যসমূহ রিভিউ করুন এবং মেটেরিয়াল হিসেবে সংরক্ষণ করুন"
          : "Review extracted concepts, formulas, and auto-generated study items"
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "লেকচারের শিরোনাম" : "Material Title"}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-bold focus:outline-none"
          />
        </div>

        {/* Formatted Extracted Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ocrData.formulas && ocrData.formulas.length > 0 && (
            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{language === "bn" ? "চিহ্নিত সূত্রাবলী (Formulas)" : "Identified Formulas"}</span>
              </h4>
              <ul className="text-xs text-indigo-800 dark:text-indigo-300 space-y-1 list-disc pl-4 font-mono">
                {ocrData.formulas.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {ocrData.concepts && ocrData.concepts.length > 0 && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === "bn" ? "প্রধান ধারণাসমূহ (Concepts)" : "Key Concepts"}</span>
              </h4>
              <ul className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1 list-disc pl-4">
                {ocrData.concepts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Found Questions Option */}
        {ocrData.questionsFound && ocrData.questionsFound.length > 0 && (
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {ocrData.questionsFound.length}{" "}
                  {language === "bn" ? "টি চিহ্নিত প্রশ্ন পাওয়া গেছে" : "questions found in material"}
                </span>
              </div>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createStudyItemsForQuestions}
                  onChange={(e) => setCreateStudyItemsForQuestions(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>
                  {language === "bn"
                    ? "স্বয়ংক্রিয়ভাবে পড়ার তালিকায় যুক্ত করুন"
                    : "Auto-create Study Items"}
                </span>
              </label>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-xs text-amber-800 dark:text-amber-300">
              {ocrData.questionsFound.map((q, idx) => (
                <div key={idx} className="p-1.5 bg-white/60 dark:bg-stone-900/60 rounded border border-amber-200/50">
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Extracted Verbatim Text */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "সম্পূর্ণ মূল লেখা (Extracted Text)" : "Full Extracted Text"}
          </label>
          <textarea
            rows={7}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>{language === "bn" ? "সংরক্ষণ করুন" : "Save Material"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
