import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export const HeartRain = ({ active = true }: { active?: boolean }) => {
  const [raindrops, setRaindrops] = useState<any[]>([]);

  useEffect(() => {
    if (active && raindrops.length === 0) {
      // Generate raindrops
      const drops = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // percentage 0-100
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 2, // stagger the rain
        duration: Math.random() * 2 + 3, // some fall faster
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
          className="absolute text-rose-500 top-[-10%]"
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
            rotate: 360,
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        >
          <Heart className="fill-rose-400 drop-shadow-md" style={{ width: '20px', height: '20px' }} />
        </motion.div>
      ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
