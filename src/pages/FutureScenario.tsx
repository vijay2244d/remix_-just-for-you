import { motion } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import { TiltCard } from "../components/TiltCard";

export const FutureScenario = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      <div className="text-center shrink-0">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-rose-900 font-display"
        >
          Future Scenarios
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
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-pink-100 to-rose-100 p-2 md:p-3 rounded-full text-rose-500 border border-pink-200 z-10 shadow-md"
            >
              <Heart className="w-5 h-5 md:w-7 md:h-7 fill-rose-500 text-rose-500" />
            </motion.div>
          </div>

          <div style={{ transform: "translateZ(10px)" }} className="text-left w-full space-y-3 mt-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
            <div className="p-3 bg-rose-50/55 rounded-xl border border-rose-100/50">
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Cozy Movie Nights
              </h3>
              <p className="text-[10px] md:text-[11px] text-rose-800/80 leading-relaxed italic mt-1">
                Snugged together on the couch, sharing a blanket, watching a movie (or probably arguing over what to watch!) and enjoying the perfect quiet company.
              </p>
            </div>

            <div className="p-3 bg-rose-50/55 rounded-xl border border-rose-100/50">
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Gentle Pampering & Care
              </h3>
              <p className="text-[10px] md:text-[11px] text-rose-800/80 leading-relaxed italic mt-1">
                Those long, tiring days where we take care of each other—whether it's giving a relaxing foot massage, brushing hair, or just listening to the day's drama.
              </p>
            </div>

            <div className="p-3 bg-rose-50/55 rounded-xl border border-rose-100/50">
              <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Kitchen Playfulness
              </h3>
              <p className="text-[10px] md:text-[11px] text-rose-800/80 leading-relaxed italic mt-1">
                Where cooking meals and washing dishes aren't chores anymore. One washing, one sitting on the counter, talking, laughing, and making the kitchen a happy playground.
              </p>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
};
