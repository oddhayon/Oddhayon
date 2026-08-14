import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile, Exam, StudyItem, Material, MistakeItem, GeneratedTest, ExamAttempt } from "../types";

// User Profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: uid, ...snap.data() } as UserProfile;
    }
  } catch (e) {
    console.error("Firestore getUserProfile Error:", e);
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const ref = doc(db, "users", uid);
    await setDoc(ref, data, { merge: true });
  } catch (e) {
    console.error("Firestore updateUserProfile Error:", e);
  }
};

// Real-time listener helpers
export const subscribeToUserExams = (
  userId: string,
  onUpdate: (exams: Exam[]) => void
) => {
  const q = query(collection(db, "exams"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Exam[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Exam[];
      onUpdate(list);
    },
    (err) => {
      console.error("subscribeToUserExams Error:", err);
    }
  );
};

export const subscribeToUserStudyItems = (
  userId: string,
  onUpdate: (items: StudyItem[]) => void
) => {
  const q = query(collection(db, "studyItems"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: StudyItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as StudyItem[];
      onUpdate(list);
    },
    (err) => {
      console.error("subscribeToUserStudyItems Error:", err);
    }
  );
};

export const subscribeToUserMaterials = (
  userId: string,
  onUpdate: (materials: Material[]) => void
) => {
  const q = query(collection(db, "materials"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Material[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Material[];
      onUpdate(list);
    },
    (err) => {
      console.error("subscribeToUserMaterials Error:", err);
    }
  );
};

export const subscribeToUserMistakes = (
  userId: string,
  onUpdate: (mistakes: MistakeItem[]) => void
) => {
  const q = query(collection(db, "mistakes"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: MistakeItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as MistakeItem[];
      onUpdate(list);
    },
    (err) => {
      console.error("subscribeToUserMistakes Error:", err);
    }
  );
};

// CRUD Operations for Exams
export const saveExamToFirestore = async (exam: Exam): Promise<void> => {
  if (exam.userId === "guest" || !exam.userId) return;
  try {
    const ref = doc(db, "exams", exam.id);
    await setDoc(ref, exam, { merge: true });
  } catch (e) {
    console.error("saveExamToFirestore Error:", e);
  }
};

export const deleteExamFromFirestore = async (examId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "exams", examId));
  } catch (e) {
    console.error("deleteExamFromFirestore Error:", e);
  }
};

// CRUD Operations for Study Items
export const saveStudyItemToFirestore = async (item: StudyItem): Promise<void> => {
  if (item.userId === "guest" || !item.userId) return;
  try {
    const ref = doc(db, "studyItems", item.id);
    await setDoc(ref, item, { merge: true });
  } catch (e) {
    console.error("saveStudyItemToFirestore Error:", e);
  }
};

export const deleteStudyItemFromFirestore = async (itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "studyItems", itemId));
  } catch (e) {
    console.error("deleteStudyItemFromFirestore Error:", e);
  }
};

// CRUD Operations for Materials
export const saveMaterialToFirestore = async (material: Material): Promise<void> => {
  if (material.userId === "guest" || !material.userId) return;
  try {
    const ref = doc(db, "materials", material.id);
    await setDoc(ref, material, { merge: true });
  } catch (e) {
    console.error("saveMaterialToFirestore Error:", e);
  }
};

export const deleteMaterialFromFirestore = async (materialId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "materials", materialId));
  } catch (e) {
    console.error("deleteMaterialFromFirestore Error:", e);
  }
};

// CRUD Operations for Mistakes
export const saveMistakeToFirestore = async (mistake: MistakeItem): Promise<void> => {
  if (mistake.userId === "guest" || !mistake.userId) return;
  try {
    const ref = doc(db, "mistakes", mistake.id);
    await setDoc(ref, mistake, { merge: true });
  } catch (e) {
    console.error("saveMistakeToFirestore Error:", e);
  }
};

export const deleteMistakeFromFirestore = async (mistakeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "mistakes", mistakeId));
  } catch (e) {
    console.error("deleteMistakeFromFirestore Error:", e);
  }
};
