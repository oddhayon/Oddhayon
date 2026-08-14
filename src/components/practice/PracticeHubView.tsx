import React from "react";
import { 
  BrainCircuit, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Target, 
  BookOpen, 
  Award,
  Layers
} from "lucide-react";
import { GeneratedTest, ExamAttempt, Exam, Language } from "../../types";

interface PracticeHubViewProps {
  tests: GeneratedTest[];
  attempts: ExamAttempt[];
  exams: Exam[];
  language: Language;
  onOpenGenerateTest: () => void;
  onStartExam: (test: GeneratedTest) => void;
  onViewAttempt: (test: GeneratedTest, attempt: ExamAttempt) => void;
}

export const PracticeHubView: React.FC<PracticeHubViewProps> = ({
  tests,
  attempts,
  exams,
  language,
  onOpenGenerateTest,
  onStartExam,
  onViewAttempt,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {language === "bn" ? "অনুশীলন ও প্র্যাকটিস টেস্ট" : "Practice & Assessment Hub"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {language === "bn"
              ? "টাইমার সহ রিয়েল-টাইম মডেল টেস্ট ও এআই প্রশ্ন অনুশীলন"
              : "Timed exam simulator with instant grading and AI feedback"}
          </p>
        </div>

        <button
          onClick={onOpenGenerateTest}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-semibold rounded-xl text-xs shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{language === "bn" ? "নতুন টেস্ট জেনারেট করো" : "Generate Test"}</span>
        </button>
      </div>

      {/* Preset Practice Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={onOpenGenerateTest}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-5 shadow-xs cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {language === "bn" ? "এমসিকিউ মডেল টেস্ট" : "MCQ Speed Test"}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === "bn"
              ? "১০ বা ২০ প্রশ্নের টাইমার ভিত্তিক বহুনির্বাচনী টেস্ট"
              : "Timed 10-20 MCQ quizzes with instant auto-grading"}
          </p>
        </div>

        <div
          onClick={onOpenGenerateTest}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl p-5 shadow-xs cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {language === "bn" ? "সৃজনশীল প্রশ্ন মডেল" : "Creative Exam Standard"}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === "bn"
              ? "উদ্দীপক সহ ক+খ+গ+ঘ প্রশ্নের মডেল টেস্ট ও মার্কিং গাইড"
              : "Board-standard stimulus questions with full rubric"}
          </p>
        </div>

        <div
          onClick={onOpenGenerateTest}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-2xl p-5 shadow-xs cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {language === "bn" ? "সূত্র ও উপপাদ্য ড্রিল" : "Formula & Theorem Drill"}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === "bn"
              ? "ম্যাথ, ফিজিক্স ও কেমিস্ট্রি সূত্রের দ্রুত মূল্যায়ন"
              : "Intensive formula memory check & concept verification"}
          </p>
        </div>
      </div>

      {/* Available Tests List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "তৈরিকৃত মডেল টেস্টসমূহ" : "Generated Test Papers"}
        </h3>

        {tests.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-xs text-stone-400">
            <BrainCircuit className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-700 mb-2" />
            {language === "bn"
              ? "এখনো কোনো টেস্ট জেনারেট করা হয়নি। উপরে 'নতুন টেস্ট জেনারেট করো' বাটনে ক্লিক করো!"
              : "No tests generated yet. Click 'Generate Test' above to start!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((t) => {
              const lastAttempt = attempts.find((a) => a.testId === t.id);

              return (
                <div
                  key={t.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 rounded-2xl p-5 shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400 mb-1 inline-block">
                        {t.subject}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {t.title}
                      </h4>
                    </div>

                    {lastAttempt && (
                      <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                        {lastAttempt.score}% Score
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                      {t.questions.length} {language === "bn" ? "টি প্রশ্ন" : "Questions"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {t.timeLimitMinutes || 15} {language === "bn" ? "মিনিট" : "Mins"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    {lastAttempt ? (
                      <button
                        onClick={() => onViewAttempt(t, lastAttempt)}
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                      >
                        {language === "bn" ? "ফলাফল ও সমাধান দেখো" : "View Results"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400">
                        {language === "bn" ? "এখনো পরীক্ষা দেওয়া হয়নি" : "Not attempted yet"}
                      </span>
                    )}

                    <button
                      onClick={() => onStartExam(t)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {lastAttempt
                          ? language === "bn"
                            ? "পুনরায় পরীক্ষা দিন"
                            : "Retake Exam"
                          : language === "bn"
                          ? "পরীক্ষা শুরু করো"
                          : "Start Exam"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
