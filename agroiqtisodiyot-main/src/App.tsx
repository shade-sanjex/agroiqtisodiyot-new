import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import EditorialBoard from "./pages/EditorialBoard";
import Journals from "./pages/Journals";
import Requirements from "./pages/Requirements";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ArticleChecker from "./pages/ArticleChecker";
import TelegramApp from "./pages/TelegramApp";
import NotFound from "./pages/NotFound";

// Background assets for preloading
import heroAgriculture from '@/assets/hero-agriculture.jpg';
import editorialHero from '@/assets/editorial-hero.png';
import journalsHero from '@/assets/journals-hero.png';
import requirementsHero from '@/assets/requirements-hero.png';
import checkerHero from '@/assets/checker-hero.png';
import contactHero from '@/assets/contact-hero.png';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Preload background images during idle time to improve navigation performance
    const imagesToPreload = [
      heroAgriculture,
      editorialHero,
      journalsHero,
      requirementsHero,
      checkerHero,
      contactHero
    ];
    
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/editorial-board" element={<EditorialBoard />} />
                <Route path="/journals" element={<Journals />} />
                <Route path="/requirements" element={<Requirements />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/article-checker" element={<ArticleChecker />} />
                <Route path="/tg-app" element={<TelegramApp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
