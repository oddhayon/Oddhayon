import React from "react";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { GeneratedTest, ExamAttempt, Language, MistakeItem } from "../../types";

interface TestResultViewProps {
  test: GeneratedTest;
  attempt: ExamAttempt;
  language: Language;
  onBackToDashboard: () => void;
  onSaveMistake: (mistake: MistakeItem) => void;
  onAskTutorAboutQuestion: (qText: string) => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  test,
  attempt,
  language,
  onBackToDashboard,
  onSaveMistake,
  onAskTutorAboutQuestion,
}) => {
  const isPassed = attempt.score >= 60;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "bn" ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}</span>
        </button>

        <span className="text-xs text-stone-400">
          {new Date(attempt.completedAt).toLocaleString()}
        </span>
      </div>

      {/* Score Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm ${
              isPassed
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
            }`}
          >
            {attempt.score}%
          </div>

          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {isPassed
                ? language === "bn"
                  ? "চমৎকার! আপনি উত্তীর্ণ হয়েছেন"
                  : "Great Job! Assessment Passed"
                : language === "bn"
                ? "প্রস্তুতি আরও জোরদার করতে হবে"
                : "Needs Review & Improvement"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {test.title} · {test.subject}
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              {language === "bn" ? "অর্জিত নম্বর" : "Marks Earned"}
            </span>
            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {attempt.earnedMarks} / {attempt.totalMarks}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              {language === "bn" ? "সময় লেগেছে" : "Time Spent"}
            </span>
            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Solution Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "প্রশ্নের বিস্তারিত সমাধান ও ব্যাখ্যা" : "Detailed Solutions & Explanations"}
        </h3>

        {test.questions.map((q, idx) => {
          const userAns = attempt.answers.find((a) => a.questionId === q.id);
          const isMcq = q.type === "mcq";
          const isCorrect =
            isMcq && userAns && userAns.selectedOption === q.correctAnswerIndex;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-stone-900 border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                isMcq
                  ? isCorrect
                    ? "border-emerald-200 dark:border-emerald-900/50"
                    : "border-rose-200 dark:border-rose-900/50"
                  : "border-stone-200 dark:border-stone-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs text-stone-400 uppercase font-semibold">
                    {q.type} ({q.marks || 1} Marks)
                  </span>
                </div>

                {isMcq && (
                  <div className="flex items-center gap-1 text-xs font-bold">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {language === "bn" ? "সঠিক" : "Correct"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" />
                        {language === "bn" ? "ভুল" : "Incorrect"}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {q.questionText}
              </div>

              {/* Options Breakdown for MCQ */}
              {isMcq && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isUserChoice = userAns?.selectedOption === oIdx;
                    const isRightOpt = q.correctAnswerIndex === oIdx;

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between font-medium ${
                          isRightOpt
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-900 dark:text-emerald-200"
                            : isUserChoice
                            ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-900 dark:text-rose-200"
                            : "bg-stone-50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        <span>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </span>
                        {isRightOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explanation / Solution */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                  {language === "bn" ? "ধাপভিত্তিক সমাধান:" : "Step-by-Step Solution:"}
                </span>
                <p className="leading-relaxed font-mono whitespace-pre-line">
                  {q.explanation || "Detailed solution recorded."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                <button
                  onClick={() =>
                    onSaveMistake({
                      id: `mistake_${Date.now()}_${idx}`,
                      userId: "guest_student_123",
                      questionId: q.id,
                      questionText: q.questionText,
                      correctAnswer:
                        isMcq && q.options
                          ? q.options[q.correctAnswerIndex || 0]
                          : q.explanation || "",
                      userAnswer: isMcq && userAns?.selectedOption !== undefined && q.options
                        ? q.options[userAns.selectedOption]
                        : userAns?.writtenAnswer || "No answer",
                      explanation: q.explanation || "",
                      subject: test.subject,
                      topic: test.topic,
                      reviewCount: 0,
                      mastered: false,
                      createdAt: new Date().toISOString(),
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold border border-rose-200/60 dark:border-rose-800/60 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "ভুল উত্তর ব্যাংকে সেভ করুন" : "Save to Mistake Book"}</span>
                </button>

                <button
                  onClick={() => onAskTutorAboutQuestion(q.questionText)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{language === "bn" ? "এআই টিউটরকে জিজ্ঞেস করুন" : "Ask AI Tutor"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
