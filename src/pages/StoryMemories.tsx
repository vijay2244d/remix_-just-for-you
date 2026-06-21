import { motion } from "motion/react";
import { TiltCard } from "../components/TiltCard";
import { Camera } from "lucide-react";

export const StoryMemories = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col w-full max-w-sm mx-auto perspective-1000 shrink-0"
      >
        <TiltCard className="flex flex-col items-center text-center gap-3 bg-white/80 p-5 md:p-8 shadow-sm border border-fuchsia-50">
          <div style={{ transform: "translateZ(30px)" }} className="bg-fuchsia-100 p-3 md:p-4 mx-auto rounded-full text-fuchsia-500 border border-fuchsia-200">
            <Camera className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 style={{ transform: "translateZ(20px)" }} className="text-xl md:text-2xl font-bold text-rose-900 font-display mt-1 md:mt-2">The Memories</h3>
          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/80 text-[10px] md:text-[13px] leading-snug md:leading-relaxed italic">
            "Our time together is a beautiful melody that fills my heart with joy. I cherish every moment we share, and I'm so grateful for the love we have. Thinking back to our adventures, my heart fills with a warmth that only you can provide. From the simple pleasures exploring new places, every memory is a treasure I will always hold dear….."
          </p>
        </TiltCard>
      </motion.div>
    </div>
  );
};
