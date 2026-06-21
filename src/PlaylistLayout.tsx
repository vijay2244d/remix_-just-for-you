import { useEffect, useState, useRef, useMemo } from "react";
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

  const activeCd = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const subRoute = parts[1];
    if (subRoute === "cover") return 0;
    if (subRoute === "end") return 54;
    const parsed = parseInt(subRoute, 10);
    return isNaN(parsed) ? null : parsed;
  }, [location.pathname]);

  const cds = useMemo(() => {
    const list: Array<{ id: number; path: string; name: string; isSpecial: string | boolean; image: string; fileName: string }> = [];
    list.push({ id: 0, path: "/playlist/cover", name: "Opening Anthem", isSpecial: "gold", image: introConductor, fileName: "cover" });
    SCRAPBOOK_IMAGES.forEach((img, i) => {
      list.push({ id: i + 1, path: `/playlist/${i + 1}`, name: `Moment Track ${i + 1}`, isSpecial: false, image: img, fileName: SCRAPBOOK_IMAGE_NAMES[i] || "" });
    });
    list.push({ id: 54, path: "/playlist/end", name: "Closing Outro", isSpecial: "silver", image: introConductor, fileName: "end" });
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

  // Show note rain + prepare autoplay when CD opens
  useEffect(() => {
    if (activeCd !== null) {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowMusicNoteRain(true);
      shouldAutoPlayRef.current = true;
      const timer = setTimeout(() => setShowMusicNoteRain(false), 500);
      return () => clearTimeout(timer);
    } else {
      shouldAutoPlayRef.current = false;
      setIsPlaying(false);
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.src = ""; }
    }
  }, [activeCd]);

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

  const onCanPlay = () => {
    const audio = audioRef.current;
    if (audio && shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

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

  const rows = useMemo(() => {
    const chunkSize = Math.ceil(cds.length / 3);
    return [cds.slice(0, chunkSize), cds.slice(chunkSize, chunkSize * 2), cds.slice(chunkSize * 2)];
  }, [cds]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentCd = activeCd !== null ? cds.find(c => c.id === activeCd) || null : null;

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
                          {cd.id === 0 ? "INTRO" : cd.id === 54 ? "OUTRO" : cd.id.toString().padStart(2, "0")}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/playlist")}
              className="absolute top-4 right-4 px-5 py-2.5 rounded-full bg-red-700 text-white font-medium text-[10px] md:text-xs uppercase tracking-widest shadow-lg border border-red-500/30 cursor-pointer flex items-center gap-2 z-50"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Eject CD ⏏️
            </motion.button>

            <motion.div
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 40, opacity: 0, transition: { delay: 0.3, duration: 0.4 } }}
              transition={{ type: "spring", stiffness: 120, damping: 19 }}
              className="w-full max-w-[950px] bg-[#141211] rounded-2xl shadow-[0_35px_80px_rgba(0,0,0,0.85)] border border-stone-800 flex flex-col md:flex-row relative z-40 overflow-hidden"
              style={{ minHeight: "min(480px, 90svh)", perspective: "1500px" }}
            >
              {/* Spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2.5 -ml-[5px] bg-[#1e1b18] border-x border-[#0e0c0b] shadow-[inset_0_0_8px_rgba(0,0,0,0.9)] z-20 pointer-events-none hidden md:block" />

              {/* 3D Swing Cover */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -110 }}
                exit={{ rotateY: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.3 }}
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 bg-stone-900 border border-stone-850 rounded-l-2xl z-30 shadow-2xl flex flex-col items-center justify-center p-6 select-none pointer-events-none"
              >
                <div className="absolute inset-3 border-4 border-stone-800 rounded-lg pointer-events-none" />
                <div className="w-44 h-44 md:w-48 md:h-48 rounded-lg overflow-hidden border border-white/10 shadow-lg mb-4 bg-stone-950">
                  <img src={currentCd.image} alt={currentCd.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center space-y-1.5">
                  <span className="text-[9px] font-mono text-purple-400 font-bold tracking-widest uppercase">
                    {activeCd === 0 ? "INTRO CD" : activeCd === 54 ? "OUTRO CD" : `MOMENT TRACK ${activeCd}`}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-white tracking-wide">
                    {activeCd === 0 ? "Opening Anthem" : activeCd === 54 ? "Closing Outro" : `Memory Disc ${activeCd}`}
                  </h3>
                  <div className="w-12 h-[1px] bg-purple-500/30 mx-auto" />
                  <span className="text-[8px] text-white/40 uppercase tracking-widest font-sans font-semibold block">Love Collection Vol. 2</span>
                </div>
              </motion.div>

              {/* LEFT: Picture — CLICK TO PLAY/STOP */}
              <div className="w-full md:w-1/2 flex flex-col relative overflow-hidden" style={{ minHeight: "240px" }}>
                {/* Full-bleed cover image */}
                <img src={currentCd.image} alt={currentCd.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* THE PICTURE IS THE PLAY BUTTON — click anywhere on image to play/stop */}
                <div
                  onClick={togglePlay}
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
                      {activeCd === 0 ? "INTRO CD" : activeCd === 54 ? "OUTRO CD" : `TRACK ${activeCd}`}
                    </span>
                    <span className="text-[8px] font-mono text-white/40">{formatTime(currentTime)}</span>
                  </div>
                  {/* Frequency bars */}
                  <div className="flex gap-[3px] items-end h-8 bg-black/40 py-1 px-3 rounded-xl border border-white/10">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const delays = [0.1,0.4,0.2,0.5,0.1,0.3,0.6,0.2,0.5,0.3,0.1,0.4,0.2,0.5,0.1,0.3,0.6,0.2,0.5,0.3,0.1,0.4,0.2,0.5,0.1,0.3,0.6,0.2];
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
              <div className="w-full md:w-1/2 bg-[#fcfaf4] relative flex flex-col overflow-y-auto rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.08] to-transparent pointer-events-none z-10" />
                <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-white/70 shadow-[0_0_8px_rgba(255,255,255,1)] pointer-events-none z-10" />

                {/* Just the scrapbook content — no player UI here */}
                <div className="flex-1 flex flex-col justify-center items-center">
                  {activeCd === 0 ? <PlaylistCover /> : activeCd === 54 ? <PlaylistEnd /> : <ScrapbookJournalPage pageNumber={activeCd} />}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
