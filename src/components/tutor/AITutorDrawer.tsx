import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  HelpCircle,
  BookOpen
} from "lucide-react";
import { AITutorMessage, Language } from "../../types";
import { askAITutor } from "../../services/ai";

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialPrompt?: string;
  contextSubject?: string;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  language,
  initialPrompt,
  contextSubject,
}) => {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text:
        language === "bn"
          ? "হ্যালো! আমি আপনার এআই স্টাডি টিউটর। যেকোনো কঠিন অংক, সূত্র বা প্রশ্ন নিয়ে আমায় জিজ্ঞেস করুন!"
          : "Hello! I am your AI Study Tutor. Ask me any math formula, physics problem or study question!",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: AITutorMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const replyText = await askAITutor({
        prompt: textToSend,
        contextSubject,
        language,
      });

      const aiMsg: AITutorMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("AI Tutor Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: "ai",
          text:
            language === "bn"
              ? "দুঃখিত, উত্তর তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
              : "Sorry, failed to generate explanation. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    language === "bn"
      ? "গণিত সূত্রগুলো সহজে মনে রাখার টেকনিক দাও"
      : "Give me memory tricks for math formulas",
    language === "bn"
      ? "এইচএসসি বোর্ডের সৃজনশীল প্রশ্নের ধাপগুলো বুঝিয়ে বলো"
      : "Explain standard board question structure",
    language === "bn"
      ? "ফিজিক্স ভেক্টর চ্যাপ্টারের মূল ফর্মুলা ছক করে দাও"
      : "Summarize Physics Vectors formulas",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-16 px-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {language === "bn" ? "এআই স্টাডি টিউটর" : "AI Study Tutor"}
            </h3>
            <p className="text-[10px] text-stone-500">
              {contextSubject ? `Subject: ${contextSubject}` : "Gemini 2.5 Assistant"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-tr-none font-medium"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none font-sans whitespace-pre-wrap font-mono"
                }`}
              >
                {msg.text}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span>{language === "bn" ? "টিউটর চিন্তা করছে..." : "Tutor thinking..."}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Presets */}
      <div className="p-2 border-t border-stone-100 dark:border-stone-800 flex gap-1.5 overflow-x-auto scrollbar-none bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
        {presets.map((preset, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(preset)}
            className="px-2.5 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-[10px] text-stone-600 dark:text-stone-300 hover:border-indigo-400 whitespace-nowrap transition-colors"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "bn"
                ? "আপনার প্রশ্ন লিখুন (যেমন: সূত্রের প্রুফ বুঝিয়ে বল)..."
                : "Ask tutor anything..."
            }
            className="flex-1 px-3.5 py-2 bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-indigo-500 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
