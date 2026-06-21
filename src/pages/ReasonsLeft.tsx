import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../store";

export const ReasonsLeft = () => {
  const isEnvelopeOpen = useAppStore((state) => state.isEnvelopeOpen);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEnvelopeOpen) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
        } catch (err) {
          console.error("Camera access denied or failed", err);
          setError("Please allow camera access to see the most beautiful person.");
        }
      };

      startCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [isEnvelopeOpen]);

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center relative overflow-hidden bg-rose-50/50">
      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full rounded-md object-cover flex items-center justify-center border-4 border-white shadow-xl bg-[url('https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center brightness-75"
          />
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-full relative"
          >
            <div className="w-full h-full rounded-md overflow-hidden border-8 border-white shadow-xl relative bg-black/10">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover -scale-x-100" 
                autoPlay 
                playsInline 
                muted
              />
              {error && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-white/80">
                  <p className="text-xl font-display text-rose-800">{error}</p>
                </div>
              )}
            </div>
            
            {hasPermission && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-0 right-0 text-center z-10 drop-shadow-md"
              >
                <div className="mx-auto w-fit px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-800 font-display font-medium text-sm border border-rose-100 shadow-sm">
                  You are the reason. Absolutely beautiful.
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
