import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const NOTE_SYMBOLS = ["♩", "♪", "♫", "♬", "♭", "♯", "𝄞", "𝄢", "𝄽"];

export const MusicNoteRain = ({ active = true }: { active?: boolean }) => {
  const [raindrops, setRaindrops] = useState<any[]>([]);

  useEffect(() => {
    if (active && raindrops.length === 0) {
      // Generate raindrops
      const drops = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // percentage 0-100
        size: Math.random() * 1.2 + 0.8,
        delay: Math.random() * 1.5, // stagger the rain
        duration: Math.random() * 2 + 2.5, // some fall faster
        symbol: NOTE_SYMBOLS[i % NOTE_SYMBOLS.length],
        rotation: Math.random() * 360,
      }));
      setRaindrops(drops);
    } else if (!active) {
      setRaindrops([]);
    }
  }, [active, raindrops.length]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
        >
          {raindrops.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute text-purple-900/60 top-[-10%] select-none font-serif font-bold pointer-events-none drop-shadow-md"
              initial={{ 
                left: `${drop.left}%`,
                y: "-10vh",
                opacity: 0,
                rotate: drop.rotation,
                scale: drop.size
              }}
              animate={{
                y: "110vh",
                opacity: [0, 0.9, 0.9, 0],
                rotate: drop.rotation + 360,
              }}
              transition={{
                duration: drop.duration,
                repeat: Infinity,
                delay: drop.delay,
                ease: "linear"
              }}
              style={{ fontSize: "28px" }}
            >
              {drop.symbol}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
