import { Exam, StudyItem, Material, Question } from "../types";

export const DEFAULT_USER_ID = "guest_student_123";

export const INITIAL_EXAMS: Exam[] = [
  {
    id: "exam_math_01",
    userId: DEFAULT_USER_ID,
    title: "Higher Mathematics Final Exam",
    subject: "Higher Mathematics",
    examDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    preparationScore: 68,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "exam_physics_02",
    userId: DEFAULT_USER_ID,
    title: "Physics 1st Paper - Mechanics & Waves",
    subject: "Physics",
    examDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    preparationScore: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_STUDY_ITEMS: StudyItem[] = [
  {
    id: "item_math_01",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Chapter 1 — Creative Question 2 (Algebraic Expressions)",
    type: "creative",
    chapter: "Chapter 1",
    topic: "Algebraic Expressions & Matrices",
    description: "srijonshil question on matrix determinant and solution",
    priority: "high",
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item_math_02",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Chapter 1 — Creative Question 4 (Determinant & Cramer's Rule)",
    type: "creative",
    chapter: "Chapter 1",
    topic: "Matrices & Determinants",
    description: "Solve systems of linear equations using Cramer's Rule",
    priority: "normal",
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item_math_03",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Chapter 1 — MCQ 1–20",
    type: "mcq",
    chapter: "Chapter 1",
    topic: "Matrices & Determinants MCQ Practice",
    description: "Fast precision solving for order of matrices & properties",
    priority: "high",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item_math_04",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Chapter 2 — Short Question 5 (Trigonometric Functions)",
    type: "short_q",
    chapter: "Chapter 2",
    topic: "Trigonometric Ratios & Identity Proofs",
    description: "Prove identities and boundary angle conditions",
    priority: "high",
    status: "not_started",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "item_math_05",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Trigonometry Formula Sheet Revision",
    type: "formula",
    chapter: "Chapter 2",
    topic: "Trigonometry",
    description: "sin(A+B), cos(A+B), tan(2A) and double angle transformations",
    priority: "normal",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: "mat_math_notes_01",
    userId: DEFAULT_USER_ID,
    examId: "exam_math_01",
    title: "Matrix & Determinants Class Lecture Notes",
    fileType: "text",
    extractedText: `ম্যাট্রিক্স ও নির্ণায়ক (Matrices & Determinants)
১. বর্গ ম্যাট্রিক্স (Square Matrix): যে ম্যাট্রিক্সের সারি (row) এবং কলাম (column) সংখ্যা সমান।
২. ম্যাট্রিক্সের গুণন (Matrix Multiplication): A(m×n) এবং B(n×p) হলে AB সম্ভব, যার মাত্রা হবে m×p।
৩. বিপরীত ম্যাট্রিক্স (Inverse Matrix): A^-1 = (1 / |A|) * adj(A), যেখানে |A| ≠ 0।
৪. ক্র্যামারের নিয়ম (Cramer's Rule): x = Dx/D, y = Dy/D, z = Dz/D।`,
    summary: "Comprehensive guide on Square Matrices, Inverse Matrices, Singular Condition and Cramer's Rule.",
    topics: ["Matrix Multiplication", "Inverse Matrix", "Cramer's Rule"],
    concepts: ["Singular Matrix condition |A|=0", "Cramer's Rule for linear equations"],
    formulas: ["A^-1 = adj(A) / |A|", "Dx = det(A_x)", "x = Dx/D"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q_01",
    examId: "exam_math_01",
    type: "mcq",
    questionText: "A একটি ৩×৩ আকারের ব্যতিক্রমী (Singular) ম্যাট্রিক্স হলে |A|-এর মান কত?",
    options: ["1", "0", "-1", "অসীম"],
    correctAnswerIndex: 1,
    explanation: "ব্যতিক্রমী ম্যাট্রিক্সের (Singular Matrix) নির্ণায়কের মান সর্বদা ০ (শূন্য) হয়।",
    difficulty: "easy",
    topic: "Matrices & Determinants",
    chapter: "Chapter 1",
    createdAt: new Date().toISOString(),
  },
];
