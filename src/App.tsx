import React, { useState, useEffect } from "react";
import { UserProfile, Language, Exam, StudyItem, StudyItemStatus, Material, GeneratedTest, ExamAttempt, MistakeItem, OCRExtractionResult } from "./types";
import { initialExams, initialStudyItems, initialMaterials, initialMistakes, initialUser } from "./mockData";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { AuthPage } from "./components/auth/AuthPage";
import { WelcomeOnboardingScreen } from "./components/auth/WelcomeOnboardingScreen";
import {
  getUserProfile,
  updateUserProfile,
  subscribeToUserExams,
  subscribeToUserStudyItems,
  subscribeToUserMaterials,
  subscribeToUserMistakes,
  saveExamToFirestore,
  deleteExamFromFirestore,
  saveStudyItemToFirestore,
  deleteStudyItemFromFirestore,
  saveMaterialToFirestore,
  deleteMaterialFromFirestore,
  saveMistakeToFirestore,
  deleteMistakeFromFirestore,
} from "./services/firestore";

// Layout components
import { Navbar } from "./components/layout/Navbar";
import { Sidebar, ActiveTab } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";

// View components
import { DashboardView } from "./components/dashboard/DashboardView";
import { ExamListView } from "./components/exams/ExamListView";
import { ExamWorkspaceView } from "./components/exams/ExamWorkspaceView";
import { StudyItemListView } from "./components/studyItems/StudyItemListView";
import { MaterialListView } from "./components/materials/MaterialListView";
import { PracticeHubView } from "./components/practice/PracticeHubView";
import { ExamEngineView } from "./components/practice/ExamEngineView";
import { TestResultView } from "./components/practice/TestResultView";
import { MistakeBookView } from "./components/mistakes/MistakeBookView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { ProfileView } from "./components/profile/ProfileView";
import { SettingsView } from "./components/settings/SettingsView";

// Modals & Drawers
import { CreateExamModal } from "./components/exams/CreateExamModal";
import { CreateStudyItemModal } from "./components/studyItems/CreateStudyItemModal";
import { BulkCreateStudyItemModal } from "./components/studyItems/BulkCreateStudyItemModal";
import { MaterialUploadModal } from "./components/materials/MaterialUploadModal";
import { OCRReviewModal } from "./components/materials/OCRReviewModal";
import { GenerateTestModal } from "./components/practice/GenerateTestModal";
import { AITutorDrawer } from "./components/tutor/AITutorDrawer";
import { StreakCalendarModal } from "./components/common/StreakCalendarModal";
import { LoadingScreen } from "./components/common/LoadingScreen";

const LOCAL_STORAGE_KEY = "oddhoyon_app_state_v1";

export function App() {
  // Auth state
  const [authUser, setAuthUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem("oddhoyon_is_guest") === "true";
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [splashTimeout, setSplashTimeout] = useState(true);
  const [showWelcomeOnboarding, setShowWelcomeOnboarding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashTimeout(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation & Language
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [language, setLanguage] = useState<Language>("bn");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // App Data State
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [studyItems, setStudyItems] = useState<StudyItem[]>(initialStudyItems);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [mistakes, setMistakes] = useState<MistakeItem[]>(initialMistakes);

  // Active Workspace / Active Exam Focus
  const [selectedExamWorkspace, setSelectedExamWorkspace] = useState<Exam | null>(null);

  // Timed Exam Engine state
  const [activeEngineTest, setActiveEngineTest] = useState<GeneratedTest | null>(null);
  const [activeTestResult, setActiveTestResult] = useState<{
    test: GeneratedTest;
    attempt: ExamAttempt;
  } | null>(null);

  // Modal States
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isAddStudyItemOpen, setIsAddStudyItemOpen] = useState(false);
  const [isBulkStudyItemOpen, setIsBulkStudyItemOpen] = useState(false);
  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [isGenerateTestOpen, setIsGenerateTestOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isStreakCalendarOpen, setIsStreakCalendarOpen] = useState(false);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);

  // Pending OCR Review state
  const [pendingOCR, setPendingOCR] = useState<{
    examId: string;
    title: string;
    ocrData: OCRExtractionResult;
  } | null>(null);

  // Target exam ID for modal pre-selection
  const [targetModalExamId, setTargetModalExamId] = useState<string | undefined>(undefined);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setAuthUser(firebaseUser);
        setIsGuest(false);
        localStorage.removeItem("oddhoyon_is_guest");
        const profile = await getUserProfile(firebaseUser.uid);
        const savedPhoto = localStorage.getItem("oddhoyon_profile_photo") || profile?.photoUrl || "";
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || profile?.name || "শিক্ষার্থী",
          email: firebaseUser.email || profile?.email || "",
          grade: profile?.grade || "HSC 2026 Batch",
          language: "bn",
          photoUrl: savedPhoto,
        });

        // Show welcome onboarding screen only on first time login
        const hasSeenOnboarding = localStorage.getItem(`oddhoyon_welcome_seen_${firebaseUser.uid}`);
        if (!hasSeenOnboarding) {
          setShowWelcomeOnboarding(true);
        } else {
          setShowWelcomeOnboarding(false);
        }
      } else {
        setAuthUser(null);
        const isCurrentlyGuest = localStorage.getItem("oddhoyon_is_guest") === "true";
        if (isCurrentlyGuest) {
          setIsGuest(true);
          setUser(initialUser);
          
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          let loadedExams = initialExams;
          let loadedStudyItems = initialStudyItems;
          let loadedMaterials = initialMaterials;
          let loadedMistakes = initialMistakes;

          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.exams) loadedExams = parsed.exams;
              if (parsed.studyItems) loadedStudyItems = parsed.studyItems;
              if (parsed.materials) loadedMaterials = parsed.materials;
              if (parsed.mistakes) loadedMistakes = parsed.mistakes;
            } catch(e) {}
          }

          setExams(loadedExams);
          setStudyItems(loadedStudyItems);
          setMaterials(loadedMaterials);
          setMistakes(loadedMistakes);
        } else {
          setIsGuest(false);
          setUser(initialUser);
          setExams([]);
          setStudyItems([]);
          setMaterials([]);
          setMistakes([]);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore Real-Time Data when logged in
  useEffect(() => {
    if (!authUser) return;

    const unSubExams = subscribeToUserExams(authUser.uid, (list) => {
      setExams(list);
    });
    const unSubItems = subscribeToUserStudyItems(authUser.uid, (list) => {
      setStudyItems(list);
    });
    const unSubMats = subscribeToUserMaterials(authUser.uid, (list) => {
      setMaterials(list);
    });
    const unSubMistakes = subscribeToUserMistakes(authUser.uid, (list) => {
      setMistakes(list);
    });

    return () => {
      unSubExams();
      unSubItems();
      unSubMats();
      unSubMistakes();
    };
  }, [authUser]);

  // Load from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.generatedTests) setGeneratedTests(parsed.generatedTests);
        if (parsed.attempts) setAttempts(parsed.attempts);
        if (parsed.language) setLanguage(parsed.language);
      } catch (e) {
        console.error("Failed to parse local state", e);
      }
    }
  }, []);

  // Save generated tests & attempts & guest data to Local Storage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        generatedTests,
        attempts,
        language,
        ...(isGuest ? { exams, studyItems, materials, mistakes } : {}),
      })
    );
  }, [generatedTests, attempts, language, isGuest, exams, studyItems, materials, mistakes]);

  // Recalculate Exam Preparation Scores when Study Items change
  useEffect(() => {
    setExams((prevExams) =>
      prevExams.map((ex) => {
        const itemsForExam = studyItems.filter((item) => item.examId === ex.id);
        if (itemsForExam.length === 0) return ex;

        const completedCount = itemsForExam.filter(
          (item) => item.status === "completed" || item.status === "mastered"
        ).length;

        const score = Math.round((completedCount / itemsForExam.length) * 100);
        return { ...ex, preparationScore: score };
      })
    );
  }, [studyItems]);

  // Handle profile update
  const handleUpdateProfile = async (updatedData: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    if (authUser) {
      await updateUserProfile(authUser.uid, updatedData);
    }
  };

  // Global Search results calculation
  const searchResults = {
    exams: globalSearchQuery.trim()
      ? exams.filter(
          (e) =>
            e.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
            e.subject.toLowerCase().includes(globalSearchQuery.toLowerCase())
        )
      : [],
    studyItems: globalSearchQuery.trim()
      ? studyItems.filter(
          (s) =>
            s.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
            s.chapter?.toLowerCase().includes(globalSearchQuery.toLowerCase())
        )
      : [],
    materials: globalSearchQuery.trim()
      ? materials.filter((m) =>
          m.title.toLowerCase().includes(globalSearchQuery.toLowerCase())
        )
      : [],
    questions: [],
  };

  // Handlers for Study Items
  const handleToggleTaskStatus = (item: StudyItem) => {
    const nextStatus: StudyItemStatus =
      item.status === "completed"
        ? "not_started"
        : item.status === "not_started"
        ? "in_progress"
        : "completed";
    const updated: StudyItem = { ...item, status: nextStatus, updatedAt: new Date().toISOString() };

    setStudyItems((prev) =>
      prev.map((s) => (s.id === item.id ? updated : s))
    );

    if (authUser) {
      saveStudyItemToFirestore(updated);
    }
  };

  const handleSaveStudyItem = (newItem: StudyItem) => {
    const itemWithUser = { ...newItem, userId: authUser?.uid || "guest" };
    setStudyItems((prev) => [itemWithUser, ...prev]);
    if (authUser) {
      saveStudyItemToFirestore(itemWithUser);
    }
  };

  const handleSaveBulkStudyItems = (newItems: StudyItem[]) => {
    const itemsWithUser = newItems.map((i) => ({ ...i, userId: authUser?.uid || "guest" }));
    setStudyItems((prev) => [...itemsWithUser, ...prev]);
    if (authUser) {
      itemsWithUser.forEach((i) => saveStudyItemToFirestore(i));
    }
  };

  const handleDeleteStudyItem = (itemId: string) => {
    setStudyItems((prev) => prev.filter((i) => i.id !== itemId));
    if (authUser) {
      deleteStudyItemFromFirestore(itemId);
    }
  };

  // Handlers for Exams
  const handleSaveExam = (newExam: Exam) => {
    const examWithUser = { ...newExam, userId: authUser?.uid || "guest" };
    setExams((prev) => [examWithUser, ...prev]);
    if (authUser) {
      saveExamToFirestore(examWithUser);
    }
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    setStudyItems((prev) => prev.filter((i) => i.examId !== examId));
    setMaterials((prev) => prev.filter((m) => m.examId !== examId));
    if (selectedExamWorkspace?.id === examId) {
      setSelectedExamWorkspace(null);
    }
    if (authUser) {
      deleteExamFromFirestore(examId);
    }
  };

  // Handlers for Materials & OCR
  const handleOCRComplete = (examId: string, title: string, ocrData: OCRExtractionResult) => {
    setPendingOCR({ examId, title, ocrData });
  };

  const handleConfirmSaveMaterial = (material: Material, autoCreatedItems: StudyItem[]) => {
    const matWithUser = { ...material, userId: authUser?.uid || "guest" };
    setMaterials((prev) => [matWithUser, ...prev]);
    if (authUser) {
      saveMaterialToFirestore(matWithUser);
    }

    if (autoCreatedItems.length > 0) {
      const itemsWithUser = autoCreatedItems.map((i) => ({ ...i, userId: authUser?.uid || "guest" }));
      setStudyItems((prev) => [...itemsWithUser, ...prev]);
      if (authUser) {
        itemsWithUser.forEach((i) => saveStudyItemToFirestore(i));
      }
    }
    setPendingOCR(null);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    if (authUser) {
      deleteMaterialFromFirestore(materialId);
    }
  };

  // Handlers for Practice & Timed Exam Engine
  const handleTestGenerated = (newTest: GeneratedTest) => {
    setGeneratedTests((prev) => [newTest, ...prev]);
    // Auto start the generated test
    setActiveEngineTest(newTest);
  };

  const handleFinishTest = (attempt: ExamAttempt) => {
    setAttempts((prev) => [attempt, ...prev]);
    if (activeEngineTest) {
      setActiveTestResult({ test: activeEngineTest, attempt });
    }
    setActiveEngineTest(null);
  };

  // Handlers for Mistakes
  const handleSaveMistake = (mistake: MistakeItem) => {
    const mistakeWithUser = { ...mistake, userId: authUser?.uid || "guest" };
    setMistakes((prev) => {
      if (prev.some((m) => m.questionId === mistakeWithUser.questionId)) return prev;
      return [mistakeWithUser, ...prev];
    });
    if (authUser) {
      saveMistakeToFirestore(mistakeWithUser);
    }
    alert(
      language === "bn"
        ? "প্রশ্নটি সফলভাবে 'ভুল উত্তর ব্যাংকে' সংরক্ষণ করা হয়েছে!"
        : "Saved to Mistake Book!"
    );
  };

  const handleToggleMistakeMastered = (mistakeId: string) => {
    setMistakes((prev) =>
      prev.map((m) => {
        if (m.id === mistakeId) {
          const updated = { ...m, mastered: !m.mastered };
          if (authUser) saveMistakeToFirestore(updated);
          return updated;
        }
        return m;
      })
    );
  };

  const handleDeleteMistake = (mistakeId: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== mistakeId));
    if (authUser) {
      deleteMistakeFromFirestore(mistakeId);
    }
  };

  // Tutor trigger
  const handleOpenTutorWithPrompt = (promptText: string) => {
    setTutorInitialPrompt(promptText);
    setIsAITutorOpen(true);
  };

  // Reset Data
  const handleResetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setExams([]);
    setStudyItems([]);
    setMaterials([]);
    setMistakes([]);
    setGeneratedTests([]);
    setAttempts([]);
    setSelectedExamWorkspace(null);
    alert(
      language === "bn" ? "সকল ডাটা রিসেট সম্পন্ন হয়েছে।" : "Application data reset successfully."
    );
  };

  // Show Loading Screen while Checking Auth State or Splash Timeout
  if (authLoading || splashTimeout) {
    return <LoadingScreen />;
  }

  // If Not Authenticated and Not Guest, Render Minimalist Sign Up / Sign In Page
  if (!authUser && !isGuest) {
    return (
      <AuthPage
        onSuccess={() => {
          setIsGuest(false);
          localStorage.removeItem("oddhoyon_is_guest");
          setShowWelcomeOnboarding(true);
          setActiveTab("dashboard");
        }}
        onContinueAsGuest={() => {
          setIsGuest(true);
          localStorage.setItem("oddhoyon_is_guest", "true");
          setUser({
            ...initialUser,
            name: "গেস্ট শিক্ষার্থী",
            email: "guest@oddhoyon.app",
          });
          setExams(initialExams);
          setStudyItems(initialStudyItems);
          setMaterials(initialMaterials);
          setMistakes(initialMistakes);
          setActiveTab("dashboard");
        }}
      />
    );
  }

  // Show Post-Login Welcome Onboarding Screen with Mascot & "চলো শুরু করি" button (only for first time)
  if (showWelcomeOnboarding) {
    return (
      <WelcomeOnboardingScreen
        user={user}
        onStart={() => {
          if (authUser?.uid) {
            localStorage.setItem(`oddhoyon_welcome_seen_${authUser.uid}`, "true");
          }
          setShowWelcomeOnboarding(false);
        }}
      />
    );
  }

  // If inside Timed Exam Engine, render clean Focus Mode view
  if (activeEngineTest) {
    return (
      <ExamEngineView
        test={activeEngineTest}
        language={language}
        onFinishTest={handleFinishTest}
        onCancelTest={() => setActiveEngineTest(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-['Hind_Siliguri'] transition-colors selection:bg-stone-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        language={language}
        onLanguageChange={setLanguage}
        onOpenTutor={() => {
          setTutorInitialPrompt(undefined);
          setIsAITutorOpen(true);
        }}
        onOpenProfile={() => {
          setActiveTab("profile");
          setSelectedExamWorkspace(null);
          setActiveTestResult(null);
        }}
        onOpenStreakCalendar={() => setIsStreakCalendarOpen(true)}
        globalSearchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        searchResults={searchResults}
        onSelectSearchResult={(type, item) => {
          if (type === "exam") {
            setSelectedExamWorkspace(item);
            setActiveTab("exams");
          } else if (type === "studyItem") {
            setActiveTab("study_items");
          } else if (type === "material") {
            setActiveTab("materials");
          }
          setGlobalSearchQuery("");
        }}
        onSignOut={() => {
          auth.signOut();
          setAuthUser(null);
          setIsGuest(false);
          localStorage.removeItem("oddhoyon_is_guest");
        }}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-0 sm:px-4 lg:px-8">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedExamWorkspace(null);
            setActiveTestResult(null);
          }}
          language={language}
          onQuickAddStudyItem={() => {
            setTargetModalExamId(undefined);
            setIsAddStudyItemOpen(true);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTestResult ? (
            <TestResultView
              test={activeTestResult.test}
              attempt={activeTestResult.attempt}
              language={language}
              onBackToDashboard={() => setActiveTestResult(null)}
              onSaveMistake={handleSaveMistake}
              onAskTutorAboutQuestion={(qText) => handleOpenTutorWithPrompt(`Explain this question: ${qText}`)}
            />
          ) : selectedExamWorkspace ? (
            <ExamWorkspaceView
              exam={selectedExamWorkspace}
              studyItems={studyItems.filter((s) => s.examId === selectedExamWorkspace.id)}
              materials={materials.filter((m) => m.examId === selectedExamWorkspace.id)}
              language={language}
              onBack={() => setSelectedExamWorkspace(null)}
              onOpenAddStudyItem={(exId) => {
                setTargetModalExamId(exId);
                setIsAddStudyItemOpen(true);
              }}
              onOpenBulkCreate={(exId) => {
                setTargetModalExamId(exId);
                setIsBulkStudyItemOpen(true);
              }}
              onOpenUploadMaterial={(exId) => {
                setTargetModalExamId(exId);
                setIsUploadMaterialOpen(true);
              }}
              onOpenGenerateTest={(exId) => {
                setTargetModalExamId(exId);
                setIsGenerateTestOpen(true);
              }}
              onToggleStatus={handleToggleTaskStatus}
              onDeleteStudyItem={handleDeleteStudyItem}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardView
                  user={user}
                  exams={exams}
                  todayTasks={studyItems}
                  language={language}
                  onLanguageChange={setLanguage}
                  onOpenStreakCalendar={() => setIsStreakCalendarOpen(true)}
                  onSelectExam={(ex) => setSelectedExamWorkspace(ex)}
                  onOpenCreateExam={() => setIsCreateExamOpen(true)}
                  onOpenAddStudyItem={() => setIsAddStudyItemOpen(true)}
                  onOpenUploadMaterial={() => setIsUploadMaterialOpen(true)}
                  onOpenGenerateTest={() => setIsGenerateTestOpen(true)}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === "exams" && (
                <ExamListView
                  exams={exams}
                  language={language}
                  onSelectExam={(ex) => setSelectedExamWorkspace(ex)}
                  onOpenCreateExam={() => setIsCreateExamOpen(true)}
                  onOpenCreateModal={() => setIsCreateExamOpen(true)}
                  onDeleteExam={handleDeleteExam}
                />
              )}

              {activeTab === "study_items" && (
                <StudyItemListView
                  studyItems={studyItems}
                  exams={exams}
                  language={language}
                  onOpenAddStudyItem={() => setIsAddStudyItemOpen(true)}
                  onOpenCreateModal={() => setIsAddStudyItemOpen(true)}
                  onOpenBulkCreate={() => setIsBulkStudyItemOpen(true)}
                  onOpenBulkCreateModal={() => setIsBulkStudyItemOpen(true)}
                  onToggleStatus={handleToggleTaskStatus}
                  onDeleteStudyItem={handleDeleteStudyItem}
                />
              )}

              {activeTab === "materials" && (
                <MaterialListView
                  materials={materials}
                  exams={exams}
                  language={language}
                  onOpenUploadMaterial={() => setIsUploadMaterialOpen(true)}
                  onDeleteMaterial={handleDeleteMaterial}
                  onGenerateTestFromMaterial={(m) => {
                    setTargetModalExamId(m.examId);
                    setIsGenerateTestOpen(true);
                  }}
                />
              )}

              {activeTab === "practice" && (
                <PracticeHubView
                  tests={generatedTests}
                  attempts={attempts}
                  exams={exams}
                  language={language}
                  onOpenGenerateTest={() => setIsGenerateTestOpen(true)}
                  onStartExam={(test) => setActiveEngineTest(test)}
                  onViewAttempt={(test, attempt) => setActiveTestResult({ test, attempt })}
                />
              )}

              {activeTab === "mistakes" && (
                <MistakeBookView
                  mistakes={mistakes}
                  language={language}
                  onToggleMastered={handleToggleMistakeMastered}
                  onDeleteMistake={handleDeleteMistake}
                  onAskTutor={handleOpenTutorWithPrompt}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsView
                  exams={exams}
                  studyItems={studyItems}
                  attempts={attempts}
                  language={language}
                />
              )}

              {activeTab === "profile" && (
                <ProfileView
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  exams={exams}
                  studyItems={studyItems}
                  language={language}
                  onLanguageChange={setLanguage}
                  onSignOut={() => {
                    auth.signOut();
                    setAuthUser(null);
                    setIsGuest(false);
                    localStorage.removeItem("oddhoyon_is_guest");
                  }}
                />
              )}

              {activeTab === "settings" && (
                <SettingsView
                  user={user}
                  language={language}
                  onUpdateUser={setUser}
                  onLanguageChange={setLanguage}
                  onResetData={handleResetData}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedExamWorkspace(null);
          setActiveTestResult(null);
        }}
        language={language}
      />

      {/* Modals & Drawers */}
      <CreateExamModal
        isOpen={isCreateExamOpen}
        onClose={() => setIsCreateExamOpen(false)}
        language={language}
        onSave={handleSaveExam}
      />

      <CreateStudyItemModal
        isOpen={isAddStudyItemOpen}
        onClose={() => setIsAddStudyItemOpen(false)}
        exams={exams}
        defaultExamId={targetModalExamId}
        language={language}
        onSave={handleSaveStudyItem}
      />

      <BulkCreateStudyItemModal
        isOpen={isBulkStudyItemOpen}
        onClose={() => setIsBulkStudyItemOpen(false)}
        exams={exams}
        defaultExamId={targetModalExamId}
        language={language}
        onSaveBulk={handleSaveBulkStudyItems}
      />

      <MaterialUploadModal
        isOpen={isUploadMaterialOpen}
        onClose={() => setIsUploadMaterialOpen(false)}
        exams={exams}
        defaultExamId={targetModalExamId}
        language={language}
        onOCRComplete={handleOCRComplete}
      />

      {pendingOCR && (
        <OCRReviewModal
          isOpen={!!pendingOCR}
          onClose={() => setPendingOCR(null)}
          examId={pendingOCR.examId}
          initialTitle={pendingOCR.title}
          ocrData={pendingOCR.ocrData}
          language={language}
          onConfirmSave={handleConfirmSaveMaterial}
        />
      )}

      <GenerateTestModal
        isOpen={isGenerateTestOpen}
        onClose={() => setIsGenerateTestOpen(false)}
        exams={exams}
        materials={materials}
        defaultExamId={targetModalExamId}
        language={language}
        onTestGenerated={handleTestGenerated}
      />

      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        language={language}
        initialPrompt={tutorInitialPrompt}
      />

      <StreakCalendarModal
        isOpen={isStreakCalendarOpen}
        onClose={() => setIsStreakCalendarOpen(false)}
        streakCount={user.streakCount || 1}
        language={language}
      />
    </div>
  );
}

export default App;

