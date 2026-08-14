import React from "react";
import { BarChart3, TrendingUp, Award, Target, BookOpen, GraduationCap } from "lucide-react";
import { Exam, StudyItem, ExamAttempt, Language } from "../../types";
import { ProgressBar } from "../common/ProgressBar";

interface AnalyticsViewProps {
  exams: Exam[];
  studyItems: StudyItem[];
  attempts: ExamAttempt[];
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  exams,
  studyItems,
  attempts,
  language,
}) => {
  const completedItems = studyItems.filter(
    (s) => s.status === "completed" || s.status === "mastered"
  ).length;

  const totalItems = studyItems.length || 1;
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  const avgAttemptScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length
        )
      : 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          {language === "bn" ? "প্রস্তুতি ও অগ্রগতি বিশ্লেষণ" : "Analytics & Readiness"}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          {language === "bn"
            ? "তোমার পরীক্ষার সার্বিক প্রস্তুতি এবং সাবজেক্ট ভিত্তিক অ্যানালিটিক্স"
            : "Overview of overall exam readiness and subject-level performance metrics"}
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>{language === "bn" ? "সার্বিক অগ্রগতি" : "Overall Progress"}</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {overallProgress}%
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {completedItems} of {studyItems.length} {language === "bn" ? "পড়া সম্পন্ন" : "items completed"}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{language === "bn" ? "মডেল টেস্ট গড়" : "Average Score"}</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {avgAttemptScore}%
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            Across {attempts.length} {language === "bn" ? "টি টেস্ট" : "test attempts"}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>{language === "bn" ? "সক্রিয় পরীক্ষা" : "Active Exams"}</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {exams.length}
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {language === "bn" ? "সংগঠিত পরীক্ষা ক্ষেত্র" : "Workspaces configured"}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>{language === "bn" ? "সমাধানকৃত প্রশ্ন" : "Questions Solved"}</span>
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
            {attempts.reduce((acc, curr) => acc + curr.answers.length, 0)}
          </div>
          <p className="text-[10px] text-stone-400 mt-1">
            {language === "bn" ? "অনুশীলন সম্পন্ন" : "Practiced in test engine"}
          </p>
        </div>
      </div>

      {/* Subject Wise Readiness Breakdown */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "বিষয়ভিত্তিক প্রস্তুতি বিশ্লেষণ" : "Subject Readiness Breakdown"}
        </h3>

        {exams.length === 0 ? (
          <div className="text-xs text-stone-400 text-center py-6">
            {language === "bn"
              ? "কোনো পরীক্ষা যুক্ত করা হয়নি।"
              : "No exam data available for analytics."}
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((ex) => {
              const examItems = studyItems.filter((s) => s.examId === ex.id);
              const doneExamItems = examItems.filter(
                (s) => s.status === "completed" || s.status === "mastered"
              ).length;
              const ratio = examItems.length
                ? Math.round((doneExamItems / examItems.length) * 100)
                : ex.preparationScore;

              return (
                <div key={ex.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {ex.title}
                      </span>
                      <span className="ml-2 text-stone-400">({ex.subject})</span>
                    </div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {ratio}%
                    </span>
                  </div>
                  <ProgressBar progress={ratio} color="indigo" size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Test History Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          {language === "bn" ? "সাম্প্রতিক টেস্ট রেকর্ড" : "Recent Test Attempts"}
        </h3>

        {attempts.length === 0 ? (
          <div className="text-xs text-stone-400 text-center py-6">
            {language === "bn"
              ? "এখনো কোনো টেস্ট হিস্ট্রি নেই।"
              : "No recent test attempts recorded yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
              <thead className="text-[10px] uppercase tracking-wider font-bold text-stone-400 border-b border-stone-100 dark:border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Marks</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3">
                      {new Date(att.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {att.earnedMarks} / {att.totalMarks}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          att.score >= 60
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {att.score}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-500">
                      {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
