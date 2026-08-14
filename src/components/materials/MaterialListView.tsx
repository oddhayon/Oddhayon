import React, { useState } from "react";
import { FileText, Upload, Sparkles, BookOpen, Trash2, Search, Filter } from "lucide-react";
import { Material, Exam, Language } from "../../types";

interface MaterialListViewProps {
  materials: Material[];
  exams: Exam[];
  language: Language;
  onOpenUploadMaterial: () => void;
  onDeleteMaterial: (materialId: string) => void;
  onGenerateTestFromMaterial: (material: Material) => void;
}

export const MaterialListView: React.FC<MaterialListViewProps> = ({
  materials,
  exams,
  language,
  onOpenUploadMaterial,
  onDeleteMaterial,
  onGenerateTestFromMaterial,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>("all");
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);

  const filteredMaterials = materials.filter((m) => {
    if (selectedExamId !== "all" && m.examId !== selectedExamId) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.extractedText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {language === "bn" ? "লেকচার ও নোট ব্যাংক" : "Lecture & Material Bank"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            {language === "bn"
              ? "আপলোডকৃত বইয়ের পাতা, নোট এবং AI দ্বারা এক্সট্র্যাক্ট করা সূত্রাবলী"
              : "Uploaded class notes, photos, and AI-extracted formula banks"}
          </p>
        </div>

        <button
          onClick={onOpenUploadMaterial}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-semibold rounded-xl text-xs shadow-xs transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>{language === "bn" ? "নোট আপলোড করো" : "Upload Note"}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "লেকচার শিরোনাম বা টেক্সট দিয়ে সার্চ করো..."
                : "Search materials by title or content..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="all">{language === "bn" ? "সকল পরীক্ষা" : "All Exams"}</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-xs text-stone-400">
          <FileText className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-700 mb-2" />
          {language === "bn"
            ? "কোনো লেকচার ফাইল বা নোট পাওয়া যায়নি। ছবি বা টেক্সট আপলোড করো!"
            : "No materials found. Upload textbook photos or class notes!"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMaterials.map((material) => {
            const isExpanded = expandedMaterialId === material.id;
            const parentExam = exams.find((e) => e.id === material.examId);

            return (
              <div
                key={material.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 rounded-2xl p-5 shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {parentExam && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400">
                          {parentExam.title}
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                      {material.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onGenerateTestFromMaterial(material)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/80 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{language === "bn" ? "এআই টেস্ট তৈরি" : "Generate Test"}</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedMaterialId(isExpanded ? null : material.id)
                      }
                      className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
                    >
                      {isExpanded
                        ? language === "bn"
                          ? "লুকান"
                          : "Hide"
                        : language === "bn"
                        ? "বিস্তারিত"
                        : "View"}
                    </button>

                    <button
                      onClick={() => onDeleteMaterial(material.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Formula & Concept Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {material.formulas && material.formulas.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 rounded-lg font-mono text-[11px] border border-indigo-200/60 dark:border-indigo-800/60">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span>
                        {material.formulas.length}{" "}
                        {language === "bn" ? "টি সূত্র" : "Formulas Extracted"}
                      </span>
                    </div>
                  )}

                  {material.concepts && material.concepts.length > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-[11px] border border-emerald-200/60 dark:border-emerald-800/60">
                      <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {material.concepts.length}{" "}
                        {language === "bn" ? "টি ধারণা" : "Concepts"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4 animate-in fade-in duration-200">
                    {/* Formulas grid */}
                    {material.formulas && material.formulas.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                          {language === "bn" ? "এক্সট্র্যাক্টকৃত সূত্রসমূহ:" : "Extracted Formulas:"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {material.formulas.map((form, i) => (
                            <div
                              key={i}
                              className="p-2.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl font-mono text-xs text-indigo-900 dark:text-indigo-300 border border-stone-200/80 dark:border-stone-700/80"
                            >
                              {form}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extracted Raw Text */}
                    <div>
                      <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        {language === "bn" ? "মূল লেখা (Full Content):" : "Full Extracted Text:"}
                      </h4>
                      <pre className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl text-xs font-mono text-stone-800 dark:text-stone-200 whitespace-pre-wrap max-h-60 overflow-y-auto border border-stone-200/80 dark:border-stone-700/80">
                        {material.extractedText}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
