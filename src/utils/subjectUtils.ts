export const DEFAULT_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Higher Mathematics",
  "Biology",
  "ICT",
  "General Science",
  "Bangla",
  "English",
  "Accounting",
  "Finance & Banking",
  "Business Organization",
  "Economics",
  "Civics",
  "History",
  "Geography",
  "Islamic Studies",
  "General Knowledge",
];

export function getCustomSubjects(): string[] {
  try {
    const stored = localStorage.getItem("oddhoyon_custom_subjects");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading custom subjects", e);
  }
  return [];
}

export function saveCustomSubject(newSubject: string): string[] {
  const trimmed = newSubject.trim();
  if (!trimmed) return getCustomSubjects();

  const current = getCustomSubjects();
  if (!current.includes(trimmed) && !DEFAULT_SUBJECTS.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem("oddhoyon_custom_subjects", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving custom subject", e);
    }
    return updated;
  }
  return current;
}

export function getAllSubjects(): string[] {
  const custom = getCustomSubjects();
  const all = [...DEFAULT_SUBJECTS];
  custom.forEach((c) => {
    if (!all.includes(c)) {
      all.push(c);
    }
  });
  return all;
}

export function removeCustomSubject(subjectToDelete: string): string[] {
  const current = getCustomSubjects();
  const updated = current.filter((s) => s.toLowerCase() !== subjectToDelete.toLowerCase());
  try {
    localStorage.setItem("oddhoyon_custom_subjects", JSON.stringify(updated));
  } catch (e) {
    console.error("Error removing custom subject", e);
  }
  return updated;
}

export function getSubjectColor(subject: string): { bg: string; text: string; border: string; dot: string } {
  const sub = subject.toLowerCase();
  if (sub.includes("physics") || sub.includes("পদার্থ")) {
    return { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", dot: "bg-indigo-500" };
  }
  if (sub.includes("chem") || sub.includes("রসায়ন")) {
    return { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" };
  }
  if (sub.includes("math") || sub.includes("গণিত")) {
    return { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" };
  }
  if (sub.includes("bio") || sub.includes("জীব")) {
    return { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800", dot: "bg-rose-500" };
  }
  if (sub.includes("ict") || sub.includes("আইসিটি") || sub.includes("computer")) {
    return { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800", dot: "bg-cyan-500" };
  }
  if (sub.includes("bangla") || sub.includes("বাংলা")) {
    return { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800", dot: "bg-teal-500" };
  }
  if (sub.includes("eng") || sub.includes("ইংরেজি")) {
    return { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-500" };
  }
  return { bg: "bg-stone-100 dark:bg-stone-800", text: "text-stone-700 dark:text-stone-300", border: "border-stone-200 dark:border-stone-700", dot: "bg-stone-500" };
}
