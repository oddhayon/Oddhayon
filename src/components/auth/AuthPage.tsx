import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../lib/firebase";

export const APP_LOGO = "https://i.postimg.cc/8Pp3ChKh/61039e7a-9890-4c0f-a097-d1cd7d86a7b4.png";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const syncUserProfile = async (uid: string, userEmail: string, userName: string, photoURL?: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid,
          email: userEmail,
          name: userName || "শিক্ষার্থী",
          photoURL: photoURL || "",
          targetExam: "HSC / College",
          preferredLanguage: "bn",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Error creating user profile document:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError("আপনার নাম লিখুন");
        return;
      }
      if (password !== confirmPassword) {
        setError("পাসওয়ার্ড দুটি মেলেনি");
        return;
      }
      if (password.length < 6) {
        setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name });
        await syncUserProfile(userCred.user.uid, email, name);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(
          userCred.user.uid,
          userCred.user.email || email,
          userCred.user.displayName || "শিক্ষার্থী"
        );
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Auth Error:", err);
      let msg = "অথেন্টিকেশন সম্পূর্ণ করা সম্ভব হয়নি।";
      if (err.code === "auth/email-already-in-use") {
        msg = "এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে। লগইন করার চেষ্টা করুন।";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "ভুল ইমেইল অথবা পাসওয়ার্ড প্রদান করেছেন।";
      } else if (err.code === "auth/user-not-found") {
        msg = "এই ইমেইল সম্বলিত কোনো অ্যাকাউন্ট পাওয়া যায়নি।";
      } else if (err.code === "auth/weak-password") {
        msg = "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await syncUserProfile(
        user.uid,
        user.email || "",
        user.displayName || "শিক্ষার্থী",
        user.photoURL || ""
      );
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google সাইন ইন সম্পূর্ণ করা সম্ভব হয়নি।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col items-center justify-center p-6 selection:bg-stone-200">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={APP_LOGO}
            alt="অধ্যয়ন"
            className="h-16 w-auto object-contain mb-3 drop-shadow-xs"
          />
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight font-['Hind_Siliguri']">
            অধ্যয়ন
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1 tracking-wide">
            স্মার্ট এআই অধ্যয়ন ও পরীক্ষার প্ল্যাটফর্ম
          </p>
        </div>

        {/* Form Header */}
        <div className="w-full mb-6 text-center">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আপনার অ্যাকাউন্টে প্রবেশ করুন"}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isSignUp
              ? "অধ্যয়নে বিনামূল্যে অ্যাকাউন্ট খুলে আপনার প্রস্তুতি শুরু করুন"
              : "আপনার প্রশ্ন ব্যাংক, রুটিন ও রিভিশন নোটস অ্যাক্সেস করতে সাইন ইন করুন"}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                আপনার পূর্ণ নাম
              </label>
              <input
                type="text"
                placeholder="যেমন: সাকিব আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ইমেইল অ্যাড্রেস
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                required={isSignUp}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-stone-900 hover:bg-black text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                অপেক্ষা করুন...
              </span>
            ) : isSignUp ? (
              "সাইন আপ করুন"
            ) : (
              "সাইন ইন করুন"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-stone-200"></div>
          <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">অথবা</span>
          <div className="flex-1 h-px bg-stone-200"></div>
        </div>

        {/* Google Sign In Option */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google দিয়ে শুরু করুন
        </button>

        {/* Toggle between Login and Sign Up */}
        <div className="mt-6 text-center text-xs text-stone-500">
          {isSignUp ? (
            <span>
              পূর্বেই অ্যাকাউন্ট খোলা আছে?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className="font-semibold text-stone-900 hover:underline cursor-pointer ml-1"
              >
                লগইন করুন
              </button>
            </span>
          ) : (
            <span>
              নতুন শিক্ষার্থী?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="font-semibold text-stone-900 hover:underline cursor-pointer ml-1"
              >
                নতুন অ্যাকাউন্ট তৈরি করুন
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
