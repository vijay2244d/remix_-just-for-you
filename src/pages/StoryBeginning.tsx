import { motion } from "motion/react";
import { TiltCard } from "../components/TiltCard";
import { Heart } from "lucide-react";

export const StoryBeginning = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      <div className="text-center shrink-0">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-rose-900 font-display"
        >
          Our Little Story
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col w-full max-w-sm mx-auto perspective-1000 shrink-0"
      >
        <TiltCard className="flex flex-col items-center text-center gap-3 bg-white/80 p-5 md:p-8 shadow-sm border border-rose-50">
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <motion.div
              animate={{ scale: [1, 1, 1.15, 1] }}
              transition={{ duration: 3, times: [0, 0.45, 0.5, 1], repeat: Infinity }}
              className="bg-gradient-to-br from-pink-100 to-rose-100 p-2 md:p-3 rounded-full text-rose-500 border border-pink-200 z-10 shadow-md"
            >
              <Heart className="w-6 h-6 md:w-8 md:h-8 fill-rose-500" />
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

          <h3 style={{ transform: "translateZ(20px)" }} className="text-lg md:text-xl font-bold text-rose-900 font-display mt-0">The Beginning</h3>
          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/90 text-[10px] md:text-[13px] leading-snug md:leading-relaxed italic">
            "I believe our story started from the school days. I don't know why I didn't make any single talks in the school time. Anyways, one fine day-Feb 4, 2022-standing near the railway track and waiting for my friend."
          </p>
        </TiltCard>
      </motion.div>
    </div>
  );
};
