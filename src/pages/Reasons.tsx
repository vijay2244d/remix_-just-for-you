import { motion } from "motion/react";
import { Envelope } from "../components/Envelope";

export const Reasons = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 md:space-y-8 p-4 md:p-8 max-w-sm mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-rose-900 font-display mb-12"
        >
          Why I Love You
        </motion.h1>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full relative z-10">
        <Envelope />
      </div>
    </div>
  );
};

