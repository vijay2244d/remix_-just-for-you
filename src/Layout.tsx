import { useEffect, useState, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Mail, BookHeart } from "lucide-react";
import { cn } from "@/src/lib/utils";

import { useAppStore } from "./store";
import { Home } from "./pages/Home";
import { StoryBeginning } from "./pages/StoryBeginning";
import { StoryBeginningContinued } from "./pages/StoryBeginningContinued";
import { StoryMemories } from "./pages/StoryMemories";
import { StoryMemoriesContinued } from "./pages/StoryMemoriesContinued";
import { StoryFuture } from "./pages/StoryFuture";
import { FutureScenario } from "./pages/FutureScenario";
import { Reasons } from "./pages/Reasons";
import { ReasonsLeft } from "./pages/ReasonsLeft";
import { Note } from "./pages/Note";
import { HeartRain } from "./components/HeartRain";
import { KissRain } from "./components/KissRain";
import generatedImage1 from "./assets/images/regenerated_image_1779435727014.jpg";
import generatedImage2 from "./assets/images/regenerated_image_1779454319740.jpg";
import generatedImage3 from "./assets/images/regenerated_image_1779454586059.jpg";
import generatedImage4 from "./assets/images/media__1779892536922.jpg";
import generatedImage5 from "./assets/images/regenerated_image_1779458304356.jpg";
import generatedImage6 from "./assets/images/regenerated_image_1779702651151.jpg";
import futureScenarioImg1 from "./assets/images/media__1779891557910.jpg";
import futureScenarioImg2 from "./assets/images/media__1779891558880.jpg";
import futureScenarioImg3 from "./assets/images/media__1779891559020.jpg";
import futureScenarioImg4 from "./assets/images/media__1779893261718.jpg";

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

const ImageContent = ({ src, topCaption, bottomCaption }: { src: string, topCaption?: string, bottomCaption?: string }) => {
  const setZoomedImage = useAppStore(state => state.setZoomedImage);
  return (
  <div className="w-full h-full p-4 md:p-8 flex flex-col items-center justify-center">
    {topCaption && (
      <div className="text-rose-900 font-display text-lg md:text-xl text-center italic w-full mb-4 md:mb-6">
        {topCaption}
      </div>
    )}
    <div 
      className="w-full flex-1 min-h-0 rounded-xl overflow-hidden shadow-inner border-2 border-rose-100 relative transform-gpu bg-rose-50/30 cursor-pointer hover:opacity-90 transition-opacity" 
      style={{ transform: 'translateZ(0)' }}
      onClick={() => setZoomedImage(src)}
    >
       <img src={src} alt="Memory" className="w-full h-full object-cover transform-gpu backface-hidden" style={{ WebkitBackfaceVisibility: 'hidden' }} />
       <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] pointer-events-none" />
       <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
         <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
       </div>
    </div>
    {bottomCaption && (
      <div className="text-rose-900 font-display text-lg md:text-xl text-center italic w-full mt-4 md:mt-6">
        {bottomCaption}
      </div>
    )}
  </div>
)};

const MultiImageContent = ({ images }: { images: string[] }) => {
  const setZoomedImage = useAppStore(state => state.setZoomedImage);
  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pointer-events-auto">
      {images.map((src, i) => (
        <div 
          key={i}
          className="w-full h-48 md:h-64 shrink-0 rounded-xl overflow-hidden shadow-inner border-2 border-rose-100 relative transform-gpu bg-rose-50/30 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ transform: 'translateZ(0)' }}
          onClick={() => setZoomedImage(src)}
        >
          <img src={src} alt={`Memory ${i+1}`} className="w-full h-full object-cover transform-gpu backface-hidden" style={{ WebkitBackfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity">
            <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

const SPREADS = [
  { 
    path: '/story', 
    name: 'Cover', 
    icon: BookHeart, 
    left: null, 
    right: <Home /> 
  },
  { 
    path: '/story-beginning', 
    name: 'The Beginning', 
    icon: Heart, 
    left: <ImageContent src={generatedImage1} />, 
    right: <StoryBeginning /> 
  },
  { 
    path: '/story-beginning-continued', 
    name: 'Spark', 
    icon: Heart, 
    left: <ImageContent src={generatedImage3} />, 
    right: <StoryBeginningContinued /> 
  },
  { 
    path: '/story-memories', 
    name: 'Memories', 
    icon: Heart, 
    left: <ImageContent src={generatedImage2} />, 
    right: <StoryMemories /> 
  },
  { 
    path: '/story-memories-continued', 
    name: 'Healing', 
    icon: Heart, 
    left: <ImageContent src={generatedImage4} />, 
    right: <StoryMemoriesContinued /> 
  },
  { 
    path: '/story-future', 
    name: 'Future', 
    icon: Heart, 
    left: <ImageContent src={generatedImage6} topCaption="what will i lose if i have" bottomCaption="what will i have if i lose you " />, 
    right: <StoryFuture /> 
  },
  { 
    path: '/story-future-scenario', 
    name: 'Future Scenarios', 
    icon: Sparkles, 
    left: <MultiImageContent images={[futureScenarioImg1, futureScenarioImg2, futureScenarioImg3, futureScenarioImg4]} />, 
    right: <FutureScenario /> 
  },
  { 
    path: '/reasons', 
    name: 'Reasons', 
    icon: Sparkles, 
    left: <ReasonsLeft />, 
    right: <Reasons /> 
  },
  { 
    path: '/note', 
    name: 'Note', 
    icon: Mail, 
    left: <ImageContent src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800" />, 
    right: <Note /> 
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/40 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-200/40 blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-300/30 blur-[100px]" />
      
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
          {/* Subtle line-art / doodle style heart */}
          <svg width={p.size * 40} height={p.size * 40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 drop-shadow-sm">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEnvelopeOpen = useAppStore((state) => state.isEnvelopeOpen);
  const isUnlocked = useAppStore((state) => state.isUnlocked);
  const zoomedImage = useAppStore((state) => state.zoomedImage);
  const setZoomedImage = useAppStore((state) => state.setZoomedImage);
  
  const matchedIndex = SPREADS.findIndex(s => s.path === location.pathname);
  const targetIndex = matchedIndex === -1 ? 0 : matchedIndex;

  const [renderedSpread, setRenderedSpread] = useState(targetIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [showKissRain, setShowKissRain] = useState(false);
  const [showHeartRain, setShowHeartRain] = useState(false);

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
    <div className="h-[100svh] w-full bg-pink-50 overflow-hidden relative selection:bg-rose-200 selection:text-rose-900 font-sans flex flex-col items-center justify-center p-2 md:p-8">
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
          width: 'min(98vw, 1600px, calc((100svh - 60px) * (1600 / 1250)))', 
          aspectRatio: '1600 / 1250',
          maxHeight: 'min(1250px, calc(100svh - 60px))'
        }}
      >
        
        {/* Hardback Book Cover Backdrop */}
        <div 
          className="absolute inset-y-[-6px] rounded-lg shadow-[0_25px_65px_rgba(0,0,0,0.35)] border-2 border-rose-900/60 z-0 pointer-events-none transition-all duration-300"
          style={{
            left: currentLeft === null ? '50%' : '-8px',
            right: '-8px',
            background: 'linear-gradient(to right, var(--color-rose-950), var(--color-rose-900), var(--color-rose-955))'
          }}
        />
        {currentLeft !== null && (
          <div className="absolute left-1/2 top-[-6px] bottom-[-6px] w-[6px] -ml-[3px] bg-amber-500/20 z-0 pointer-events-none" />
        )}
        
        {/* Book Binding Shadow */}
        {currentLeft !== null && (
          <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-black/20 blur-md pointer-events-none z-0" />
        )}

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
              {/* Dynamic shadow as it turns away */}
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
              {/* Dynamic shadow as it turns towards viewer */}
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

      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={zoomedImage} 
              alt="Zoomed" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20" 
            />
            {/* Close instruction */}
            <div className="absolute top-6 right-6 text-white/50 text-sm font-medium tracking-wider">
              CLICK TO CLOSE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
