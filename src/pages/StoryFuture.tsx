import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Infinity as InfinityIcon } from "lucide-react";
import { TiltCard } from "../components/TiltCard";
import futureMusic from "../assets/background.mp3";

export const StoryFuture = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync state on update, handle autoplay and cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Auto-play when the user enters/mounts the Future page
    audio.play().catch(err => {
      console.log("Autoplay was prevented by the browser. Interaction required: ", err);
    });

    // Cleanup: Stop the song when they leave/unmount the page
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      {/* HTML5 Audio Element (Hidden for surprise background music) */}
      <audio
        ref={audioRef}
        src={futureMusic}
        preload="auto"
      />

      <div className="text-center shrink-0">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-rose-900 font-display"
        >
          Our Future
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col w-full max-w-sm mx-auto perspective-1000 shrink-0"
      >
        <TiltCard className="flex flex-col items-center text-center gap-3 bg-white/80 p-5 md:p-6 shadow-sm border border-rose-50">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <motion.div
              animate={{ scale: [1, 1, 1.15, 1] }}
              transition={{ duration: 3, times: [0, 0.45, 0.5, 1], repeat: Infinity }}
              className="bg-gradient-to-br from-pink-100 to-rose-100 p-2 md:p-3 rounded-full text-rose-500 border border-pink-200 z-10 shadow-md"
            >
              <InfinityIcon className="w-5 h-5 md:w-7 md:h-7" />
            </motion.div>
            
            <motion.div
              animate={{ 
                x: [-60, 0, 0], 
                y: [-60, 0, 0], 
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, times: [0, 0.45, 0.5, 1], repeat: Infinity }}
              className="absolute z-20 w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_10px_2px_rgba(253,224,71,0.8)]"
            />
          </div>

          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/90 text-[10px] md:text-[12px] leading-snug md:leading-relaxed font-medium mt-1 italic">
            I know the future of ours is going to be an wholesome and sarcastic by your families and as well as mines also I want to create an family by your wish and definitely your are the one to rule me and our family like the couple in the “padayappa” there is no for an single doubt we built the house with the wholesome and joyful for the rest of our life we can talk do the stuff we want, need... If the wall has an chance to tell about the our life the wall should be speechless because of our life🌚
          </p>
          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/90 text-[10px] md:text-[12px] leading-snug md:leading-relaxed font-medium italic">
            you are the lucky charm to me whatever i done and whatever the big decision i took or to be take i think in our pov you fulfill me and my future hopes and i will fulfill yours aswell like an comrade
          </p>
        </TiltCard>
      </motion.div>
    </div>
  );
};
