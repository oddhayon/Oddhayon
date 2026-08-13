import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Upload, FileText, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";
import { Exam, Language, OCRExtractionResult } from "../../types";
import { extractMaterialWithAI } from "../../services/ai";

interface MaterialUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  exams: Exam[];
  defaultExamId?: string;
  language: Language;
  onOCRComplete: (examId: string, title: string, ocrData: OCRExtractionResult) => void;
}

export const MaterialUploadModal: React.FC<MaterialUploadModalProps> = ({
  isOpen,
  onClose,
  exams,
  defaultExamId,
  language,
  onOCRComplete,
}) => {
  const [examId, setExamId] = useState(defaultExamId || (exams[0]?.id || ""));
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Raw text input state
  const [textInput, setTextInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let imageBase64: string | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (activeTab === "file" && selectedFile) {
        mimeType = selectedFile.type || "image/jpeg";
        const buffer = await selectedFile.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        imageBase64 = btoa(binary);
      }

      if (!imageBase64 && !textInput.trim()) {
        throw new Error(
          language === "bn"
            ? "অনুগ্রহ করে একটি ছবি ফাইল সিলেক্ট করুন অথবা টেক্সট ইনপুট দিন।"
            : "Please select an image file or provide text notes."
        );
      }

      const ocrResult = await extractMaterialWithAI({
        imageBase64,
        mimeType,
        textInput: activeTab === "text" ? textInput : undefined,
        language,
      });

      onOCRComplete(
        examId || (exams[0]?.id || ""),
        title.trim() || ocrResult.title || "Uploaded Material",
        ocrResult
      );

      // Reset
      setSelectedFile(null);
      setFilePreview(null);
      setTextInput("");
      setTitle("");
      onClose();
    } catch (err: any) {
      console.error("Upload & OCR error:", err);
      setError(err.message || "Failed to process material with AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "bn" ? "লেকচার ফাইল / নোট আপলোড (OCR & AI)" : "Upload Material / Notes"}
      subtitle={
        language === "bn"
          ? "ছবি বা টেক্সট নোট আপলোড করুন — Gemini AI স্বয়ংক্রিয়ভাবে ফর্মুলা ও টপিক এক্সট্র্যাক্ট করবে"
          : "Upload images of book pages, class notes or paste text to extract formulas and key concepts"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "পরীক্ষা নির্বাচন করুন *" : "Select Exam *"}
          </label>
          <select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.subject})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            {language === "bn" ? "নোটের শিরোনাম (Material Title - Optional)" : "Material Title (Optional)"}
          </label>
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "যেমন: Chapter 1 Matrices Class Notes"
                : "e.g., Chapter 1 Matrices Class Notes"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>

        {/* File vs Text Tabs */}
        <div className="flex border border-stone-200 dark:border-stone-700 rounded-xl p-1 bg-stone-100 dark:bg-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "file"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "ছবি আপলোড" : "Upload Image/Photo"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "text"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "টেক্সট টাইপ / পেস্ট" : "Paste Text"}</span>
          </button>
        </div>

        {activeTab === "file" ? (
          <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-stone-400 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              id="material-file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="material-file-upload" className="cursor-pointer block">
              {filePreview ? (
                <div className="space-y-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl object-contain shadow-xs"
                  />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {selectedFile?.name}
                  </p>
                  <p className="text-[10px] text-stone-400">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {language === "bn"
                      ? "বইয়ের পাতা, নোটিবুক বা প্রশ্নপত্রের ছবি সিলেক্ট করুন"
                      : "Click to browse or drag and drop image photo"}
                  </p>
                  <p className="text-[10px] text-stone-400">PNG, JPG, WEBP up to 20MB</p>
                </div>
              )}
            </label>
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              placeholder={
                language === "bn"
                  ? "আপনার লেকচার বা অধ্যায়ের টেক্সট নোট এখানে পেস্ট করুন..."
                  : "Paste lecture text, notes or book chapter paragraphs here..."
              }
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
          >
            {language === "bn" ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>{language === "bn" ? "AI প্রসেসিং চলছে..." : "Processing with Gemini..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{language === "bn" ? "AI দিয়ে এনালাইজ করুন" : "Analyze with AI"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
