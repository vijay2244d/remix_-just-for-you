import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, BookHeart, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../components/TiltCard";
import introImage from "../assets/images/media__1780296462725.jpg";

export interface KuralItem {
  vowel: string;
  line1: string;
  line2: string;
  meaning: string;
  englishHint: string;
}

export const DIVYA_KURAL_DATA: KuralItem[] = [
  {
    vowel: "அ",
    line1: "அன்பும் அரவணைப்பும் உன்னிடத்தில் இருந்து",
    line2: "கிடைப்பது தான் சுகம்.",
    meaning: "தேவைப்படும் அன்பும், அரவணைப்பும் உன்னிடத்தில் இருந்து வருவது அழகானது, சிறப்பானது, சுகமானது.",
    englishHint: "Love and embrace from you is the ultimate comfort."
  },
  {
    vowel: "ஆ",
    line1: "ஆர்வத்தின் கண்களுக்கு மட்டுமே தெரியும்",
    line2: "என் வாழ்வின் வசந்தகாலம்.",
    meaning: "என்னிடத்தில் இருக்கும் ஆர்வத்திற்கு மட்டும் அளவே இல்லை, நம் வாழ்க்கை எப்படி இருக்கப் போகிறது என்று.",
    englishHint: "Only the eyes of eagerness see the spring of my life."
  },
  {
    vowel: "இ",
    line1: "இரவின் அழகே நிலவின் ஒளிதான்",
    line2: "அது போல் தான்நீ.",
    meaning: "இரவுக்கு அழகு சேர்க்கும் நிலவைப் போல் தான் நீயும் என்தன் வாழ்வில் அழகு சேர்க்க வானில் இருந்து வந்த நிலா.",
    englishHint: "Like the moon lighting up the night, you illuminate my life."
  },
  {
    vowel: "ஈ",
    line1: "உன்னை ஈன்ற உன் தாய்க்கு",
    line2: "ஈடற்ற ஆற்றல் தான்.",
    meaning: "இவ்வளவு அழகை ஈன்றெடுக்க வலிமை அதிகமாய் தான் இருந்திருக்கும்.",
    englishHint: "Unparalleled strength to the mother who gave birth to you."
  },
  {
    vowel: "உ",
    line1: "உதிரத்தின் உணர்தல் உன்னால் அமைந்தது",
    line2: "பேர் சிறப்பு எனக்கு.",
    meaning: "உதிரத்தின் (இரத்தத்தின்) ஒரு ஒரு அணுக்களுக்கும் நீ உன்னைத் தெரியப்படுத்தி என் உதிரத்தைச் சிறப்பாக்கி விட்டாய்.",
    englishHint: "My blood feels your presence, which is my greatest pride."
  },
  {
    vowel: "ஊ",
    line1: "ஊற்று போல் காதல் ஆசையை",
    line2: "ஏற்படுத்திய பெண் நீ.",
    meaning: "ஆசையைக் கணக்கில் அடங்காத அளவிற்கு அதிகமாக்கியவள் நீ.",
    englishHint: "You are the woman who made love gush like a spring."
  },
  {
    vowel: "எ",
    line1: "எண்திசையும் உன்னோடு பயணிப்பதே, என்",
    line2: "வாழ்நாளின் உன்னத லட்சியம்!",
    meaning: "உலகில் உள்ள 8 திசைகளிலும் உன்னுடன் செல்வது சிறப்பு மற்றும் ஆசையும் கூட.",
    englishHint: "Traveling all eight directions with you is my lifetime goal."
  },
  {
    vowel: "ஏ",
    line1: "ஏக்கம் தான் உன்தலை தங்கும்",
    line2: "தலையணையாய் மாற வேண்டும்.",
    meaning: "உன் தலையணையைப் போல் உன்னை அரவணைத்து, ஆறுதல் படுத்தி உறங்க வைப்பேன்.",
    englishHint: "My longing wishes to become the pillow cradling your head."
  },
  {
    vowel: "ஐ",
    line1: "என் வாழ்வில் இருந்த பிழைகளையெல்லாம்,",
    line2: "தன்பேரன்பால் அழித்தொழித்தவள் நீ!",
    meaning: "\"தவறுகள் தான் மனிதனைத் திருத்தும்\" என்பது வெறும் பேச்சு; உண்மையில், நம் தவறுகளைப் பொறுமையோடு அரவணைத்து அதை நல்வழியாக மாற்றுபவரே உண்மையான அன்பிற்குரியவர். அந்த வகையில் என் வாழ்வின் பிழைகளை நீக்கி, எனக்கு நல்வாழ்வு தந்த என் பேரன்பே நீ தான்.",
    englishHint: "You erased all the flaws in my life with your absolute love."
  },
  {
    vowel: "ஒ",
    line1: "காலத்தின் ஓட்டம் போன பிறகு",
    line2: "உன் முகம் வேண்டும்.",
    meaning: "காலத்தின் கடைசியில் ஒருத்தர் ஒருத்தர் பார்த்துக் கொண்டு மிதம் உள்ள வாழ்க்கையை உன்னுடன் கடப்பது சுகம்.",
    englishHint: "At the end of time, I only want to gaze at your face."
  },
  {
    vowel: "ஓ",
    line1: "ஓவியத்தின் அழகை ரசிப்பதுதான், அதுவும்",
    line2: "ஒரு வகை இன்பம்தான்.",
    meaning: "ஓவியத்தின் அழகை ரசிப்பதுதான் ஒரு வகை சுகமான உணர்வு, அதுபோல் தான் ஓவியத்திற்கு ஒப்பீடு இல்லாத உன்னை ரசிப்பதும் சுகமான இன்பம்.",
    englishHint: "Admiration of art is bliss; so is admiring your unmatched beauty."
  }
];

// 1. Cover Page Component
export const DivyaKuralCover = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center gap-6 md:gap-8 p-4 md:p-8 select-none">
      <div className="w-full max-w-[180px] md:max-w-[240px] aspect-square relative z-10 perspective-1000 mx-auto">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-full aspect-square rounded-full bg-gradient-to-br from-rose-300 via-pink-200 to-amber-100 text-rose-900 flex flex-col items-center justify-center shadow-lg border-4 border-amber-200/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 md:w-24 md:h-24 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/55 shadow-md"
          >
            <BookHeart className="w-10 h-10 md:w-12 md:h-12 text-rose-600 fill-rose-100" />
          </motion.div>
        </motion.div>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-sm mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-sm mx-auto"
        >
          <span>அதிகாரம் 1 : உயிர் எழுத்துக்கள்</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold text-rose-955 font-display tracking-wider"
        >
          திவ்யக்குறள்
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm text-rose-900/80 leading-relaxed font-medium italic font-serif px-2 mb-2"
        >
          "தமிழில் உள்ள உயிர் எழுத்துக்கள் போல் என் வாழ்க்கையின் பக்கங்களில் உள்ள எழுத்துக்களுக்கு உயிர் அளித்தவள் நீ!"
        </motion.p>

        {/* Back to Library Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white font-medium text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
        >
          <BookHeart className="w-3.5 h-3.5" />
          <span>Back to Library 📚</span>
        </motion.button>
      </div>
    </div>
  );
};

export const DivyaKuralIntroPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 text-center select-none bg-[#fdfbf7] relative gap-4">
      {/* Decorative gold borders */}
      <div className="absolute inset-2 border border-amber-800/10 pointer-events-none rounded" />
      <div className="absolute inset-[10px] border border-dashed border-amber-800/5 pointer-events-none rounded" />

      <div className="w-full max-w-[150px] md:max-w-[200px] aspect-[4/5] rounded-xl overflow-hidden shadow-md border-2 border-amber-200/50 relative">
        <img src={introImage} alt="Portrait" className="w-full h-full object-cover" />
      </div>
      <p className="text-xs md:text-sm font-bold font-serif text-rose-955 max-w-[220px] md:max-w-[280px] leading-relaxed italic">
        "திவ்யாக்குரல் புகின் வள்ளுவனாய் மாற்றியதற்கு நன்றி"
      </p>
    </div>
  );
};

// 2. Vowel Calligraphy Page Component (Left Page)
export const KuralArtPage = ({ vowel }: { vowel: string }) => {
  const [dots, setDots] = useState<Array<{ id: number; left: number; top: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      size: Math.random() * 4 + 3,
      delay: Math.random() * -5,
    }));
    setDots(items);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-rose-50/20 p-6 select-none">
      {/* Soft floating dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute bg-rose-300/30 rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5 + dot.id,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Massive Calligraphic Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-amber-50 to-rose-100 border-4 border-rose-200/50 shadow-inner flex items-center justify-center relative"
      >
        <span className="text-[90px] md:text-[120px] font-extrabold text-rose-900/90 font-serif leading-none filter drop-shadow-md select-none">
          {vowel}
        </span>
        
        {/* Soft rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 border-2 border-dashed border-rose-200/40 rounded-full pointer-events-none"
        />
        
        {/* Sparkle badge */}
        <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow border border-rose-100">
          <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-200 animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 md:mt-8 flex flex-col items-center text-center"
      >
        <span className="text-[10px] md:text-xs font-semibold text-rose-500 uppercase tracking-widest">
          உயிர் எழுத்து (Vowel of Life)
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-rose-900 font-serif mt-1">
          {vowel}
        </h2>
      </motion.div>
    </div>
  );
};

// 3. Couplet Content Page Component (Right Page)
export const KuralContentPage = ({ kural }: { kural: KuralItem }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px]"
      >
        <TiltCard className="flex flex-col items-center justify-center text-center bg-white/90 px-3 py-6 md:px-6 md:py-6 shadow-sm border border-rose-50/70 min-h-[300px]">
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shadow-inner mb-4 pointer-events-none">
            <Heart className="w-4.5 h-4.5 fill-rose-400 text-rose-500" />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-5 w-full my-2">
            {/* The 2-line formatted Couplet with strict whitespace-nowrap */}
            <blockquote className="text-rose-955 font-serif text-[11px] sm:text-xs md:text-sm lg:text-base font-bold leading-relaxed tracking-wide italic px-1 text-center w-full flex flex-col gap-0.5 select-text">
              <span className="block w-full text-center whitespace-nowrap">"{kural.line1}</span>
              <span className="block w-full text-center whitespace-nowrap">{kural.line2}"</span>
            </blockquote>

            {/* Separator */}
            <div className="flex items-center justify-center gap-1.5 opacity-40">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
              <span className="w-10 h-[1px] bg-rose-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            </div>

            {/* Tamil Meaning */}
            <div className="bg-amber-50/30 rounded-xl p-3 border border-amber-100/50 text-left">
              <span className="text-[10px] font-bold text-amber-800 block mb-1 uppercase tracking-widest">
                பொருள் (Meaning)
              </span>
              <p className="text-rose-900 text-[11px] md:text-xs leading-relaxed italic pl-0.5">
                {kural.meaning}
              </p>
            </div>
            
            {/* English translation hint */}
            <p className="text-[9px] md:text-[10px] text-rose-700/60 leading-normal italic text-center px-2">
              {kural.englishHint}
            </p>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
};

// 4. End Concluding Page Component
export const DivyaKuralEnd = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full max-w-sm mx-auto flex flex-col justify-center gap-6 p-4 md:p-8 select-none">
      <div className="w-full relative flex-1 min-h-0 perspective-1000">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="h-full bg-[length:100%_28px] md:bg-[length:100%_32px] bg-left-top shadow-md border border-rose-100 p-5 md:p-8 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center relative"
          style={{
            backgroundImage: "linear-gradient(transparent 95%, #fca5a5 100%)",
            backgroundColor: "#fffdf9"
          }}
        >
          {/* Vertical margin line for the paper */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-rose-200/50 shadow-sm z-0" />
          
          <div className="relative z-10 w-full px-4 flex flex-col items-center gap-6">
            <h2 className="text-xl md:text-2xl font-bold font-serif text-rose-900 uppercase tracking-widest">
              முற்றும்
            </h2>
            
            <p className="text-rose-800/90 text-sm md:text-base font-semibold leading-relaxed italic font-serif">
              என் வாழ்க்கையின் உயிர் எழுத்தான உன்னுடன் கவிதைகள் என்றும் தொடரும்...
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white font-medium text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer border-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Back to Library</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
