import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useCallback, useRef } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Create iOS-style water droplet ripple overlay
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Calculate the max radius needed to cover the full screen
      const maxRadius = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(window.innerWidth - cx, cy),
        Math.hypot(cx, window.innerHeight - cy),
        Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
      );

      // Create the ripple overlay
      const overlay = document.createElement('div');
      overlay.className = 'theme-ripple-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        pointer-events: none;
        overflow: hidden;
      `;

      const circle = document.createElement('div');
      circle.className = 'theme-ripple-circle';
      const bgColor = nextTheme === 'dark'
        ? 'hsl(165, 35%, 3.5%)'
        : 'hsl(45, 15%, 99%)';

      circle.style.cssText = `
        position: absolute;
        left: ${cx}px;
        top: ${cy}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: ${bgColor};
        transform: translate(-50%, -50%);
        transition: width 0.65s cubic-bezier(0.4, 0, 0.2, 1), height 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        opacity: 1;
      `;

      overlay.appendChild(circle);
      document.body.appendChild(overlay);

      // Force reflow then expand
      circle.getBoundingClientRect();
      const diameter = maxRadius * 2;
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;

      // Apply theme change after the circle has started expanding
      setTimeout(() => {
        setTheme(nextTheme);
      }, 250);

      // Fade out and remove the overlay after the animation completes
      setTimeout(() => {
        circle.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
        }, 300);
      }, 650);
    } else {
      setTheme(nextTheme);
    }
  }, [theme, setTheme]);

  return (
    <Button
      ref={btnRef}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="theme-toggle-btn rounded-xl w-8 h-8 relative overflow-hidden"
      aria-label="Mavzuni o'zgartirish"
    >
      <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
