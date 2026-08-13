export type Language = "bn" | "en";

export type Priority = "low" | "normal" | "high" | "urgent";

export type StudyItemType = 
  | "reading"
  | "mcq"
  | "creative"
  | "short_q"
  | "formula"
  | "revision"
  | "practice_set";

export type StudyItemStatus = 
  | "not_started"
  | "in_progress"
  | "completed"
  | "mastered";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  grade?: string; // e.g., "HSC 2026", "College Year 1"
  language: Language;
  streakCount?: number;
  lastActiveDate?: string;
  targetExam?: string;
  targetGroup?: string;
  dailyGoalHours?: number;
  institution?: string;
  photoUrl?: string;
}

export interface Exam {
  id: string;
  userId: string;
  title: string; // e.g., "HSC Higher Math Paper 1"
  subject: string; // "Higher Math", "Physics", "Chemistry", "ICT"
  examDate: string; // ISO date string YYYY-MM-DD
  totalMarks?: number;
  preparationScore: number; // 0 - 100%
  syllabusSummary?: string;
  targetGrade?: string; // "A+", "GPA 5.0"
  color?: string; // Tailwind color class for badges/cards
  createdAt: string;
  updatedAt: string;
}

export interface StudyItem {
  id: string;
  userId: string;
  examId: string;
  title: string;
  type: StudyItemType;
  chapter?: string;
  topic?: string;
  description?: string;
  priority: Priority;
  status: StudyItemStatus;
  estimatedMinutes?: number;
  materialIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  userId: string;
  examId: string;
  title: string;
  fileType: "image" | "pdf" | "text";
  fileUrl?: string;
  extractedText: string;
  summary?: string;
  topics?: string[];
  concepts?: string[];
  formulas?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OCRExtractionResult {
  title: string;
  chapter?: string;
  topic?: string;
  extractedText: string;
  concepts: string[];
  formulas: string[];
  contentType?: StudyItemType;
  questionsFound: string[];
}

export type QuestionType = "mcq" | "creative" | "short" | "formula" | "mixed";

export interface CreativeSubPart {
  partLabel: string; // "ক (জ্ঞানমূলক)", "খ (অনুধাবনমূলক)", "গ (প্রয়োগমূলক)", "ঘ (উচ্চতর দক্ষতা)"
  partQuestion: string;
  partMarks: number;
  partAnswerGuideline?: string;
}

export interface Question {
  id: string;
  examId?: string;
  type: QuestionType;
  stimulus?: string; // Scenario / উদ্দীপক
  questionText: string;
  options?: string[]; // For MCQ (A, B, C, D)
  correctAnswerIndex?: number; // For MCQ (0..3)
  creativeParts?: CreativeSubPart[];
  explanation?: string; // Step-by-step math derivation / answer
  marks?: number;
  difficulty?: string;
  topic?: string;
  chapter?: string;
  createdAt?: string;
}

export interface GeneratedTest {
  id: string;
  examId: string;
  title: string;
  subject: string;
  topic?: string;
  questionType: QuestionType;
  timeLimitMinutes: number;
  questions: Question[];
  createdAt: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOption?: number;
  writtenAnswer?: string;
  selfGradeMarks?: number;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  testId: string;
  answers: UserAnswer[];
  score: number; // Percentage (0..100)
  totalMarks: number;
  earnedMarks: number;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface MistakeItem {
  id: string;
  userId: string;
  questionId: string;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  explanation: string;
  subject: string;
  topic?: string;
  reviewCount: number;
  mastered: boolean;
  createdAt: string;
}

export interface AITutorMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
