import { useEffect, useState } from "react";
import iscadLogo from "@/assets/iscad-logo.png";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
    } else {
      // Keep rendering during fade-out, then unmount
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        gradient-hero
        transition-opacity duration-500 ease-out
        ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Logo with pulse */}
      <img
        src={iscadLogo}
        alt="ISCAD"
        className="h-24 w-auto mb-8 animate-pulse drop-shadow-lg"
      />

      {/* Animated dots loader */}
      <div className="flex items-center gap-2">
        <span
          className="block h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="block h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="block h-2.5 w-2.5 rounded-full bg-white/80 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
