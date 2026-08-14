import React, { useState, useEffect } from "react";
import { getAllSubjects, saveCustomSubject } from "../../utils/subjectUtils";
import { Language } from "../../types";
import { Plus, Check, X } from "lucide-react";

interface SubjectSelectProps {
  value: string;
  onChange: (subject: string) => void;
  language: Language;
  className?: string;
  label?: string;
  required?: boolean;
}

export const SubjectSelect: React.FC<SubjectSelectProps> = ({
  value,
  onChange,
  language,
  className = "",
  label,
  required = false,
}) => {
  const [subjectsList, setSubjectsList] = useState<string[]>([]);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [customInputValue, setCustomInputValue] = useState<string>("");

  useEffect(() => {
    const all = getAllSubjects();
    setSubjectsList(all);

    if (value && !all.includes(value)) {
      saveCustomSubject(value);
      setSubjectsList(getAllSubjects());
    }
  }, [value]);

  const handleAddSubject = (subjectName: string) => {
    const trimmed = subjectName.trim();
    if (!trimmed) return;

    saveCustomSubject(trimmed);
    const updated = getAllSubjects();
    setSubjectsList(updated);
    onChange(trimmed);
    setCustomInputValue("");
    setIsAddingNew(false);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="block font-bold text-stone-700 dark:text-stone-300">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "নতুন বিষয়" : "New Subject"}</span>
        </button>
      </div>

      {/* Inline Minimal Custom Input when triggered */}
      {isAddingNew ? (
        <div className="p-2.5 bg-stone-100 dark:bg-stone-800 border border-indigo-300 dark:border-indigo-700 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubject(customInputValue);
                }
              }}
              placeholder={
                language === "bn"
                  ? "নতুন বিষয়ের নাম টাইপ করো..."
                  : "Type subject name..."
              }
              className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddSubject(customInputValue)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === "bn" ? "সেভ" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Clean Standard Native Select */
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === "__ADD_NEW_SUBJECT__") {
              setIsAddingNew(true);
            } else {
              onChange(e.target.value);
            }
          }}
          required={required}
          className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 border-b-2 border-b-stone-300 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
        >
          {subjectsList.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
          <option value="__ADD_NEW_SUBJECT__" className="font-bold text-indigo-600 dark:text-indigo-400">
            {language === "bn" ? "➕ নতুন বিষয় যুক্ত করো..." : "➕ Add Custom Subject..."}
          </option>
        </select>
      )}
    </div>
  );
};
