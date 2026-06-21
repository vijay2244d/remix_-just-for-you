import { motion } from "motion/react";
import { useState } from "react";
import { useAppStore } from "../store";

export const Envelope = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setGlobalEnvelopeOpen = useAppStore((state) => state.setEnvelopeOpen);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // After animation finishes, trigger the camera on the left side
    setTimeout(() => {
      setGlobalEnvelopeOpen(true);
    }, 1500); // Wait for flap and slide animation
  };

  return (
    <div className="relative w-64 h-48 cursor-pointer group perspective-1000" onClick={handleOpen}>
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{ scale: isOpen ? 1.05 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back of envelope */}
        <div className="absolute inset-0 bg-red-200 shadow-md border border-red-300 rounded-md" />
        
        {/* Letter inside */}
        <motion.div 
          className="absolute inset-1 bg-white shadow-sm flex items-center justify-center p-4 border border-rose-100 rounded-sm"
          initial={{ y: 0 }}
          animate={{ y: isOpen ? -60 : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
          style={{ zIndex: 10 }}
        >
          <div className="text-center font-display text-rose-800 text-sm">
            <h3 className="font-bold mb-1">To My Love</h3>
            <p>Look to the left side...</p>
          </div>
        </motion.div>

        {/* Bottom flap */}
        <div 
          className="absolute bottom-0 w-full h-3/4 bg-red-300 drop-shadow-sm pointer-events-none"
          style={{ 
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 30%, 0 0)',
            zIndex: 20
          }} 
        />

        {/* Top flap */}
        <motion.div 
          className="absolute top-0 w-full h-2/3 bg-red-400 drop-shadow-md origin-top"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            zIndex: isOpen ? 5 : 30,
            backfaceVisibility: 'hidden'
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Inside of top flap (visible when open) */}
        <motion.div 
          className="absolute top-0 w-full h-2/3 bg-red-200 drop-shadow-sm origin-top"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            zIndex: isOpen ? 4 : 1,
            backfaceVisibility: 'hidden'
          }}
          initial={{ rotateX: 180 }}
          animate={{ rotateX: isOpen ? 360 : 180 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </motion.div>
      
      {!isOpen && (
        <div className="absolute inset-x-0 -bottom-8 text-center text-sm text-rose-500 font-medium animate-pulse opacity-70 group-hover:opacity-100 transition-opacity">
          Click to open completely
        </div>
      )}
    </div>
  );
};
