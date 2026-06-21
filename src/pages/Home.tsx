import { motion } from "motion/react";
import { FloatingElement } from "../components/FloatingElement";
import { Heart, BookHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center gap-6 md:gap-10 p-4 md:p-8">
      <div className="w-full max-w-[200px] md:max-w-xs aspect-square relative z-10 perspective-1000 mx-auto">
        <FloatingElement delay={0}>
          <div
            className="w-full aspect-square rounded-full bg-gradient-to-br from-pink-200 to-rose-300 text-white flex flex-col items-center justify-center shadow-inner relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]" />
            
            <motion.div className="text-center space-y-6 z-10">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 md:w-28 md:h-28 mx-auto bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border border-white/40"
              >
                <Heart className="w-10 h-10 md:w-14 md:h-14 fill-rose-500 text-rose-500" />
              </motion.div>
            </motion.div>
          </div>
        </FloatingElement>

        {/* Decorative floating blurred spots */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-16 h-16 md:w-24 md:h-24 bg-fuchsia-300/40 rounded-full blur-xl -z-10"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-4 -left-4 w-20 h-20 md:w-32 md:h-32 bg-pink-300/40 rounded-full blur-xl -z-10"
        />
      </div>

      <div className="space-y-4 md:space-y-6 max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/60 border border-pink-200 text-rose-600 font-medium text-[10px] md:text-xs uppercase tracking-widest shadow-sm mx-auto"
        >
          <span>A Little Digital Space</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[20px] font-['Times_New_Roman'] font-bold text-rose-900 pb-1 leading-tight"
        >
          Happy LIfe Because of you and with You
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs md:text-sm text-rose-800/80 leading-relaxed italic"
        >
          I wanted to build something special to show you how much you mean to me. Turn the page to see our story.
        </motion.p>

        {/* Back to library button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white font-medium text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
        >
          <BookHeart className="w-3.5 h-3.5" />
          <span>Back to Library 📚</span>
        </motion.button>
      </div>
    </div>
  );
};

