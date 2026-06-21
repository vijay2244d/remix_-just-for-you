import { motion } from "motion/react";
import { TiltCard } from "../components/TiltCard";

export const StoryMemoriesContinued = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col w-full max-w-sm mx-auto perspective-1000 shrink-0"
      >
        <TiltCard className="flex flex-col items-center text-center gap-3 bg-white/80 p-5 md:p-6 shadow-sm border border-fuchsia-50">
          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/90 text-[10px] md:text-[13px] leading-snug md:leading-relaxed italic">
            "The image in the left side contains many memories which is very wholesome and I always see the picture you are my healing thing. I love the way you light up a room with your smile, and the sound of your laughter is music to my ears. I'm so lucky to have you in my life, and I can't wait to see what the future holds for us. You are my rock, my lucky charm, my confidant, you are my cutie pie your voice is the concert which my melt my heart and visit every time and enjoy and the reason for my simile. I'm so glad we found each other, and I know that our love will continue to grow and flourish for years to come."
          </p>
        </TiltCard>
      </motion.div>
    </div>
  );
};
