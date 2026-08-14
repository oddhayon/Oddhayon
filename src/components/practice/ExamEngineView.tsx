import React, { useState, useEffect } from "react";
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  X,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { GeneratedTest, Question, ExamAttempt, UserAnswer, Language } from "../../types";

interface ExamEngineViewProps {
  test: GeneratedTest;
  language: Language;
  onFinishTest: (attempt: ExamAttempt) => void;
  onCancelTest: () => void;
}

export const ExamEngineView: React.FC<ExamEngineViewProps> = ({
  test,
  language,
  onFinishTest,
  onCancelTest,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(
    (test.timeLimitMinutes || 15) * 60
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const STORAGE_KEY = `exam_engine_session_${test.id}`;

  // Restore session or setup timer
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        setFlagged(parsed.flagged || {});
        if (typeof parsed.secondsRemaining === "number" && parsed.secondsRemaining > 0) {
          setSecondsRemaining(parsed.secondsRemaining);
        }
      } catch (e) {
        console.error("Failed to parse saved exam session", e);
      }
    }
  }, [STORAGE_KEY]);

  // Timer countdown & Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save progress on state change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers,
        flagged,
        secondsRemaining,
      })
    );
  }, [answers, flagged, secondsRemaining, STORAGE_KEY]);

  const currentQuestion = test.questions[currentIdx];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOption: optionIndex,
      },
    }));
  };

  const handleTextAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        writtenAnswer: text,
      },
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = test.questions.length;

  const handleFinalSubmit = () => {
    localStorage.removeItem(STORAGE_KEY);

    // Calculate score
    let earnedMarks = 0;
    let totalMarks = 0;

    test.questions.forEach((q) => {
      totalMarks += q.marks || 1;
      const userAns = answers[q.id];

      if (q.type === "mcq") {
        if (userAns && userAns.selectedOption === q.correctAnswerIndex) {
          earnedMarks += q.marks || 1;
        }
      } else {
        // Written/Creative question self or basic completion mark
        if (userAns && userAns.writtenAnswer && userAns.writtenAnswer.trim().length > 5) {
          earnedMarks += (q.marks || 1) * 0.8; // default mark for written completion
        }
      }
    });

    const percentage = Math.round((earnedMarks / Math.max(1, totalMarks)) * 100);

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      userId: "guest_student_123",
      examId: test.examId,
      testId: test.id,
      answers: Object.values(answers),
      score: percentage,
      totalMarks,
      earnedMarks,
      timeTakenSeconds: (test.timeLimitMinutes || 15) * 60 - secondsRemaining,
      completedAt: new Date().toISOString(),
    };

    onFinishTest(attempt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 text-stone-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-stone-100 leading-tight">
              {test.title}
            </h1>
            <p className="text-[10px] text-stone-400">
              {test.subject} · {test.questions.length} {language === "bn" ? "টি প্রশ্ন" : "Questions"}
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
              secondsRemaining < 120
                ? "bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse"
                : "bg-stone-900 border-stone-700 text-stone-200"
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "পরীক্ষা জমা দিন" : "Submit Exam"}</span>
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Active Question Display */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
          {currentQuestion && (
            <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Question Header & Flag */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-bold">
                    Q{currentIdx + 1} of {totalCount}
                  </span>
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                    {currentQuestion.type} ({currentQuestion.marks || 1} Marks)
                  </span>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    flagged[currentQuestion.id]
                      ? "bg-amber-950 text-amber-300 border border-amber-600"
                      : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>
                    {flagged[currentQuestion.id]
                      ? language === "bn"
                        ? "ফ্ল্যাগ করা হয়েছে"
                        : "Flagged"
                      : language === "bn"
                      ? "রিভিউ এর জন্য চিহ্নিত করো"
                      : "Flag"}
                  </span>
                </button>
              </div>

              {/* Stimulus / Scenario if Creative Question */}
              {currentQuestion.stimulus && (
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-300 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    {language === "bn" ? "উদ্দীপক / বিষয়বস্তু:" : "Stimulus / Scenario:"}
                  </span>
                  <p className="leading-relaxed whitespace-pre-line font-serif">
                    {currentQuestion.stimulus}
                  </p>
                </div>
              )}

              {/* Question Stem */}
              <div className="text-base sm:text-lg font-semibold text-stone-100 leading-snug">
                {currentQuestion.questionText}
              </div>

              {/* Question Options / Input Area */}
              {currentQuestion.type === "mcq" && currentQuestion.options ? (
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((optionText, optIdx) => {
                    const isSelected =
                      answers[currentQuestion.id]?.selectedOption === optIdx;
                    const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          handleSelectOption(currentQuestion.id, optIdx)
                        }
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer active:translate-y-[2px] ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 border-b-4 border-b-amber-600 text-amber-100 shadow-md ring-1 ring-amber-500"
                            : "bg-stone-900 border-stone-800 border-b-4 border-b-stone-950 text-stone-200 hover:bg-stone-850 hover:border-stone-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border border-b-2 ${
                              isSelected
                                ? "bg-amber-500 border-amber-600 border-b-amber-700 text-stone-950 font-extrabold"
                                : "bg-stone-800 border-stone-700 border-b-stone-900 text-stone-400"
                            }`}
                          >
                            {optionLetter}
                          </span>
                          <span className="font-semibold">{optionText}</span>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Creative Sub-parts or Written Input */
                <div className="space-y-4 pt-2">
                  {currentQuestion.creativeParts ? (
                    <div className="space-y-4">
                      {currentQuestion.creativeParts.map((part, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                            <span>
                              {part.partLabel} ({part.partMarks} Marks)
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-stone-200">
                            {part.partQuestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-xs font-bold text-stone-400 mb-1">
                      {language === "bn"
                        ? "তোমার লিখিত উত্তর / ধাপসমূহ টাইপ করো:"
                        : "Type your answer step-by-step:"}
                    </label>
                    <textarea
                      rows={6}
                      value={answers[currentQuestion.id]?.writtenAnswer || ""}
                      onChange={(e) =>
                        handleTextAnswerChange(currentQuestion.id, e.target.value)
                      }
                      placeholder={
                        language === "bn"
                          ? "তোমার গাণিতিক সমাধান বা ব্যাখ্যা এখানে লিখুন..."
                          : "Write your mathematical derivation or explanation..."
                      }
                      className="w-full p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === "bn" ? "পূর্ববর্তী" : "Previous"}</span>
                </button>

                <div className="text-xs text-stone-400 font-medium">
                  {answeredCount} / {totalCount} {language === "bn" ? "উত্তর প্রদান করা হয়েছে" : "answered"}
                </div>

                <button
                  disabled={currentIdx === totalCount - 1}
                  onClick={() =>
                    setCurrentIdx((prev) => Math.min(totalCount - 1, prev + 1))
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>{language === "bn" ? "পরবর্তী" : "Next"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Question Palette Navigator */}
        <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-stone-800 bg-stone-950 p-4 shrink-0 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              {language === "bn" ? "প্রশ্ন নেভিগেটর" : "Question Palette"}
            </h3>

            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged[q.id];
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
                      isCurrent
                        ? "ring-2 ring-indigo-500 font-black text-white bg-indigo-900/80"
                        : isAnswered
                        ? "bg-emerald-950 border border-emerald-600 text-emerald-300"
                        : "bg-stone-900 border border-stone-800 text-stone-400 hover:bg-stone-800"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Legend & Cancel */}
          <div className="pt-4 border-t border-stone-800/80 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>{language === "bn" ? "উত্তর প্রদানকৃত" : "Answered"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-800 border border-stone-600" />
                <span>{language === "bn" ? "অনুত্তর" : "Unanswered"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{language === "bn" ? "ফ্ল্যাগড" : "Flagged"}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm(language === "bn" ? "পরীক্ষা বাতিল করতে চান?" : "Cancel exam session?")) {
                  localStorage.removeItem(STORAGE_KEY);
                  onCancelTest();
                }
              }}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              {language === "bn" ? "পরীক্ষা বাতিল করো" : "Cancel Session"}
            </button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">
                  {language === "bn" ? "পরীক্ষা জমা নিশ্চিতকরণ" : "Confirm Exam Submission"}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {language === "bn"
                    ? "তুমি কি উত্তরপত্র ফাইনাল সাবমিট করতে চান?"
                    : "Are you sure you want to finalize your exam test?"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-300">
                <span>{language === "bn" ? "উত্তর প্রদানকৃত প্রশ্ন:" : "Answered Questions:"}</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span>{language === "bn" ? "বাকি প্রশ্নসমূহ:" : "Unanswered Questions:"}</span>
                <span className="font-bold text-amber-400">{totalCount - answeredCount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-semibold"
              >
                {language === "bn" ? "ফিরে যান" : "Return to Exam"}
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {language === "bn" ? "হ্যাঁ, সাবমিট করো" : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
