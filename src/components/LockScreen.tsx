import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ScanFace, Lock } from "lucide-react";
import { KissRain } from "./KissRain";
import { HeartRain } from "./HeartRain";

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [phase, setPhase] = useState<'auth' | 'auth-success' | 'caption' | 'lock' | 'final-caption'>('auth');
  const [progress, setProgress] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const butterfliesRef = useRef<HTMLDivElement>(null);

  const [binaryDrops, setBinaryDrops] = useState<{ id: number; text: string; x: number; y: number; speed: number }[]>([]);

  // Lock phase interactive states
  const [clicks, setClicks] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const targetClicks = 30;
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerActivity = useCallback(() => {
    setIsPressing(true);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => setIsPressing(false), 350);
  }, []);

  // ─── Background Asset Preloader ─────────────────────────────────────────
  // Fires immediately on lock screen mount — during biometric auth (~4s),
  // auth-success (2.5s), caption (3s), and lock phase, giving ~9+ seconds
  // to silently preload everything before the user reaches the playlist.
  useEffect(() => {
    let cancelled = false;

    const preload = async () => {
      // 1. Pre-import the threejs-toys butterfly library (heaviest, do first)
      try {
        await import(/* @vite-ignore */ 'https://unpkg.com/threejs-toys@0.0.7/build/threejs-toys.module.cdn.min.js');
      } catch (_) { /* CDN may be unavailable, ignore */ }

      if (cancelled) return;

      // 2. Preload all music book images using Image() — browser caches them
      const imageModules = import.meta.glob<string>(
        '../assets/images/*.{png,jpg,jpeg,webp}',
        { eager: true, import: 'default' }
      );
      const imageUrls = Object.values(imageModules);

      // Also load scrapbook images from music book pictures folder
      const scrapImages = import.meta.glob<string>(
        '../../music book pictures/Modern Elegant Couple Wedding Photo Poster/*.png',
        { eager: true, import: 'default' }
      );
      const scrapUrls = Object.values(scrapImages);

      const allImageUrls = [...imageUrls, ...scrapUrls];
      allImageUrls.forEach(src => {
        if (!src || cancelled) return;
        const img = new Image();
        img.src = src;
      });

      if (cancelled) return;

      // 3. Preload audio files — fetch the first 64KB of each to warm cache
      const audioModules = import.meta.glob<string>(
        '../assets/audio/*.mp3',
        { eager: true, import: 'default' }
      );
      const audioUrls = Object.values(audioModules);

      // Stagger audio preloads so we don't flood the network at once
      for (let i = 0; i < audioUrls.length; i++) {
        if (cancelled) break;
        const src = audioUrls[i];
        if (!src) continue;
        try {
          await fetch(src, { headers: { Range: 'bytes=0-65535' }, cache: 'force-cache' });
        } catch (_) { /* Ignore individual fetch errors */ }
        // Small gap between fetches to avoid network congestion
        await new Promise(r => setTimeout(r, 80));
      }
    };

    preload();
    return () => { cancelled = true; };
  }, []); // Run once on mount only
  // ────────────────────────────────────────────────────────────────────────

  // Phase 1: Auth (Biometric Scan)
  useEffect(() => {
    if (phase === 'auth') {
      let stream: MediaStream | null = null;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(s => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
            }
          })
          .catch(err => {
            console.error("Error accessing webcam:", err);
            setCameraError(true);
          });
      } else {
        console.warn("navigator.mediaDevices or getUserMedia not available");
        setCameraError(true);
      }

      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (stream) {
                stream.getTracks().forEach(t => t.stop());
              }
              setPhase('auth-success');
            }, 800);
            return 100;
          }
          return Math.min(100, p + Math.floor(Math.random() * 15) + 5);
        });
      }, 300);

      return () => {
        clearInterval(interval);
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
      };
    }
  }, [phase]);

  // Phase 2: Auth Success duration
  useEffect(() => {
    if (phase === 'auth-success') {
      const timer = setTimeout(() => {
        setPhase('caption');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 2.5: Caption
  useEffect(() => {
    if (phase === 'caption') {
      const timer = setTimeout(() => {
        setPhase('lock');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Matrix-style falling binary drops for auth phases
  useEffect(() => {
    if (phase !== 'lock') {
      const interval = setInterval(() => {
        setBinaryDrops(prev => {
          // keep up to 40 drops
          const newDrops = prev.filter(d => d.y < 120);
          if (newDrops.length < 40) {
            newDrops.push({
              id: Date.now() + Math.random(),
              text: Math.random() > 0.5 ? '1' : '0',
              x: Math.random() * 100,
              y: -10,
              speed: 1 + Math.random() * 2
            });
          }
          return newDrops.map(d => ({ ...d, y: d.y + d.speed }));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Phase 3: Lock Decay & Progress
  useEffect(() => {
    if (phase !== 'lock') return;
    let intervalId: NodeJS.Timeout;
    if (!isPressing) {
      intervalId = setInterval(() => {
        setClicks(c => Math.max(0, c - 1));
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isPressing, phase]);

  useEffect(() => {
    if (clicks >= targetClicks && phase === 'lock') {
      setPhase('final-caption');
    }
  }, [clicks, phase, targetClicks]);

  useEffect(() => {
    if (phase === 'final-caption') {
      const timer = setTimeout(() => {
        onUnlock();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, onUnlock]);

  const handleClick = useCallback(() => {
    if (phase !== 'lock') return;
    setClicks(c => c + 1);
    triggerActivity();
  }, [phase, triggerActivity]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'lock') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, handleClick]);

  // Butterflies 3D background — lock phase only
  useEffect(() => {
    if (phase !== 'lock') return;
    // Capture ref value immediately — React clears refs before cleanup runs
    const el = butterfliesRef.current;
    if (!el) return;
    let destroyed = false;
    let inst: any = null;
    (async () => {
      try {
        const { butterfliesBackground } = await import(
          /* @vite-ignore */ 'https://unpkg.com/threejs-toys@0.0.7/build/threejs-toys.module.cdn.min.js'
        );
        if (destroyed) return;
        el.innerHTML = '';
        inst = butterfliesBackground({
          el,
          eventsEl: el,
          gpgpuSize: 96,
          background: 0xfff1f2,
          material: 'basic',
          materialParams: { transparent: true, alphaTest: 0.5 },
          texture: 'https://assets.codepen.io/33787/butterflies.png',
          textureCount: 4,
          wingsScale: [1, 1, 1],
          wingsWidthSegments: 8,
          wingsHeightSegments: 8,
          wingsSpeed: 0.75,
          wingsDisplacementScale: 1.25,
          noiseCoordScale: 0.01,
          noiseTimeCoef: 0.0005,
          noiseIntensity: 0.0025,
          attractionRadius1: 100,
          attractionRadius2: 150,
          maxVelocity: 0.1,
        });
      } catch (e) {
        console.error('Butterflies failed:', e);
      }
    })();
    return () => {
      destroyed = true;
      try { inst?.three?.renderer?.dispose(); } catch (_) {}
      // Use captured el — butterfliesRef.current may be null by this point
      try { el.innerHTML = ''; } catch (_) {}
    };
  }, [phase]);

  const clickRatio = Math.min(1, clicks / targetClicks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      ref={containerRef as any}
      tabIndex={0}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden focus:outline-none transition-colors duration-1000 ${(phase === 'lock' || phase === 'final-caption') ? 'bg-rose-50 font-sans' : 'bg-black font-mono'}`}
    >
      {/* Cyber Backgrounds */}
      <AnimatePresence>
        {(phase === 'auth' || phase === 'auth-success') && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #0f2e18 1px, transparent 1px),
                  linear-gradient(to bottom, #0f2e18 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                background: 'radial-gradient(circle at center, transparent 0%, #000 100%)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic Background */}
      <AnimatePresence>
        {(phase === 'lock' || phase === 'final-caption') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none bg-rose-50"
          >
            {/* Butterflies 3D animation — only on lock phase */}
            {phase === 'lock' && (
              <div
                ref={butterfliesRef}
                className="absolute inset-0 overflow-hidden"
              />
            )}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(#fda4af 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none'
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Binary Matrix Drops */}
      {(phase !== 'lock' && phase !== 'final-caption') && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden text-green-500/40 text-xl font-bold select-none">
          {binaryDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute text-center w-6"
              style={{
                left: `${drop.x}vw`,
                top: `${drop.y}vh`,
              }}
            >
              {drop.text}
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">

        {phase === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-6 max-w-sm w-full px-8 z-10 text-green-500"
          >
            {/* HUD Camera Frame */}
            <div className="w-48 h-48 md:w-56 md:h-56 relative group">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500 z-10" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500 z-10" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500 z-10" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500 z-10" />

              <div className="w-full h-full overflow-hidden bg-black/50 border border-green-500/30 relative mix-blend-screen shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                {!cameraError ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100 grayscale contrast-125 sepia-[0.3] hue-rotate-90 opacity-60" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                    <ScanFace className="w-16 h-16 text-green-500/50 mb-2" />
                    <span className="text-xs text-green-500/50 uppercase tracking-widest">NO FFED</span>
                  </div>
                )}

                {/* HUD Scanner Line */}
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.6)] z-20"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMzQsMTk3LDk0LDAuMykiPjwvcmVjdD4KPC9zdmc+')] z-10 opacity-60 mix-blend-overlay" />
              </div>
            </div>

            <div className="flex flex-col items-center w-full">
              <h2 className="text-lg md:text-xl font-bold text-green-400 tracking-widest text-center uppercase animate-pulse">
                Biometric Scan
              </h2>
              <p className="text-green-500/60 text-xs mt-1 uppercase tracking-widest">
                Establishing neural link...
              </p>
            </div>

            <div className="w-full h-1 bg-green-900/40 mt-2 relative overflow-hidden">
              <motion.div
                className="h-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            <div className="w-full flex justify-between text-[10px] text-green-500/50 tracking-widest uppercase">
              <span>SYS_AUTH_REQ: {progress}%</span>
              <span>SEC_LEVEL: ALPHA</span>
            </div>
          </motion.div>
        )}

        {phase === 'auth-success' && (
          <motion.div
            key="auth-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center gap-6 max-w-md w-full px-8 text-center z-10"
          >
            <div className="w-24 h-24 rounded-full border-2 border-green-400 bg-green-500/10 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(74,222,128,0.4)] relative">
              <div className="absolute inset-0 rounded-full border border-green-400 animate-ping opacity-30" />
              <ShieldCheck className="w-12 h-12 text-green-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-green-400 tracking-widest uppercase shadow-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                Access Granted
              </h2>
              <p className="text-green-500/70 text-sm tracking-widest uppercase font-mono">
                Identity Confirmed. Welcome.
              </p>
            </div>
          </motion.div>
        )}

        {phase === 'caption' && (
          <motion.div
            key="caption"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center z-10 px-8 text-center"
          >
            <motion.h2
              initial={{ textShadow: "0 0 0px rgba(74,222,128,0)" }}
              animate={{ textShadow: "0 0 20px rgba(74,222,128,0.8)" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatType: "reverse" }}
              className="text-3xl md:text-5xl font-display font-medium text-green-400 tracking-wider lowercase"
            >
              you are the one, Super one
            </motion.h2>
          </motion.div>
        )}

        {phase === 'final-caption' && (
          <motion.div
            key="final-caption"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center z-10 px-8 text-center gap-4"
          >
            <motion.p
              className="text-lg md:text-2xl font-display font-medium text-rose-400 tracking-wide italic"
            >
              thats how you unlock my love book
            </motion.p>
            <motion.h2
              className="text-3xl md:text-5xl font-display font-medium text-rose-500 tracking-wider"
            >
              Thanks for save the love life🌚
            </motion.h2>
          </motion.div>
        )}

        {phase === 'lock' && (
          <motion.div
            key="lock"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleClick}
            className="flex flex-col items-center gap-8 z-20 max-w-sm w-full p-8 relative bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 cursor-pointer"
          >
            <div className="z-10 relative text-center flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center mb-6 border border-rose-50 relative overflow-hidden">
                <div className={`absolute inset-0 bg-rose-100 transition-opacity duration-300 ${isPressing ? 'opacity-100' : 'opacity-0'}`} />
                <motion.div animate={isPressing ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={isPressing ? { repeat: Infinity, duration: 0.6 } : {}}>
                  <Lock className="w-8 h-8 text-rose-500 relative z-10" />
                </motion.div>
              </div>
              <motion.h2
                animate={isPressing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={isPressing ? { repeat: Infinity, duration: 0.6 } : {}}
                className="text-2xl md:text-3xl font-display font-bold text-rose-800 tracking-tight"
              >
                Just For You
              </motion.h2>
            </div>

            {/* Heartbeat EKG Line */}
            <div
              className="w-full h-12 relative flex items-center justify-center text-rose-500 my-1"
              style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                className={`stroke-current transition-opacity duration-300 ${isPressing ? 'opacity-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'opacity-20'}`}
              >
                <motion.g
                  initial={{ x: 0 }}
                  animate={isPressing ? { x: -200 } : { x: 0 }}
                  transition={isPressing ? { repeat: Infinity, duration: 1.5, ease: 'linear' } : { duration: 0.5 }}
                >
                  <path d="M0 20 H50 L60 0 L70 40 L80 20 H120 L130 10 L140 30 L150 20 H200" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M200 20 H250 L260 0 L270 40 L280 20 H320 L330 10 L340 30 L350 20 H400" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
              </svg>
            </div>

            {/* Measuring Progress Bar */}
            <div className="w-full space-y-2 z-10 relative">
              <div className="flex justify-between text-xs font-bold text-rose-700 uppercase tracking-widest">
                <span>Unlocking</span>
                <span>{Math.floor(clickRatio * 100)}%</span>
              </div>
              <div className="w-full h-4 bg-rose-100/50 rounded-full overflow-hidden flex shadow-inner border border-rose-200/50 p-[2px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${clickRatio * 100}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <KissRain active={phase === 'lock' && isPressing} />
      <HeartRain active={phase === 'lock' && isPressing} />
    </motion.div>
  );
};
