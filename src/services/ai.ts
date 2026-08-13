import { OCRExtractionResult, GeneratedTest, Language, QuestionType } from "../types";

export const extractMaterialWithAI = async (options: {
  imageBase64?: string;
  mimeType?: string;
  textInput?: string;
  language: Language;
}): Promise<OCRExtractionResult> => {
  try {
    const res = await fetch("/api/extract-material", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.fallback) {
        return data.fallback;
      }
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    const data: OCRExtractionResult = await res.json();
    return data;
  } catch (err: any) {
    console.error("Client OCR Extraction Fetch Error:", err);
    return {
      title: "Uploaded Notes",
      extractedText: options.textInput || "Extracted content processing complete.",
      concepts: ["Key topic revision", "Board exam preparation"],
      formulas: [],
      contentType: "reading",
      questionsFound: [],
    };
  }
};

export const generateQuestionsWithAI = async (options: {
  examId: string;
  subject: string;
  topic?: string;
  questionType: QuestionType;
  count: number;
  difficulty: string;
  materialsContent?: string;
  timeLimitMinutes: number;
  language: Language;
}): Promise<GeneratedTest> => {
  try {
    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.fallback) {
        return data.fallback;
      }
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    const data: GeneratedTest = await res.json();
    return data;
  } catch (err: any) {
    console.error("Client Question Generator Fetch Error:", err);
    return {
      id: `test_fallback_${Date.now()}`,
      examId: options.examId,
      title: `${options.subject} AI Practice Quiz`,
      subject: options.subject,
      topic: options.topic,
      questionType: options.questionType,
      timeLimitMinutes: options.timeLimitMinutes,
      questions: [
        {
          id: "q_f1",
          type: "mcq",
          questionText:
            options.language === "bn"
              ? "A একটি ৩x৩ ম্যাট্রিক্স এবং det(A) = 4 হলে det(3A) এর মান কত?"
              : "If A is a 3x3 matrix with det(A) = 4, what is det(3A)?",
          options: ["12", "36", "108", "81"],
          correctAnswerIndex: 2,
          marks: 1,
          explanation:
            options.language === "bn"
              ? "সূত্র: det(kA) = k^n * det(A)। এখানে n=3, তাই det(3A) = 3^3 * 4 = 27 * 4 = 108।"
              : "Formula: det(kA) = k^n * det(A). For 3x3, det(3A) = 3^3 * 4 = 108.",
        },
      ],
      createdAt: new Date().toISOString(),
    };
  }
};

export const askAITutor = async (options: {
  prompt: string;
  contextSubject?: string;
  language: Language;
}): Promise<string> => {
  try {
    const res = await fetch("/api/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.reply) {
        return data.reply;
      }
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return (
      data.reply ||
      (options.language === "bn"
        ? "উত্তর তৈরি করা সম্ভব হয়নি।"
        : "Failed to generate answer.")
    );
  } catch (err: any) {
    console.error("Client AI Tutor Fetch Error:", err);
    return options.language === "bn"
      ? "দুঃখিত, এই মুহূর্তে উত্তর তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
      : "Sorry, an error occurred while connecting to AI Tutor. Please try again.";
  }
};
