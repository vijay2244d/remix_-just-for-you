import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export const KissRain = ({ active }: { active: boolean }) => {
  const [raindrops, setRaindrops] = useState<any[]>([]);

  useEffect(() => {
    if (active && raindrops.length === 0) {
      // Generate drops
      const drops = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // percentage 0-100
        size: Math.random() * 1.5 + 1.0,
        delay: Math.random() * 1.5, // stagger the rain
        duration: Math.random() * 2 + 2, // some fall faster
        emoji: Math.random() > 0.5 ? '💋' : '❤️',
      }));
      setRaindrops(drops);
    }
  }, [active, raindrops.length]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
        >
          {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute top-[-10%] flex items-center justify-center filter drop-shadow-md"
          initial={{ 
            left: `${drop.left}%`,
            y: "-10vh",
            opacity: 0,
            rotate: 0,
            scale: drop.size
          }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: drop.emoji === '❤️' ? [-10, 10, -10] : [-5, 5, -5], 
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        >
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{drop.emoji}</span>
        </motion.div>
      ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
