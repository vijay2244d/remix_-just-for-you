import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  Music,
  FolderHeart,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "./store";
import { MusicNoteRain } from "./components/MusicNoteRain";
import {
  PlaylistCover,
  ScrapbookJournalPage,
  PlaylistEnd,
  SCRAPBOOK_IMAGES,
  SCRAPBOOK_IMAGE_NAMES
} from "./pages/PlaylistPages";
import introConductor from "./assets/images/intro_conductor.jpg";

const OUTRO_ID = SCRAPBOOK_IMAGES.length + 1;

const NOTE_SYMBOLS = ["♩", "♪", "♫", "♬", "♭", "♯", "𝄞", "𝄢", "𝄽"];

const BackgroundDecor = () => {
  const [particles] = useState(() =>
    Array.from({ length: 20 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      size: Math.random() * 1.2 + 0.8,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * -20,
      drift: Math.random() * 10 - 5,
      rotation: Math.random() * 360,
      symbol: NOTE_SYMBOLS[idx % NOTE_SYMBOLS.length]
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-950/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-950/20 blur-[120px]" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-purple-400/10 font-serif font-bold select-none pointer-events-none"
          initial={{ left: `${p.left}%`, top: "-10%", rotate: p.rotation, opacity: 0, scale: p.size }}
          animate={{ top: "110%", x: `${p.drift}vw`, rotate: p.rotation + (p.drift > 0 ? 180 : -180), opacity: [0, 0.4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{ fontSize: `${p.size * 22}px` }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};

// Import all local audio files dynamically using Vite's glob import
const LOCAL_AUDIO = import.meta.glob<string>(
  "./assets/audio/*.mp3",
  { eager: true, import: "default" }
);

const isValidAudioSrc = (src: string | undefined): boolean => {
  return typeof src === "string" && src.length > 5;
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.4, delay: 1.8 } }
};

const containerVariants = {
  hidden: ({ isMobile }) => ({
    scale: 0.88,
    y: 40,
    opacity: 0,
    maxWidth: "475px",
    maxHeight: isMobile ? "260px" : "none"
  }),
  visibleClosed: ({ isMobile }) => ({
    scale: 1,
    y: 0,
    opacity: 1,
    maxWidth: "475px",
    maxHeight: isMobile ? "260px" : "none",
    transition: { type: "spring", stiffness: 120, damping: 19 }
  }),
  visibleOpen: ({ isMobile }) => ({
    scale: 1,
    y: 0,
    opacity: 1,
    maxWidth: isMobile ? "475px" : "950px",
    maxHeight: isMobile ? "800px" : "none",
    transition: { type: "spring", stiffness: 120, damping: 19 }
  }),
  exit: ({ isMobile }) => ({
    scale: 0.88,
    y: 40,
    opacity: 0,
    maxWidth: "475px",
    maxHeight: isMobile ? "260px" : "none",
    transition: {
      maxWidth: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 },
      maxHeight: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 },
      scale: { type: "tween", duration: 0.4, delay: 1.8 },
      y: { type: "tween", duration: 0.4, delay: 1.8 },
      opacity: { type: "tween", duration: 0.4, delay: 1.8 }
    }
  })
};

const coverVariants = {
  hidden: { rotateY: 0 },
  visibleClosed: {
    rotateY: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  },
  visibleOpen: {
    rotateY: -155,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }
  },
  exit: {
    rotateY: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  }
};

const shadowVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visibleClosed: {
    opacity: 0,
    scaleX: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  },
  visibleOpen: {
    opacity: 0.4,
    scaleX: 1,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }
  },
  exit: {
    opacity: 0,
    scaleX: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  }
};

const bookletVariants = {
  hidden: ({ isMobile }) => ({
    x: isMobile ? "0%" : "-100%",
    y: isMobile ? "-100%" : "0%",
    opacity: 0
  }),
  visibleClosed: ({ isMobile }) => ({
    x: isMobile ? "0%" : "-100%",
    y: isMobile ? "-100%" : "0%",
    opacity: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  }),
  visibleOpen: {
    x: "0%",
    y: "0%",
    opacity: 1,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }
  },
  exit: ({ isMobile }) => ({
    x: isMobile ? "0%" : "-100%",
    y: isMobile ? "-100%" : "0%",
    opacity: 0,
    transition: { type: "tween", duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0 }
  })
};

export const PlaylistLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUnlocked = useAppStore((state) => state.isUnlocked);

  // Audio ref — the actual player
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [showMusicNoteRain, setShowMusicNoteRain] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const shouldAutoPlayRef = useRef(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Butterfly background ref for CD overlay
  const cdButterfliesRef = useRef<HTMLDivElement>(null);
  const [coverOpen, setCoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("PLAYLIST_LAYOUT: MOUNTED");
    return () => console.log("PLAYLIST_LAYOUT: UNMOUNTED");
  }, []);

  const activeCd = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const subRoute = parts[1];
    if (subRoute === "cover") return 0;
    if (subRoute === "end") return OUTRO_ID;
    const parsed = parseInt(subRoute, 10);
    return isNaN(parsed) ? null : parsed;
  }, [location.pathname]);

  const cds = useMemo(() => {
    const list: Array<{ id: number; path: string; name: string; isSpecial: string | boolean; image: string; fileName: string }> = [];
    list.push({ id: 0, path: "/playlist/cover", name: "Opening Anthem", isSpecial: "gold", image: introConductor, fileName: "cover" });
    SCRAPBOOK_IMAGES.forEach((img, i) => {
      list.push({ id: i + 1, path: `/playlist/${i + 1}`, name: `Moment Track ${i + 1}`, isSpecial: false, image: img, fileName: SCRAPBOOK_IMAGE_NAMES[i] || "" });
    });
    list.push({ id: OUTRO_ID, path: "/playlist/end", name: "Closing Outro", isSpecial: "silver", image: introConductor, fileName: "end" });
    return list;
  }, []);

  const getPlaylistEntry = (cdId: number | null): string | string[] => {
    if (cdId === null) return "";
    const cdItem = cds.find(c => c.id === cdId);
    if (!cdItem || !cdItem.fileName) return "";

    // Check if there are multiple tracks (e.g., cdItem.fileName + "_1", cdItem.fileName + "_2"...)
    // Let's count how many tracks exist for this fileName
    const tracks: string[] = [];
    let trackIdx = 1;
    while (true) {
      const key = `./assets/audio/${cdItem.fileName}_${trackIdx}.mp3`;
      if (LOCAL_AUDIO[key]) {
        tracks.push(LOCAL_AUDIO[key]);
        trackIdx++;
      } else {
        break;
      }
    }

    if (tracks.length > 0) {
      return tracks;
    }

    // If no numbered tracks exist, check for a single track
    const singleKey = `./assets/audio/${cdItem.fileName}.mp3`;
    return LOCAL_AUDIO[singleKey] || "";
  };

  const [activeSongIndex, setActiveSongIndex] = useState(0);

  useEffect(() => {
    setActiveSongIndex(0);
  }, [activeCd]);

  // Reset states when CD changes (start as closed/hidden)
  useEffect(() => {
    setIsRevealed(false);
    setCoverOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    shouldAutoPlayRef.current = false;
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

    if (activeCd === null) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    }
  }, [activeCd]);

  // Click handler to open the CD cover, slide out booklet and play song
  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setShowMusicNoteRain(true);
    const noteTimer = setTimeout(() => setShowMusicNoteRain(false), 800);

    const audio = audioRef.current;
    if (audio) {
      if (isValidAudioSrc(audio.src)) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Playback on reveal failed:", err);
            setIsPlaying(false);
          });
      }
    }

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => {
      setCoverOpen(true);
    }, 2000);
  };

  useEffect(() => {
    if (location.pathname !== "/playlist") setShowSplash(false);
  }, [location.pathname]);

  // Load audio track when CD or song index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const entry = getPlaylistEntry(activeCd);
    const src = Array.isArray(entry) ? (entry[activeSongIndex] || "") : entry as string;

    if (src && isValidAudioSrc(src)) {
      setAudioError(null);
      audio.src = src;
      audio.load();
    } else {
      audio.src = "";
      setAudioError(null);
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setIsLoading(false);
  }, [activeCd, activeSongIndex, cds]);

  // Fallback tick for when no real audio is loaded
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const audio = audioRef.current;
    const hasAudio = audio && isValidAudioSrc(audio.src);
    if (isPlaying && !hasAudio) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) { setIsPlaying(false); return 0; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Picture click = play / pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isLoading) {
      console.log("Audio is still loading, please wait.");
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (isValidAudioSrc(audio.src)) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && isValidAudioSrc(audio.src)) setCurrentTime(audio.currentTime);
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio?.duration || 180);
  };

  const onCanPlay = useCallback(() => {
    const audio = audioRef.current;
    // Only auto-play if the cover has already finished opening
    if (audio && shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const onEnded = () => {
    const entry = getPlaylistEntry(activeCd);
    if (Array.isArray(entry) && activeSongIndex < entry.length - 1) {
      shouldAutoPlayRef.current = true;
      setActiveSongIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleScrub = (val: number) => {
    setCurrentTime(val);
    const audio = audioRef.current;
    if (audio && isValidAudioSrc(audio.src)) audio.currentTime = val;
  };

  // Butterfly animation in CD overlay background — same params as LockScreen
  useEffect(() => {
    if (activeCd === null) return;
    const el = cdButterfliesRef.current;
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
        console.error('CD Butterflies failed:', e);
      }
    })();
    return () => {
      destroyed = true;
      try { inst?.three?.renderer?.dispose(); } catch (_) { }
      try { el.innerHTML = ''; } catch (_) { }
    };
  }, [activeCd]);

  const rows = useMemo(() => {
    const chunkSize = Math.ceil(cds.length / 3);
    return [cds.slice(0, chunkSize), cds.slice(chunkSize, chunkSize * 2), cds.slice(chunkSize * 2)];
  }, [cds]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentCd = activeCd !== null ? cds.find(c => c.id === activeCd) || null : null;
  console.log("PLAYLIST_LAYOUT: RENDER activeCd =", activeCd, "currentCd =", currentCd !== null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-[100svh] w-full bg-zinc-950 overflow-hidden relative selection:bg-purple-800 selection:text-purple-200 font-sans flex flex-col items-center justify-center p-2 md:p-8 wood-floor"
    >
      {/* Hidden audio element — no controls, no visible UI */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onCanPlay}
        onEnded={onEnded}
        onLoadStart={() => { setIsLoading(true); setAudioError(null); }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onStalled={() => console.log("AUDIO_EVENT: stalled")}
        onError={(e) => {
          setIsLoading(false);
          setIsPlaying(false);
          setAudioError("Track unavailable.");
          console.error("Audio error code =", e.currentTarget.error?.code, "message =", e.currentTarget.error?.message);
        }}
        preload="auto"
        style={{ display: "none" }}
      />

      <style>{`
        .wood-floor {
          background-color: #2b1810;
          background-image:
            repeating-linear-gradient(90deg, transparent, transparent 150px, rgba(0,0,0,0.3) 150px, rgba(0,0,0,0.3) 153px),
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.02) 60px, rgba(255,255,255,0.02) 61px);
          background-size: 300px 100%, 100% 120px;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,_rgba(251,191,36,0.14)_0%,_transparent_75%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_90%,_rgba(168,85,247,0.1)_0%,_transparent_55%)] z-10" />

      <BackgroundDecor />
      <MusicNoteRain active={showMusicNoteRain} />

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#141210] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <div className="absolute inset-3 md:inset-4 border border-purple-800/10 pointer-events-none rounded-2xl" />
            <div className="flex flex-col items-center max-w-lg mx-auto gap-5 md:gap-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="w-[200px] md:w-[240px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-4 border-amber-950/20"
                style={{ animationDuration: "3.5s" }}
              >
                <img src={introConductor} alt="Portrait" className="w-full h-full object-cover" />
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-xl md:text-2xl font-bold font-serif text-amber-500 tracking-wide uppercase">காதல் இசை • Our Playlist</h1>
                <p className="text-xs text-amber-200/60 leading-relaxed font-serif italic max-w-xs mx-auto">"உன் இதயம் மீட்டும் இசையிலே என் உலகம் சுழலுதடி... 🎵"</p>
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto" />
              </div>
              <motion.button
                onClick={() => setShowSplash(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white font-medium text-[10px] md:text-xs uppercase tracking-widest shadow-lg cursor-pointer border border-red-500/30"
              >
                Open Crate • பெட்டியைத் திறக்கவும் 🎵
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CD Crate */}
      <div className="relative flex flex-col items-center justify-center z-10 w-full max-w-5xl">
        {!activeCd && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate("/")}
            className="mb-8 px-5 py-2 rounded-lg bg-stone-900/65 border border-amber-950/40 text-amber-400 hover:text-amber-300 font-serif text-xs uppercase tracking-widest flex items-center gap-2 shadow-md cursor-pointer select-none"
          >
            <FolderHeart className="w-4 h-4" />
            Back to Dashboard 📚
          </motion.button>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
          className={`relative w-full max-w-[850px] p-6 pb-20 rounded-2xl border-t-8 border-red-500 bg-gradient-to-b from-red-600 via-red-700 to-red-800 shadow-[0_35px_80px_rgba(0,0,0,0.8)] flex flex-col gap-6 select-none transition-all duration-500 ${activeCd !== null ? "blur-sm scale-95 opacity-30 pointer-events-none" : ""}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent rounded-2xl pointer-events-none z-0" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-red-950/90 border border-red-800/40 rounded-full z-10 shadow-inner" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-red-950/90 border border-red-800/40 rounded-full z-10 shadow-inner" />

          <div className="flex flex-col gap-6 relative z-10">
            {rows.map((row, rIdx) => (
              <div key={rIdx} className="relative flex items-center justify-center bg-black/60 rounded-xl px-4 py-3 border border-red-900/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] h-32 md:h-36 overflow-hidden">
                <div className="flex -space-x-4 md:-space-x-5 overflow-visible">
                  {row.map((cd) => {
                    const isGold = cd.isSpecial === "gold";
                    const isSilver = cd.isSpecial === "silver";
                    return (
                      <motion.div
                        key={cd.id}
                        whileHover={{ y: -24, scale: 1.08, zIndex: 50, transition: { type: "spring", stiffness: 350, damping: 18 } }}
                        onClick={() => navigate(cd.path)}
                        className="w-12 h-24 md:w-14 md:h-28 rounded-sm relative cursor-pointer border border-white/10 shadow-[2px_5px_8px_rgba(0,0,0,0.5)] transform-gpu origin-bottom flex flex-col justify-between p-1 bg-zinc-950"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-stone-900 border-l border-white/5" />
                        <div className={`text-[7px] md:text-[8px] font-mono text-center tracking-tighter py-0.5 rounded ${isGold ? "bg-amber-500/30 text-amber-300" : isSilver ? "bg-stone-500/30 text-stone-300" : "bg-purple-900/30 text-purple-300"}`}>
                          {cd.id === 0 ? "INTRO" : cd.id === OUTRO_ID ? "OUTRO" : cd.id.toString().padStart(2, "0")}
                        </div>
                        <div className={`h-8 w-1.5 mx-auto rounded-full ${isGold ? "bg-amber-400" : isSilver ? "bg-stone-400" : cd.id % 2 === 0 ? "bg-purple-500" : "bg-pink-500"}`} />
                        <div className="text-[7px] text-white/40 flex justify-center pb-0.5">
                          {isGold || isSilver ? <Sparkles className="w-2 h-2 text-amber-300" /> : "♪"}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#fffdf9] border-2 border-red-950 px-10 py-1.5 rounded-md shadow-lg transform -rotate-1 flex flex-col items-center select-none pointer-events-none z-10">
            <span className="font-serif font-black text-red-700 tracking-wider text-xs md:text-sm uppercase italic">Our Playlist Crate</span>
            <span className="text-[7px] text-red-900/40 uppercase tracking-widest font-sans font-bold -mt-0.5">Est. 2026 • For Divya</span>
          </div>
        </motion.div>

        {!activeCd && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 text-center select-none pointer-events-none">
            <h2 className="text-sm font-serif font-bold text-amber-500/80 uppercase tracking-widest flex items-center gap-1.5 justify-center">
              <Music className="w-3.5 h-3.5" /> காதல் இசை • The Music Crate
            </h2>
            <p className="text-[10px] text-amber-200/45 italic font-serif mt-1">Select any CD to open its memory liner booklet. Click the picture to play / stop the song.</p>
          </motion.div>
        )}
      </div>

      {/* CD Case Overlay */}
      <AnimatePresence>
        {activeCd !== null && currentCd && (
          <motion.div
            key="cd-overlay-wrapper"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
          >
            {/* Butterfly background inside CD overlay */}
            <div
              ref={cdButterfliesRef}
              className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/playlist")}
              className="absolute top-4 right-4 px-5 py-2.5 rounded-full bg-red-700 text-white font-medium text-[10px] md:text-xs uppercase tracking-widest shadow-lg border border-red-500/30 cursor-pointer flex items-center gap-2 z-50"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Eject CD ⏏️
            </motion.button>

            {!isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs md:text-sm font-serif font-bold text-amber-500/90 uppercase tracking-widest flex items-center gap-2 pointer-events-none z-50 select-none text-center px-4"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" /> Click CD Cover to Open & Play 🎵
              </motion.div>
            )}

            <motion.div
              key={activeCd}
              variants={containerVariants}
              custom={{ isMobile }}
              initial="hidden"
              animate={isRevealed ? "visibleOpen" : "visibleClosed"}
              exit="exit"
              onClick={handleReveal}
              className={`w-full bg-[#141211] rounded-2xl shadow-[0_35px_80px_rgba(0,0,0,0.85)] border border-stone-800 flex flex-col md:flex-row relative z-40 overflow-hidden select-none transition-shadow duration-300 ${!isRevealed ? "cursor-pointer hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-purple-500/30" : ""}`}
              style={{
                minHeight: isMobile ? "260px" : "min(480px, 90svh)",
                perspective: "1200px",
                transformStyle: "preserve-3d" as const,
              }}
            >
              {/* Spine divider */}
              <motion.div
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isRevealed ? 1.5 : 0 }}
                className="absolute left-1/2 top-0 bottom-0 w-2.5 -ml-[5px] bg-[#1e1b18] border-x border-[#0e0c0b] shadow-[inset_0_0_8px_rgba(0,0,0,0.9)] z-20 pointer-events-none hidden md:block"
              />

              {/* ── 3D Cover Panel (swings open from left hinge) ────────── */}
              <motion.div
                key={`cover-${activeCd}`}
                variants={coverVariants}
                animate={isRevealed ? "visibleOpen" : "visibleClosed"}
                initial="hidden"
                exit="exit"
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d" as const,
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: isMobile ? "100%" : "475px",
                  zIndex: 30,
                }}
              >
                {/* ── FRONT face of cover ─────────────────────────────── */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    backgroundColor: "#1c1c1e",
                    borderRadius: "1rem 0 0 1rem",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                    boxShadow: "4px 0 20px rgba(0,0,0,0.6)",
                  }}
                >
                  <div style={{ position: "absolute", inset: "0.75rem", border: "3px solid rgba(255,255,255,0.05)", borderRadius: "0.5rem", pointerEvents: "none" }} />
                  <div style={{ width: "11rem", height: "11rem", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 30px rgba(0,0,0,0.6)", marginBottom: "1rem", background: "#0a0a0a" }}>
                    <img src={currentCd.image} alt={currentCd.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#a78bfa", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      {activeCd === 0 ? "INTRO CD" : activeCd === OUTRO_ID ? "OUTRO CD" : `MOMENT TRACK ${activeCd}`}
                    </span>
                    <h3 style={{ fontSize: "14px", fontFamily: "serif", fontWeight: 700, color: "white", letterSpacing: "0.04em", margin: "0 0 6px" }}>
                      {activeCd === 0 ? "Opening Anthem" : activeCd === OUTRO_ID ? "Closing Outro" : `Memory Disc ${activeCd}`}
                    </h3>
                    <div style={{ width: "3rem", height: "1px", background: "rgba(168,85,247,0.3)", margin: "0 auto 4px" }} />
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: "sans-serif" }}>Love Collection Vol. 2</span>
                  </div>
                </div>

                {/* ── BACK face of cover (inside of lid visible while swinging) ── */}
                <div
                  style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden" as const,
                    transform: "rotateY(180deg)",
                    backgroundColor: "#111113",
                    borderRadius: "0 1rem 1rem 0",
                    border: "1px solid rgba(255,255,255,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                  }}
                >
                  {/* Inner tray artwork on the back of lid */}
                  <div style={{ width: "8rem", height: "8rem", borderRadius: "50%", border: "2px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }}>
                    <svg viewBox="0 0 100 100" style={{ width: "60%", height: "60%", opacity: 0.15 }}>
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#a78bfa" strokeWidth="1" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="#a78bfa" strokeWidth="1" />
                      <circle cx="50" cy="50" r="6" fill="#a78bfa" opacity="0.3" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "8px", color: "rgba(168,85,247,0.35)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>JUST FOR YOU</span>
                </div>

                {/* Dynamic shadow on the floor as the cover swings open */}
                <motion.div
                  variants={shadowVariants}
                  animate={isRevealed ? "visibleOpen" : "visibleClosed"}
                  initial="hidden"
                  exit="exit"
                  style={{
                    position: "absolute",
                    bottom: "-12px",
                    left: "5%",
                    right: "-20%",
                    height: "20px",
                    background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
                    transformOrigin: "left center",
                    pointerEvents: "none",
                    filter: "blur(6px)",
                  }}
                />
              </motion.div>
              {/* ─────────────────────────────────────────────────────────── */}

              {/* LEFT: Picture — CLICK TO PLAY/STOP */}
              <div className="w-full md:w-[475px] md:min-w-[475px] shrink-0 flex flex-col relative overflow-hidden z-10" style={{ minHeight: "240px" }}>
                {/* Full-bleed cover image */}
                <img src={currentCd.image} alt={currentCd.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* THE PICTURE IS THE PLAY BUTTON — click anywhere on image to play/stop */}
                <div
                  onClick={(e) => {
                    if (isRevealed) {
                      e.stopPropagation();
                      togglePlay();
                    }
                  }}
                  className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center group"
                >
                  {/* Big play/pause/loading indicator in centre */}
                  <motion.div
                    key={isLoading ? "loading" : isPlaying ? "pause" : "play"}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    className={`w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl transition-all duration-200 ${isPlaying ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" : "opacity-90"}`}
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-4 border-purple-450 border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 fill-white translate-x-[3px]" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </motion.div>

                  {/* Tap hint / Loading / Error label */}
                  {audioError ? (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-20 text-[10px] text-red-400 font-sans uppercase tracking-widest select-none pointer-events-none px-4 text-center font-bold"
                    >
                      {audioError}
                    </motion.span>
                  ) : isLoading ? (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-20 text-[10px] text-purple-300 font-sans uppercase tracking-widest select-none pointer-events-none px-4 text-center animate-pulse"
                    >
                      Loading Song... 🎵
                    </motion.span>
                  ) : !isPlaying ? (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-20 text-[10px] text-white/60 font-sans uppercase tracking-widest select-none pointer-events-none"
                    >
                      Tap picture to play ▶
                    </motion.span>
                  ) : null}
                </div>

                {/* Floating notes when playing */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  <AnimatePresence>
                    {isPlaying && ["🎵", "♪", "♫", "♩", "💜"].map((sym, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 300, x: 30 + i * 50, scale: 0.6 }}
                        animate={{ opacity: [0, 0.8, 0], y: 30, x: 30 + i * 50 + Math.sin(i) * 20, scale: [0.6, 1.1, 0.7] }}
                        transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.9 }}
                        className="absolute text-purple-300 text-base drop-shadow-lg"
                      >
                        {sym}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Multi-track selector */}
                {activeCd !== null && Array.isArray(getPlaylistEntry(activeCd)) && (getPlaylistEntry(activeCd) as string[]).length > 1 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 z-30"
                  >
                    {(getPlaylistEntry(activeCd) as string[]).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          shouldAutoPlayRef.current = true;
                          setActiveSongIndex(idx);
                        }}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${activeSongIndex === idx ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow border border-white/20" : "text-white/60 hover:text-white"}`}
                      >
                        Song {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom info + frequency visualizer */}
                <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-purple-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/5 font-bold tracking-widest">
                      {activeCd === 0 ? "INTRO CD" : activeCd === OUTRO_ID ? "OUTRO CD" : `TRACK ${activeCd}`}
                    </span>
                    <span className="text-[8px] font-mono text-white/40">{formatTime(currentTime)}</span>
                  </div>
                  {/* Frequency bars */}
                  <div className="flex gap-[3px] items-end h-8 bg-black/40 py-1 px-3 rounded-xl border border-white/10">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const delays = [0.1, 0.4, 0.2, 0.5, 0.1, 0.3, 0.6, 0.2, 0.5, 0.3, 0.1, 0.4, 0.2, 0.5, 0.1, 0.3, 0.6, 0.2, 0.5, 0.3, 0.1, 0.4, 0.2, 0.5, 0.1, 0.3, 0.6, 0.2];
                      return (
                        <motion.div
                          key={i}
                          className="w-[2.5px] bg-gradient-to-t from-purple-400 via-pink-500 to-amber-300 rounded-full"
                          animate={isPlaying ? { height: [4, 22, 6, 26, 4] } : { height: 4 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: delays[i] }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT: Liner Notes Booklet — NO playbar here */}
              <motion.div
                variants={bookletVariants}
                custom={{ isMobile }}
                initial="hidden"
                animate={isRevealed ? "visibleOpen" : "visibleClosed"}
                exit="exit"
                className="w-full md:w-[475px] md:min-w-[475px] shrink-0 bg-[#fcfaf4] relative flex flex-col overflow-y-auto rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none z-5"
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.08] to-transparent pointer-events-none z-10" />
                <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-white/70 shadow-[0_0_8px_rgba(255,255,255,1)] pointer-events-none z-10" />

                {/* Just the scrapbook content — no player UI here */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {activeCd === 0 ? <PlaylistCover /> : activeCd === OUTRO_ID ? <PlaylistEnd /> : <ScrapbookJournalPage pageNumber={activeCd} />}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
