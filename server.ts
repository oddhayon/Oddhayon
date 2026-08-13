import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with higher size limit for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get Gemini Client with proper User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// API Endpoint: Extract Material / OCR Analysis
app.post("/api/extract-material", async (req, res) => {
  try {
    const { imageBase64, mimeType, textInput, language } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are an expert educational AI assistant specialized in Bengali and English curriculum (HSC, SSC, College & University exams).
Analyze the provided material (image or raw text).

Your goal:
1. Extract and transcribe all readable text verbatim with high accuracy.
2. Identify key formulas (e.g. math/physics/chemistry equations) and format them clearly.
3. Identify core concepts and key study points.
4. Detect any practice questions or sample problems mentioned in the content.
5. Generate a clear title and topic name for this study material.

Respond strictly in valid JSON format with the following schema:
{
  "title": "Short descriptive title of the material",
  "chapter": "Chapter name if identifiable",
  "topic": "Topic name",
  "extractedText": "Complete verbatim text extracted from the material",
  "concepts": ["Concept 1", "Concept 2"],
  "formulas": ["Formula 1", "Formula 2"],
  "contentType": "mcq" | "creative" | "formula" | "reading",
  "questionsFound": ["Question 1 found in notes", "Question 2 found in notes"]
}

Target Language for generated title/concepts: ${
      language === "bn" ? "Bengali (বাংলা)" : "English"
    }.
`;

    const contents: any[] = [];

    if (imageBase64 && mimeType) {
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      });
    }

    if (textInput) {
      contents.push({ text: `RAW TEXT NOTES:\n${textInput}` });
    }

    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);

    res.json({
      title: parsed.title || "Extracted Class Notes",
      chapter: parsed.chapter || undefined,
      topic: parsed.topic || undefined,
      extractedText: parsed.extractedText || textInput || "",
      concepts: Array.isArray(parsed.concepts) ? parsed.concepts : [],
      formulas: Array.isArray(parsed.formulas) ? parsed.formulas : [],
      contentType: parsed.contentType || "reading",
      questionsFound: Array.isArray(parsed.questionsFound) ? parsed.questionsFound : [],
    });
  } catch (error: any) {
    console.error("Server Gemini OCR Error:", error?.message || error);
    res.status(500).json({
      error: error?.message || "Failed to process OCR extraction.",
      fallback: {
        title: "Uploaded Notes",
        extractedText: req.body?.textInput || "Extracted content processing completed.",
        concepts: ["Key topic revision", "Board exam preparation"],
        formulas: [],
        contentType: "reading",
        questionsFound: [],
      },
    });
  }
});

// API Endpoint: Generate Question Set
app.post("/api/generate-questions", async (req, res) => {
  try {
    const {
      examId,
      subject,
      topic,
      questionType,
      count,
      difficulty,
      materialsContent,
      timeLimitMinutes,
      language,
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
You are an expert exam setter and professor for ${subject} in ${
      language === "bn" ? "Bengali (বাংলা)" : "English"
    }.
Generate a structured exam question set based on the syllabus topic: "${
      topic || subject
    }".

Question Pattern: ${questionType}
Number of Questions: ${count || 5}
Difficulty Level: ${difficulty || "Medium"}

${
  materialsContent
    ? `Grounding Context / Notes Material:\n${materialsContent.substring(0, 3000)}\n`
    : ""
}

Requirements:
1. For MCQ questions, provide 4 options (A, B, C, D), 0-based index of correct option, and step-by-step mathematical derivation/explanation.
2. For Creative Questions (সৃজনশীল), provide a Scenario (উদ্দীপক - stimulus) and 4 sub-questions (ক-১, খ-২, গ-৩, ঘ-৪ marks) with step-by-step model answer guidelines in explanation.
3. Keep the tone academic, encouraging, and accurate to Board / University standards.

Respond strictly in valid JSON format matching this schema:
{
  "title": "Exam Title e.g., ${subject} - ${topic || "Practice Test"}",
  "questions": [
    {
      "id": "q_1",
      "type": "mcq" | "creative" | "short" | "formula",
      "stimulus": "Optional Scenario/ উদ্দীপক for creative questions",
      "questionText": "Question stem text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "marks": 1,
      "explanation": "Step-by-step mathematical derivation or solution explanation",
      "creativeParts": [
        {
          "partLabel": "ক (জ্ঞানমূলক)",
          "partQuestion": "Sub-question text",
          "partMarks": 1
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);

    res.json({
      id: `test_${Date.now()}`,
      examId,
      title: parsed.title || `${subject} Model Test`,
      subject,
      topic,
      questionType,
      timeLimitMinutes: timeLimitMinutes || 15,
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Server Gemini Question Generator Error:", error?.message || error);
    res.status(500).json({
      error: error?.message || "Failed to generate test questions.",
      fallback: {
        id: `test_fallback_${Date.now()}`,
        examId: req.body?.examId || "",
        title: `${req.body?.subject || "Subject"} AI Practice Quiz`,
        subject: req.body?.subject || "Physics",
        topic: req.body?.topic || "Practice",
        questionType: req.body?.questionType || "mcq",
        timeLimitMinutes: req.body?.timeLimitMinutes || 15,
        questions: [
          {
            id: "q_f1",
            type: "mcq",
            questionText:
              req.body?.language === "bn"
                ? "A একটি ৩x৩ ম্যাট্রিক্স এবং det(A) = 4 হলে det(3A) এর মান কত?"
                : "If A is a 3x3 matrix with det(A) = 4, what is det(3A)?",
            options: ["12", "36", "108", "81"],
            correctAnswerIndex: 2,
            marks: 1,
            explanation:
              req.body?.language === "bn"
                ? "সূত্র: det(kA) = k^n * det(A)। এখানে n=3, তাই det(3A) = 3^3 * 4 = 27 * 4 = 108।"
                : "Formula: det(kA) = k^n * det(A). For 3x3, det(3A) = 3^3 * 4 = 108.",
          },
        ],
        createdAt: new Date().toISOString(),
      },
    });
  }
});

// API Endpoint: AI Tutor
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { prompt, contextSubject, language } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
You are an expert, encouraging AI Study Tutor specialized in Bengali and English curriculum (HSC, SSC, Admission Tests, College & University courses).
Your goal is to help students understand complex concepts, solve step-by-step math problems, derive physics formulas, and clarify doubts.

Guidelines:
- Explain clearly with step-by-step derivation when solving mathematical or physical problems.
- Use clear markdown formatting (bolding, lists, code blocks for equations).
- Primary Language: ${language === "bn" ? "Bengali (বাংলা) mixed with English mathematical terms" : "English"}.
- Context Subject: ${contextSubject || "General Academic Prep"}.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply:
        response.text ||
        (language === "bn" ? "উত্তর তৈরি করা সম্ভব হয়নি।" : "Failed to generate answer."),
    });
  } catch (error: any) {
    console.error("Server AI Tutor Error:", error?.message || error);
    res.status(500).json({
      error: error?.message || "Failed to query AI Tutor.",
      reply:
        req.body?.language === "bn"
          ? "দুঃখিত, বর্তমানে এআই সার্ভারে সংযোগ পাওয়া যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।"
          : "Sorry, unable to connect to the AI server right now. Please try again later.",
    });
  }
});

// Start Express and Vite dev or production server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
