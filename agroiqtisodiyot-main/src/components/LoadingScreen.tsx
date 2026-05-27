import { useEffect, useState } from "react";
import iscadLogo from "@/assets/iscad-logo.png";

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
  statusText: string;
}

export function LoadingScreen({ isLoading, progress, statusText }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    } else {
      // Keep rendering during fade-out, then unmount
      const timer = setTimeout(() => setShouldRender(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-slate-950 text-slate-100 overflow-hidden
        transition-all duration-700 ease-in-out
        ${isLoading ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}
      `}
    >
      {/* Decorative premium glows in background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-[-300px] left-[-300px] w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-300px] right-[-300px] w-[700px] h-[700px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Main loading container */}
      <div className="relative flex flex-col items-center z-10 px-6 text-center max-w-sm">
        
        {/* Animated 3D/Circular SVG Ring + Logo */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* Rotating outer ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="url(#loadingGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="200 100"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing glow under logo */}
          <div className="absolute inset-4 rounded-full bg-primary/5 blur-md animate-pulse" />

          {/* Logo */}
          <img
            src={iscadLogo}
            alt="ISCAD"
            className="absolute h-16 w-auto object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
          />

          {/* Micro progress indicator badge */}
          <div className="absolute -bottom-1 bg-slate-900 border border-border/40 text-accent font-sans font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full shadow-glow-gold">
            {progress}%
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif font-black text-2xl tracking-wide mb-1 text-white">
          AGROIQTISODIYOT
        </h2>
        <p className="text-[9px] text-muted-foreground tracking-[0.25em] uppercase font-bold mb-8">
          Ilmiy-amaliy nashr portal
        </p>

        {/* Progress Bar */}
        <div className="w-56 h-[3px] bg-white/5 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status message */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            {statusText}
          </p>
        </div>

      </div>
    </div>
  );
}

