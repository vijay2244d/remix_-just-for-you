import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen } from "lucide-react";

interface Book3DProps {
  title: string;
  subtitle: string;
  author: string;
  tagline: string;
  coverGradient: string;
  accentColor: string; // tailwind color prefix, e.g. "amber" or "rose"
  icon: React.ReactNode;
  insideHeader: string;
  insideText: string;
  insideSign: string;
  onClick: () => void;
  hoverGlowClass: string;
  isTransitioning?: boolean;
}

export const Book3D = ({
  title,
  subtitle,
  author,
  tagline,
  coverGradient,
  accentColor,
  icon,
  insideHeader,
  insideText,
  insideSign,
  onClick,
  hoverGlowClass,
  isTransitioning = false,
}: Book3DProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Active open state when hovered on desktop or toggled via tap
  const activeOpen = isHovered || isOpen || isTransitioning;

  // CSS transform styles for 3D physics
  const bookContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "200px",
    height: "280px",
    transformStyle: "preserve-3d",
    transform: isTransitioning
      ? "rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(80px)"
      : activeOpen
      ? "rotateY(-24deg) rotateX(10deg) rotateZ(-2deg) translateZ(15px)"
      : "rotateY(-12deg) rotateX(6deg) rotateZ(-1deg) translateZ(0)",
    transition: isTransitioning
      ? "transform 1.0s cubic-bezier(0.2, 0.8, 0.2, 1)"
      : "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  const frontCoverStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transformOrigin: "left center",
    transformStyle: "preserve-3d",
    transform: isTransitioning
      ? "rotateY(-180deg) translateZ(10px)"
      : activeOpen
      ? "rotateY(-135deg) translateZ(10px)"
      : "rotateY(0deg) translateZ(10px)",
    transition: isTransitioning
      ? "transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1)"
      : "transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
    zIndex: 10,
    cursor: "pointer",
  };

  const backCoverStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: "translateZ(-10px)",
    borderRadius: "4px 8px 8px 4px",
    boxShadow: activeOpen
      ? "15px 25px 45px rgba(0, 0, 0, 0.4)"
      : "6px 12px 25px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  // Stacked pages to show pages on the right and top/bottom
  const pageStackStyle: React.CSSProperties = {
    position: "absolute",
    top: "3px",
    bottom: "3px",
    right: "2px",
    width: "193px",
    transform: "translateZ(-3px) scaleY(0.98)",
    backgroundColor: "#fdfbf7",
    borderTop: "1px solid #f3ebd7",
    borderBottom: "1px solid #f3ebd7",
    borderRight: "1px solid #e2d7be",
    borderRadius: "0 4px 4px 0",
    boxShadow: "inset -2px 0 6px rgba(0, 0, 0, 0.05)",
  };

  // Beautiful paper lining lines on the right side
  const pageLinesRightStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "12px",
    background: "repeating-linear-gradient(90deg, #fdfbf7, #fdfbf7 2px, #e7e5e4 2px, #e7e5e4 3px)",
    opacity: 0.85,
  };

  const spineStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "20px",
    transformOrigin: "left center",
    transform: "rotateY(-90deg) translateZ(10px)",
    borderRadius: "3px 0 0 3px",
  };

  const insidePageStyle: React.CSSProperties = {
    position: "absolute",
    top: "3px",
    bottom: "3px",
    left: "3px",
    right: "3px",
    transform: "translateZ(-1px)",
    backgroundColor: "#faf8f2",
    borderRadius: "0 6px 6px 0",
    boxShadow: "inset 3px 0 8px rgba(0, 0, 0, 0.08)",
    borderLeft: "2px solid #e6dec9",
  };

  return (
    <div
      className="flex flex-col items-center select-none relative"
      style={{ perspective: "1500px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsOpen(false);
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Dynamic halo glow behind book */}
      <div
        className={`absolute inset-[-20px] rounded-full blur-[40px] opacity-0 transition-opacity duration-700 pointer-events-none -z-10 ${
          activeOpen ? "opacity-100" : ""
        } ${hoverGlowClass}`}
      />

      {/* Main 3D Book Container */}
      <div style={bookContainerStyle}>
        
        {/* SPINE (Visible from side when tilted) */}
        <div
          style={spineStyle}
          className={`${coverGradient} border-r border-black/20 flex flex-col items-center justify-between py-4 shadow-[inset_-2px_0_4px_rgba(255,255,255,0.1)]`}
        >
          {/* Decorative gold spine ribs */}
          <div className="w-full flex flex-col gap-10 opacity-40">
            <div className="w-full h-[2px] bg-amber-300/40" />
            <div className="w-full h-[2px] bg-amber-300/40" />
            <div className="w-full h-[2px] bg-amber-300/40" />
            <div className="w-full h-[2px] bg-amber-300/40" />
          </div>
        </div>

        {/* BACK COVER */}
        <div style={backCoverStyle} className={coverGradient}>
          {/* Subtle inside shade */}
          <div className="absolute inset-0 bg-black/10 rounded-r-[8px] pointer-events-none" />
        </div>

        {/* LAYERED PAGES (Stack effect) */}
        <div style={pageStackStyle}>
          <div style={pageLinesRightStyle} />
          {/* Diagonal texture to represent bottom pages */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-t from-stone-200/50 to-transparent" />
        </div>

        {/* INSIDE REVEAL PAGE */}
        <div style={insidePageStyle} className="p-4 flex flex-col justify-between overflow-hidden border border-[#eae0ca]">
          {/* Decorative inner gold borders */}
          <div className="absolute inset-1 border border-amber-800/10 pointer-events-none rounded" />
          <div className="absolute inset-[6px] border border-dashed border-amber-800/5 pointer-events-none rounded" />

          {/* Heading */}
          <div className="text-center z-10">
            <h4 className="text-[12px] md:text-[13px] font-bold text-rose-950/90 font-display tracking-widest border-b border-amber-800/10 pb-1">
              {insideHeader}
            </h4>
          </div>

          {/* Message Text */}
          <div className="flex-1 flex items-center justify-center py-2 px-1 z-10">
            <p className="text-[10px] md:text-[11px] text-stone-700 font-serif leading-relaxed italic text-center font-medium">
              "{insideText}"
            </p>
          </div>

          {/* Signature/Sign-off */}
          <div className="text-right z-10 flex flex-col gap-0.5">
            <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-stone-500 font-serif">
              {author}
            </span>
            <span className="text-[9px] md:text-[10px] text-rose-800 font-bold italic font-serif">
              {insideSign}
            </span>
          </div>

          {/* Floral corner svg decoration inside page */}
          <div className="absolute bottom-1 left-1 w-6 h-6 text-amber-800/10 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform scale-x-[-1]">
              <path d="M10,80 C20,70 40,65 50,45 C55,35 50,20 40,15 C30,10 20,20 25,35 C28,45 42,48 50,40 C60,30 55,10 70,5 Z" />
            </svg>
          </div>
        </div>

        {/* FRONT COVER (Swings open on hover) */}
        <div style={frontCoverStyle}>
          
          {/* Front Face (Outer Side) */}
          <div
            className={`absolute inset-0 ${coverGradient} rounded-r-[6px] rounded-l-[2px] border-y border-r border-white/10 p-5 flex flex-col justify-between shadow-[2px_0_5px_rgba(0,0,0,0.15)]`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Gold foil decorative line border */}
            <div className="absolute inset-[6px] border border-amber-200/30 rounded-[3px] pointer-events-none" />
            <div className="absolute inset-[10px] border border-dashed border-amber-200/10 rounded-[2px] pointer-events-none" />

            {/* Corner ornaments (Gold foil) */}
            <div className="absolute top-[8px] left-[8px] w-3 h-3 border-t border-l border-amber-300/40 rounded-tl" />
            <div className="absolute top-[8px] right-[8px] w-3 h-3 border-t border-r border-amber-300/40 rounded-tr" />
            <div className="absolute bottom-[8px] left-[8px] w-3 h-3 border-b border-l border-amber-300/40 rounded-bl" />
            <div className="absolute bottom-[8px] right-[8px] w-3 h-3 border-b border-r border-amber-300/40 rounded-br" />

            {/* Book Spine Edge Shadow Overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

            {/* Top Text / Category */}
            <div className="text-center z-10">
              <span className="text-[8px] font-bold text-amber-200/75 uppercase tracking-[0.2em]">
                {tagline}
              </span>
            </div>

            {/* Book Emblem/Symbol */}
            <div className="my-auto flex flex-col items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner relative group-hover:scale-105 transition-transform duration-500">
                {/* Circular gold pattern */}
                <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/20" />
                {icon}
              </div>
              <div className="space-y-1.5 text-center">
                <h2 className="text-lg md:text-xl font-bold font-serif text-amber-50 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {title}
                </h2>
                <div className="w-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent mx-auto" />
                <p className="text-[10px] text-amber-200/70 tracking-wider font-serif italic">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Author / Footer */}
            <div className="text-center z-10">
              <span className="text-[8px] uppercase tracking-widest text-amber-100/60 font-serif">
                {author}
              </span>
            </div>
          </div>

          {/* Back Face (Inside Cover paper - visible when open) */}
          <div
            className="absolute inset-0 bg-[#e6dec9] rounded-l-[6px] rounded-r-[2px] border-l border-y border-[#c5ba9d] p-5 flex flex-col justify-between"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Vintage style wallpaper corner prints */}
            <div className="absolute inset-2 border border-amber-900/10 rounded" />
            <div className="m-auto opacity-10 text-amber-900">
              <BookOpen className="w-16 h-16" />
            </div>
            <div className="text-center z-10">
              <span className="text-[8px] text-amber-900/40 uppercase tracking-widest">
                உள் அட்டை
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Action Button below shelf - reveals on hover/open */}
      <div className="mt-8 h-10 flex items-center justify-center">
        <AnimatePresence>
          {activeOpen && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation(); // Avoid toggling book again
                onClick();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-[10px] md:text-xs uppercase tracking-wider shadow-lg cursor-pointer bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 border border-white/20 transition-all z-20`}
            >
              <span>Read Book 📖</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
