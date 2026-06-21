import { useEffect, useState, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, BookHeart } from "lucide-react";
import { useAppStore } from "./store";
import { HeartRain } from "./components/HeartRain";
import { KissRain } from "./components/KissRain";
import {
  DIVYA_KURAL_DATA,
  DivyaKuralCover,
  KuralArtPage,
  KuralContentPage,
  DivyaKuralEnd,
  DivyaKuralIntroPage
} from "./pages/DivyaKuralPages";
import introImage from "./assets/images/media__1780296462725.jpg";

const LeftPageFrame = ({ children, isBlank }: { children: ReactNode, isBlank?: boolean }) => {
  if (isBlank) return <div className="w-full h-full bg-transparent" />;
  return (
    <div className="w-full h-full bg-[#fdfbf7] rounded-l-sm md:rounded-l-md relative overflow-hidden shadow-[-1px_0_0_#e5ddd0,-2px_0_0_#fdfbf7,-3px_0_0_#e5ddd0,-4px_0_0_#fdfbf7,-5px_0_0_#e5ddd0,-6px_0_0_#fdfbf7,-7px_0_0_#e5ddd0,-8px_0_0_#fdfbf7,-9px_0_0_#e5ddd0,-12px_15px_20px_rgba(0,0,0,0.15)] border-l border-y border-[#e5ddd0] transform-gpu" style={{ maskImage: '-webkit-radial-gradient(white, black)' }}>
      {/* Page edge inner shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
      {/* Spine shadow and highlight */}
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[rgba(0,0,0,0.18)] via-[rgba(0,0,0,0.06)] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/60 shadow-[0_0_10px_rgba(255,255,255,1)] pointer-events-none z-10" />
      {/* Light sheen */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/60 to-transparent pointer-events-none z-10" />
      {children}
    </div>
  );
};

const RightPageFrame = ({ children }: { children: ReactNode }) => (
  <div className="w-full h-full bg-[#fdfbf7] rounded-r-sm md:rounded-r-md relative overflow-hidden shadow-[1px_0_0_#e5ddd0,2px_0_0_#fdfbf7,3px_0_0_#e5ddd0,4px_0_0_#fdfbf7,5px_0_0_#e5ddd0,6px_0_0_#fdfbf7,7px_0_0_#e5ddd0,8px_0_0_#fdfbf7,9px_0_0_#e5ddd0,12px_15px_20px_rgba(0,0,0,0.15)] border-r border-y border-[#e5ddd0] transform-gpu" style={{ maskImage: '-webkit-radial-gradient(white, black)' }}>
    {/* Page edge inner shadow */}
    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
    {/* Spine shadow and highlight */}
    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[rgba(0,0,0,0.18)] via-[rgba(0,0,0,0.06)] to-transparent pointer-events-none z-10" />
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/60 shadow-[0_0_10px_rgba(255,255,255,1)] pointer-events-none z-10" />
    {/* Light sheen */}
    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/60 to-transparent pointer-events-none z-10" />
    {children}
  </div>
);

const SPREADS = [
  { 
    path: '/kural', 
    name: 'Cover', 
    icon: BookHeart, 
    left: <DivyaKuralIntroPage />, 
    right: <DivyaKuralCover /> 
  },
  { 
    path: '/kural/1', 
    name: 'அ', 
    icon: Heart, 
    left: <KuralArtPage vowel="அ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[0]} /> 
  },
  { 
    path: '/kural/2', 
    name: 'ஆ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஆ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[1]} /> 
  },
  { 
    path: '/kural/3', 
    name: 'இ', 
    icon: Heart, 
    left: <KuralArtPage vowel="இ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[2]} /> 
  },
  { 
    path: '/kural/4', 
    name: 'ஈ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஈ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[3]} /> 
  },
  { 
    path: '/kural/5', 
    name: 'உ', 
    icon: Heart, 
    left: <KuralArtPage vowel="உ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[4]} /> 
  },
  { 
    path: '/kural/6', 
    name: 'ஊ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஊ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[5]} /> 
  },
  { 
    path: '/kural/7', 
    name: 'எ', 
    icon: Heart, 
    left: <KuralArtPage vowel="எ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[6]} /> 
  },
  { 
    path: '/kural/8', 
    name: 'ஏ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஏ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[7]} /> 
  },
  { 
    path: '/kural/9', 
    name: 'ஐ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஐ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[8]} /> 
  },
  { 
    path: '/kural/10', 
    name: 'ஒ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஒ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[9]} /> 
  },
  { 
    path: '/kural/11', 
    name: 'ஓ', 
    icon: Heart, 
    left: <KuralArtPage vowel="ஓ" />, 
    right: <KuralContentPage kural={DIVYA_KURAL_DATA[10]} /> 
  },
  { 
    path: '/kural/end', 
    name: 'End', 
    icon: BookHeart, 
    left: <KuralArtPage vowel="✨" />, 
    right: <DivyaKuralEnd /> 
  },
];

const BackgroundDecor = () => {
  const [particles] = useState(() => 
    Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      size: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * -30,
      drift: Math.random() * 15 - 7.5,
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100/40 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/40 blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-200/30 blur-[100px]" />
      
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-300/40"
          initial={{ left: `${p.left}%`, top: "-10%", rotate: p.rotation, opacity: 0, x: 0 }}
          animate={{
            top: "110%",
            x: `${p.drift}vw`,
            rotate: p.rotation + (p.drift > 0 ? 180 : -180),
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          <svg width={p.size * 40} height={p.size * 40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 drop-shadow-sm">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const DivyaKuralLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUnlocked = useAppStore((state) => state.isUnlocked);
  
  const matchedIndex = SPREADS.findIndex(s => s.path === location.pathname);
  const targetIndex = matchedIndex === -1 ? 0 : matchedIndex;

  const [renderedSpread, setRenderedSpread] = useState(targetIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [showKissRain, setShowKissRain] = useState(false);
  const [showHeartRain, setShowHeartRain] = useState(false);
  
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // If the user navigates directly to specific pages, do not block with splash screen
  useEffect(() => {
    if (location.pathname !== "/kural") {
      setShowSplash(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (targetIndex !== renderedSpread && !isFlipping) {
      setFlipDirection(targetIndex > renderedSpread ? 'forward' : 'backward');
      setIsFlipping(true);
    }
  }, [targetIndex, renderedSpread, isFlipping]);

  const goToPage = (newIndex: number) => {
    if (newIndex === targetIndex || isFlipping || newIndex < 0 || newIndex >= SPREADS.length) return;
    navigate(SPREADS[newIndex].path);
  };

  const currentLeft = SPREADS[isFlipping && flipDirection === 'backward' ? targetIndex : renderedSpread].left;
  const currentRight = SPREADS[isFlipping && flipDirection === 'forward' ? targetIndex : renderedSpread].right;

  return (
    <div className="h-[100svh] w-full bg-gradient-to-tr from-pink-100/70 via-rose-50 to-amber-100/70 overflow-hidden relative selection:bg-rose-200 selection:text-rose-900 font-sans flex flex-col items-center justify-center p-2 md:p-8">
      
      {/* Intro Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#faf8f2] flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto"
          >
            {/* Visual borders */}
            <div className="absolute inset-3 md:inset-4 border border-amber-800/10 pointer-events-none rounded-2xl" />
            <div className="absolute inset-4 md:inset-5 border border-dashed border-amber-800/5 pointer-events-none rounded-2xl" />

            {/* Corner ornaments */}
            <div className="absolute top-[24px] left-[24px] md:top-[32px] md:left-[32px] w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-amber-800/20 rounded-tl" />
            <div className="absolute top-[24px] right-[24px] md:top-[32px] md:right-[32px] w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-amber-800/20 rounded-tr" />
            <div className="absolute bottom-[24px] left-[24px] md:bottom-[32px] md:left-[32px] w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-amber-800/20 rounded-bl" />
            <div className="absolute bottom-[24px] right-[24px] md:bottom-[32px] md:right-[32px] w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-amber-800/20 rounded-br" />

            <div className="flex flex-col items-center max-w-lg mx-auto gap-5 md:gap-7 my-auto">
              
              {/* Golden frame around image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-full max-w-[200px] md:max-w-[250px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.15)] border-4 border-amber-200/50 relative animate-pulse"
                style={{ animationDuration: '3s' }}
              >
                <img src={introImage} alt="Portrait Intro" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>

              {/* Dedication Text */}
              <div className="space-y-3">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-base md:text-xl font-bold font-serif text-rose-955 px-2 leading-relaxed tracking-wide"
                >
                  "திவ்யாக்குரல் புகின் வள்ளுவனாய் மாற்றியதற்கு நன்றி"
                </motion.h2>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"
                />
              </div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                onClick={() => setShowSplash(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-rose-700 hover:from-amber-600 hover:to-rose-600 text-white font-medium text-[10px] md:text-xs uppercase tracking-widest shadow-lg cursor-pointer transition-all border border-white/10"
              >
                Enter Book • நூலைத் திறக்கவும் 📖
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BackgroundDecor />
      <HeartRain active={showHeartRain} />
      <KissRain active={showKissRain} />

      {/* Next Page / Right Side Button */}
      {isUnlocked && (
        <div className="absolute right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-50">
          <button 
            onClick={() => {
              setShowKissRain(true);
              setShowHeartRain(true);
              setTimeout(() => {
                setShowKissRain(false);
                setShowHeartRain(false);
              }, 3000);
              if (targetIndex < SPREADS.length - 1) {
                goToPage(targetIndex + 1);
              } else {
                goToPage(0);
              }
            }}
            disabled={isFlipping}
            className="text-5xl md:text-6xl filter drop-shadow hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
            title="Next Page & Rain"
          >
            💋
          </button>
        </div>
      )}

      {/* Prev Page / Left Side Button */}
      {isUnlocked && targetIndex > 0 && (
        <div className="absolute left-4 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-50">
          <button 
            onClick={() => {
              setShowKissRain(true);
              setShowHeartRain(true);
              setTimeout(() => {
                setShowKissRain(false);
                setShowHeartRain(false);
              }, 3000);
              if (targetIndex > 0) {
                goToPage(targetIndex - 1);
              }
            }}
            disabled={isFlipping}
            className="text-5xl md:text-6xl filter drop-shadow hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
            title="Previous Page & Rain"
          >
            ❤️
          </button>
        </div>
      )}

      <div 
        className="relative flex z-10 perspective-[2500px]"
        style={{ 
          width: 'min(98vw, 1600px, calc((100svh - 60px) * (1600 / 900)))', 
          aspectRatio: '1600 / 900',
          maxHeight: 'min(900px, calc(100svh - 60px))'
        }}
      >
        {/* Hardback Book Cover Backdrop */}
        <div className="absolute inset-y-[-6px] inset-x-[-8px] bg-gradient-to-r from-rose-950 via-rose-900 to-rose-955 rounded-lg shadow-[0_25px_65px_rgba(0,0,0,0.35)] border-2 border-rose-900/60 z-0 pointer-events-none" />
        <div className="absolute left-1/2 top-[-6px] bottom-[-6px] w-[6px] -ml-[3px] bg-amber-500/20 z-0 pointer-events-none" />
        
        {/* Book Binding Shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-black/20 blur-md pointer-events-none z-0" />

        {/* Stationary Left Page */}
        <div className="w-1/2 h-full relative z-10 shrink-0">
          <LeftPageFrame isBlank={currentLeft === null}>
            {currentLeft}
          </LeftPageFrame>
        </div>
        
        {/* Stationary Right Page */}
        <div className="w-1/2 h-full relative z-10 shrink-0">
          <RightPageFrame>
            {currentRight}
          </RightPageFrame>
        </div>

        {/* Flipping Forward */}
        {isFlipping && flipDirection === 'forward' && (
          <motion.div
            initial={{ rotateY: 0, z: 0 }}
            animate={{ 
              rotateY: -180,
              z: [0, 80, 0],
              rotateX: [0, 3, 0]
            }}
            transition={{ duration: 1.4, ease: [0.645, 0.045, 0.355, 1.000] }}
            onAnimationComplete={() => {
               setRenderedSpread(targetIndex);
               setIsFlipping(false);
            }}
            className="absolute right-0 w-1/2 h-full z-30 origin-left transform-style-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front (Old Right) */}
            <div className="absolute inset-0 backface-hidden shadow-[20px_0_30px_rgba(0,0,0,0.15)] flex">
              <RightPageFrame>
                {SPREADS[renderedSpread].right}
              </RightPageFrame>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-black/0 to-black/20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeIn" }}
              />
            </div>
            {/* Back (New Left) */}
            <div className="absolute inset-0 backface-hidden shadow-[-20px_0_30px_rgba(0,0,0,0.15)] flex" style={{ transform: 'rotateY(180deg)' }}>
              <LeftPageFrame isBlank={SPREADS[targetIndex].left === null}>
                {SPREADS[targetIndex].left}
              </LeftPageFrame>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/20 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Flipping Backward */}
        {isFlipping && flipDirection === 'backward' && (
          <motion.div
            initial={{ rotateY: 0, z: 0 }}
            animate={{ 
              rotateY: 180,
              z: [0, 80, 0],
              rotateX: [0, 3, 0]
            }}
            transition={{ duration: 1.4, ease: [0.645, 0.045, 0.355, 1.000] }}
            onAnimationComplete={() => {
               setRenderedSpread(targetIndex);
               setIsFlipping(false);
            }}
            className="absolute left-0 w-1/2 h-full z-30 origin-right transform-style-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front (Old Left) */}
            <div className="absolute inset-0 backface-hidden shadow-[-20px_0_30px_rgba(0,0,0,0.15)] flex">
              <LeftPageFrame isBlank={SPREADS[renderedSpread].left === null}>
                {SPREADS[renderedSpread].left}
              </LeftPageFrame>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeIn" }}
              />
            </div>
            {/* Back (New Right) */}
            <div className="absolute inset-0 backface-hidden shadow-[20px_0_30px_rgba(0,0,0,0.15)] flex" style={{ transform: 'rotateY(180deg)' }}>
              <RightPageFrame>
                {SPREADS[targetIndex].right}
              </RightPageFrame>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-black/0 to-black/20 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
