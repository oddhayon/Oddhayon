import React from "react";
import { Sparkles, Flame, BookOpen, Target, ArrowRight } from "lucide-react";
import { UserProfile } from "../../types";

export const APP_LOGO = "https://i.postimg.cc/8Pp3ChKh/61039e7a-9890-4c0f-a097-d1cd7d86a7b4.png";

interface WelcomeOnboardingScreenProps {
  user: UserProfile;
  onStart: () => void;
}

export const WelcomeOnboardingScreen: React.FC<WelcomeOnboardingScreenProps> = ({
  user,
  onStart,
}) => {
  const firstName = user.name?.split(" ")[0] || "শিক্ষার্থী";
  const streakCount = user.streakCount || 1;

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 flex flex-col items-center justify-between p-6 sm:p-10 font-['Hind_Siliguri'] selection:bg-stone-200">
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <img src={APP_LOGO} alt="অধ্যয়ন" className="h-9 w-auto object-contain" />
          <span className="font-bold text-xl tracking-tight text-stone-900">অধ্যয়ন</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 border border-amber-300 border-b-3 border-b-amber-400 rounded-xl text-amber-900 font-bold text-xs shadow-2xs">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
          <span>{streakCount} দিনের স্ট্রিক</span>
        </div>
      </div>

      {/* Main Content Area - Mascot & Speech Bubble */}
      <div className="w-full max-w-md my-auto flex flex-col items-center text-center py-6">
        {/* Speech Bubble */}
        <div className="relative mb-6 bg-white border border-stone-200 border-b-4 border-b-stone-300 rounded-3xl p-5 shadow-sm max-w-sm animate-bounce-short">
          <p className="text-base font-bold text-stone-900 leading-snug">
            হ্যালো <span className="text-amber-600">{firstName}</span>! 👋 <br />
            অধ্যয়ন-এ স্বাগতম। আজকে কোন বিষয় পড়ালেখা শুরু করবে?
          </p>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            তোমার এআই নোটস, সৃজনশীল প্রশ্ন ব্যাংক ও স্ট্রিক তৈরি আছে!
          </p>
          {/* Speech bubble tail pointer */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white drop-shadow-2xs"></div>
        </div>

        {/* Original Friendly Study Mascot Visual */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2 flex items-center justify-center">
          {/* Decorative Back Glow Card */}
          <div className="absolute inset-2 bg-amber-100/60 rounded-full blur-xl -z-10"></div>
          
          {/* Original SVG Mascot: "Oddhyu" - Cute Academic Owl with Glasses & Magic Pencil */}
          <svg
            className="w-full h-full drop-shadow-md"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Mascot Feet */}
            <ellipse cx="80" cy="178" rx="12" ry="6" fill="#D97706" />
            <ellipse cx="120" cy="178" rx="12" ry="6" fill="#D97706" />

            {/* Main Body */}
            <ellipse cx="100" cy="115" rx="55" ry="62" fill="#292524" />
            
            {/* Soft Cream Belly */}
            <ellipse cx="100" cy="125" rx="38" ry="42" fill="#F5F5F4" />
            
            {/* Belly Feathers / Text Details */}
            <path d="M90 110 Q100 115 110 110" stroke="#A8A29E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M86 125 Q100 132 114 125" stroke="#A8A29E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M92 140 Q100 144 108 140" stroke="#A8A29E" strokeWidth="2.5" strokeLinecap="round" />

            {/* Cute Wings holding a book */}
            <path d="M48 105 C35 120 40 145 60 142 C55 130 52 115 48 105 Z" fill="#1C1917" />
            <path d="M152 105 C165 120 160 145 140 142 C145 130 148 115 152 105 Z" fill="#1C1917" />

            {/* Open Study Book in Hands */}
            <path d="M72 138 C85 133 98 138 100 142 C102 138 115 133 128 138 L125 156 C115 152 103 155 100 158 C97 155 85 152 75 156 Z" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
            <path d="M100 142 L100 158" stroke="#1C1917" strokeWidth="1.5" />

            {/* Large Expressive Eyes Circles */}
            <circle cx="75" cy="82" r="22" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
            <circle cx="125" cy="82" r="22" fill="#FFFFFF" stroke="#1C1917" strokeWidth="3" />
            
            {/* Pupils & Sparkles */}
            <circle cx="78" cy="82" r="10" fill="#1C1917" />
            <circle cx="122" cy="82" r="10" fill="#1C1917" />
            <circle cx="81" cy="78" r="3.5" fill="#FFFFFF" />
            <circle cx="125" cy="78" r="3.5" fill="#FFFFFF" />

            {/* Academic Glasses */}
            <circle cx="75" cy="82" r="23" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
            <circle cx="125" cy="82" r="23" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
            <line x1="98" y1="82" x2="102" y2="82" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

            {/* Beak */}
            <polygon points="100,90 93,98 107,98" fill="#F59E0B" />

            {/* Graduation / Academic Cap */}
            <path d="M60 55 L100 38 L140 55 L100 68 Z" fill="#1C1917" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="82" y="56" width="36" height="12" fill="#292524" rx="2" />
            {/* Yellow Tassel */}
            <path d="M100 52 L132 62 L132 78" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="132" cy="80" r="3" fill="#F59E0B" />
          </svg>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <div className="bg-white border border-stone-200 border-b-3 border-b-stone-300 rounded-2xl p-3 flex items-center gap-2.5 text-left shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">দৈনিক স্ট্রিক</p>
              <p className="text-[11px] text-stone-500">নিয়মিত অধ্যয়ন ট্র্যাকার</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 border-b-3 border-b-stone-300 rounded-2xl p-3 flex items-center gap-2.5 text-left shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">এআই প্রশ্ন ব্যাংক</p>
              <p className="text-[11px] text-stone-500">বোর্ড ও বিশ্ববিদ্যালয় মান</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Area - 3D Pressable Button */}
      <div className="w-full max-w-md pb-4 pt-2">
        <button
          onClick={onStart}
          className="w-full bg-stone-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl text-base border border-stone-800 border-b-5 border-b-stone-950 active:translate-y-[2px] active:border-b-2 shadow-sm transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>চলো শুরু করি</span>
          <ArrowRight className="w-5 h-5 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
