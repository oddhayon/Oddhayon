import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Exam, Material, Language, QuestionType, GeneratedTest } from "../../types";
import { Sparkles, Loader2, BrainCircuit, Clock, HelpCircle, Layers, Award } from "lucide-react";
import { generateQuestionsWithAI } from "../../services/ai";
import { RangeSlider } from "../common/RangeSlider";
import { SubjectSelect } from "../common/SubjectSelect";

interface GenerateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: Exam[];
  materials: Material[];
  defaultExamId?: string;
  defaultMaterialId?: string;
  language: Language;
  onTestGenerated: (test: GeneratedTest) => void;
}

export const GenerateTestModal: React.FC<GenerateTestModalProps> = ({
  isOpen,
  onClose,
  exams,
  materials,
  defaultExamId,
  defaultMaterialId,
  language,
  onTestGenerated,
}) => {
  const [examId, setExamId] = useState(defaultExamId || (exams[0]?.id || ""));
  const [materialId, setMaterialId] = useState(defaultMaterialId || "all");
  const [questionType, setQuestionType] = useState<QuestionType>("mcq");
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "board_standard">("medium");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedExam = exams.find((e) => e.id === examId) || exams[0];
  const relevantMaterials = materials.filter(
    (m) => m.examId === examId || examId === "all"
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const selectedMat = materials.find((m) => m.id === materialId);
      const test = await generateQuestionsWithAI({
        examId: selectedExam?.id || "exam_default",
        subject: selectedExam?.subject || "General",
        topic: selectedMat?.title || selectedExam?.title || "Exam Syllabus",
        questionType,
        count: Number(questionCount) || 10,
        difficulty,
        materialsContent: selectedMat
          ? selectedMat.extractedText
          : relevantMaterials.map((m) => m.extractedText).join("\n\n"),
        timeLimitMinutes: Number(timeLimitMinutes) || 15,
        language,
      });

      onTestGenerated(test);
      onClose();
    } catch (err: any) {
      console.error("Generate Test Error:", err);
      setError(err.message || "Failed to generate test with Gemini AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "এআই প্রশ্ন ও টেস্ট জেনারেটর" : "AI Test Generator"}
      subtitle={
        language === "bn"
          ? "আপলোডকৃত নোট ও সিলেবাসের উপর ভিত্তি করে কাস্টম প্র্যাকটিস টেস্ট ও বোর্ডের আদলে প্রশ্নপত্র তৈরি করো"
          : "Generate customized practice tests (MCQ, Creative, Short) grounded in your notes"
      }
      maxWidth="lg"
    >
      <form onSubmit={handleGenerate} className="space-y-4 font-['Hind_Siliguri']">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "পরীক্ষা নির্বাচন করো *" : "Select Exam *"}
            </label>
            <select
              value={examId}
              onChange={(e) => {
                setExamId(e.target.value);
                setMaterialId("all");
              }}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {language === "bn" ? "উৎস লেকচার/নোট সিলেক্ট করো" : "Source Material / Note"}
            </label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="all">
                {language === "bn" ? "সকল নোট ও সিলেবাস একসাথে" : "All materials & general syllabus"}
              </option>
              {relevantMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "প্রশ্নের ধরণ (Question Pattern)" : "Question Pattern"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "mcq", label: language === "bn" ? "MCQ (বহুনির্বাচনী)" : "MCQ Test", desc: "1 Mark per Q" },
              { id: "creative", label: language === "bn" ? "CQ (সৃজনশীল)" : "Creative Q", desc: "ক, খ, গ, ঘ" },
              { id: "short", label: language === "bn" ? "সংক্ষিপ্ত উত্তর" : "Short Q", desc: "Short Math/Concept" },
              { id: "formula", label: language === "bn" ? "সূত্র ও প্রমাণ" : "Formulas", desc: "Theorems & Proofs" },
              { id: "mixed", label: language === "bn" ? "মিক্সড অ্যাসেসমেন্ট" : "Mixed Test", desc: "Combined Set" },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setQuestionType(p.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  questionType === p.id
                    ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 dark:border-white shadow-xs scale-[1.02]"
                    : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                }`}
              >
                <div className="font-bold text-xs">{p.label}</div>
                <div className={`text-[10px] ${questionType === p.id ? "text-stone-300 dark:text-stone-600" : "text-stone-400"}`}>
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sliders for Question Count & Timer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RangeSlider
            label={language === "bn" ? "প্রশ্নের সংখ্যা (Questions Count)" : "Question Count"}
            subtitle={language === "bn" ? "টেস্টের দৈর্ঘ্য এডজাস্ট করো" : "Set exact number of questions"}
            value={questionCount}
            min={3}
            max={30}
            step={1}
            unit={language === "bn" ? "টি" : "Qs"}
            onChange={setQuestionCount}
            quickPresets={[5, 10, 15, 20]}
            language={language}
            icon={<HelpCircle className="w-4 h-4" />}
          />

          <RangeSlider
            label={language === "bn" ? "সময়সীমা (Timer Limit)" : "Time Limit"}
            subtitle={language === "bn" ? "কাউন্টডাউন টাইমার সেট করো" : "Set test duration"}
            value={timeLimitMinutes}
            min={5}
            max={120}
            step={5}
            unit={language === "bn" ? "মিনিট" : "mins"}
            onChange={setTimeLimitMinutes}
            quickPresets={[10, 15, 30, 45, 60]}
            language={language}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "bn" ? "কঠিনতার মাত্রা (Difficulty Standard)" : "Difficulty Level"}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "easy", label: language === "bn" ? "সহজ (Easy)" : "Easy", color: "hover:border-emerald-500" },
              { id: "medium", label: language === "bn" ? "মাঝারি (Medium)" : "Medium", color: "hover:border-amber-500" },
              { id: "hard", label: language === "bn" ? "কঠিন (Hard)" : "Hard", color: "hover:border-rose-500" },
              { id: "board_standard", label: language === "bn" ? "বোর্ড স্ট্যান্ডার্ড" : "Board Standard", color: "hover:border-indigo-500" },
            ].map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDifficulty(d.id as any)}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  difficulty === d.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : `bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 ${d.color}`
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/80 dark:border-stone-700 text-[11px] text-stone-500 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {language === "bn"
              ? "Gemini AI তোমার পছন্দ অনুযায়ী প্রতিটি প্রশ্নের সঠিক উত্তর এবং ব্যাখ্যা জেনারেট করবে।"
              : "Gemini AI will synthesize custom questions with step-by-step solutions and explanations."}
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer active:translate-y-[1px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>{language === "bn" ? "প্রশ্ন তৈরি করা হচ্ছে..." : "Generating Test..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{language === "bn" ? "পরীক্ষা জেনারেট করো" : "Generate Test"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
