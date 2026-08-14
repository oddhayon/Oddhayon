import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../lib/firebase";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Globe,
  Copy,
  Check,
  Compass,
} from "lucide-react";

export const APP_LOGO = "https://i.postimg.cc/8Pp3ChKh/61039e7a-9890-4c0f-a097-d1cd7d86a7b4.png";

interface AuthPageProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onContinueAsGuest }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

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
      setError("ইমেইল এবং পাসওয়ার্ড প্রদান করো");
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError("তোমার নাম লিখুন");
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
        msg = "এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করো।";
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছো।";
      } else if (err.code === "auth/user-not-found") {
        msg = "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।";
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
    setUnauthorizedDomain(null);
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
      if (err.code === "auth/unauthorized-domain") {
        const currentHostname = window.location.hostname;
        setUnauthorizedDomain(currentHostname);
        setError("Firebase Authorized Domain Error: বর্তমান ওয়েবসাইট ডোমেইনটি Firebase Console-এ অনুমোদিত নয়।");
      } else if (err.code !== "auth/popup-closed-by-user") {
        setError("Google সাইন ইন সম্পূর্ণ করা সম্ভব হয়নি।");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (unauthorizedDomain) {
      navigator.clipboard.writeText(unauthorizedDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-center items-center p-4 sm:p-6 font-['Hind_Siliguri'] selection:bg-stone-900 selection:text-white relative">
      
      {/* Minimal Card */}
      <div className="w-full max-w-sm mx-auto">
        
        {/* App Logo */}
        <div className="text-center mb-5">
          <img
            src={APP_LOGO}
            alt="অধ্যয়ন"
            className="h-14 w-auto mx-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Card Box */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-md shadow-stone-200/50 dark:shadow-none">
          
          {/* Minimal Tab Switcher with Animated Pill */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl mb-5 text-xs font-bold border border-stone-200/60 dark:border-stone-700/60">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
                !isSignUp
                  ? "bg-gradient-to-b from-white to-stone-50 dark:from-stone-900 dark:to-stone-850 text-stone-900 dark:text-white shadow-xs border border-stone-200/60 dark:border-stone-750"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              লগইন (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
                isSignUp
                  ? "bg-gradient-to-b from-white to-stone-50 dark:from-stone-900 dark:to-stone-850 text-stone-900 dark:text-white shadow-xs border border-stone-200/60 dark:border-stone-750"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              নতুন অ্যাকাউন্ট (Sign Up)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
              <p className="text-center font-medium">{error}</p>
              {unauthorizedDomain && (
                <div className="mt-2.5 pt-2.5 border-t border-rose-200 dark:border-rose-800 text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1 font-bold text-rose-800 dark:text-rose-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Firebase Authorized Domain:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <code className="flex-1 px-2 py-1 bg-white dark:bg-stone-900 border border-rose-300 dark:border-rose-700 rounded text-[10px] font-mono break-all">
                      {unauthorizedDomain}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="px-2 py-1 bg-stone-900 text-white rounded text-[10px] font-bold shrink-0 cursor-pointer"
                    >
                      {copiedDomain ? "কপি হয়েছে" : "কপি"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                  পূর্ণ নাম
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="সাকিব আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-stone-900"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                ইমেইল
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl pl-9 pr-9 py-2 text-xs font-semibold text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-stone-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-950 hover:from-black hover:via-stone-900 hover:to-black text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-stone-900/15 hover:shadow-lg hover:shadow-stone-900/25 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>লোড হচ্ছে...</span>
                </span>
              ) : (
                <>
                  <span>{isSignUp ? "অ্যাকাউন্ট তৈরি করো" : "লগইন করো"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Minimal Divider */}
          <div className="w-full flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-stone-100 dark:bg-stone-800"></div>
            <span className="text-[10px] text-stone-400 font-semibold uppercase">অথবা</span>
            <div className="flex-1 h-px bg-stone-100 dark:bg-stone-800"></div>
          </div>

          {/* Side-by-side Minimal Icon Buttons for Google & Guest */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Icon Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex flex-col items-center justify-center py-2.5 px-3 bg-gradient-to-b from-white to-stone-50 hover:to-stone-100 dark:from-stone-850 dark:to-stone-900 border border-stone-200 dark:border-stone-750 rounded-xl shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 group"
              title="Google"
            >
              <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
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
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">Google</span>
            </button>

            {/* Guest Icon Button */}
            {onContinueAsGuest && (
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="flex flex-col items-center justify-center py-2.5 px-3 bg-gradient-to-b from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/15 dark:from-stone-850 dark:to-stone-900 border border-amber-300/80 dark:border-amber-700/60 rounded-xl shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 cursor-pointer group"
                title="Guest"
              >
                <Compass className="w-5 h-5 mb-1 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
                <span className="text-[11px] font-bold text-amber-950 dark:text-amber-300">Guest</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
