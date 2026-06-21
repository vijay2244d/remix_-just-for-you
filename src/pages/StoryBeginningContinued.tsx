import { motion } from "motion/react";
import { TiltCard } from "../components/TiltCard";

export const StoryBeginningContinued = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6 p-4 md:p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col w-full max-w-sm mx-auto perspective-1000 shrink-0"
      >
        <TiltCard className="flex flex-col items-center text-center gap-3 bg-white/80 p-5 md:p-6 shadow-sm border border-rose-50">
          <p style={{ transform: "translateZ(10px)" }} className="text-rose-800/90 text-[10px] md:text-[13px] leading-snug md:leading-relaxed italic">
            "When my friend says 'hey, see there', I turned my head and looked forward. Ahh… one woman... ahh she had worn a white dress with red dots, coming on a cycle. Still, that moment craved my heart, and my heartbeat said 'your destiny comes on the cycle and takes your soul and your heart and runs away'. And that's the day the spark evolved to its full potential and took away my sleep… on 4-feb-22 that day when i see and the spark gets to the fullly evolved stage and on 14-3-22 that day i proposed to you inbetween those 40 days i think and gone through so much of situation which are to be arise or not in each of those thoughts i hardly stands on whatever the situation may arise or not she's the one those days acknowledged that without you nothing make sense "
          </p>
        </TiltCard>
      </motion.div>
    </div>
  );
};
