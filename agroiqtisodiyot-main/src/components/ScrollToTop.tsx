import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll window to top-left on route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
