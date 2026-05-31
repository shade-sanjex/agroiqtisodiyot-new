import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect, useState } from "react";
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
import { LoadingScreen } from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";

// Background assets for preloading
import heroAgriculture from '@/assets/hero-agriculture.webp';
import editorialHero from '@/assets/editorial-hero.webp';
import journalsHero from '@/assets/journals-hero.webp';
import requirementsHero from '@/assets/requirements-hero.webp';
import checkerHero from '@/assets/checker-hero.webp';
import contactHero from '@/assets/contact-hero.webp';

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Tizim ishga tushirilmoqda...");

  useEffect(() => {
    // Check session storage to avoid showing it multiple times
    const hasLoadedThisSession = sessionStorage.getItem("iscad_loaded");
    if (hasLoadedThisSession) {
      setIsLoading(false);
      return;
    }

    const staticImages = [
      heroAgriculture,
      editorialHero,
      journalsHero,
      requirementsHero,
      checkerHero,
      contactHero
    ];

    let active = true;

    const startPreloading = async () => {
      try {
        setStatusText("Tizim resurslari yuklanmoqda...");
        setProgress(10);

        // 1. Fetch journal covers from Supabase
        let coverUrls: string[] = [];
        try {
          const { data, error } = await supabase
            .from("journals")
            .select("cover_image_url")
            .order("created_at", { ascending: false })
            .limit(20); // Preload top 20 covers (the first page)

          if (!error && data) {
            coverUrls = data
              .map((j) => j.cover_image_url)
              .filter((url): url is string => !!url);
          }
        } catch (dbErr) {
          console.error("Error fetching journal covers for preloading:", dbErr);
        }

        // Add fallback/mock cover image if no real covers exist
        if (coverUrls.length === 0) {
          coverUrls.push("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400");
        }

        const totalItems = staticImages.length + coverUrls.length;
        let loadedCount = 0;

        const updateProgress = () => {
          if (!active) return;
          loadedCount++;
          // Scale progress from 10% to 90% during loading
          const currentProgress = Math.min(90, 10 + Math.round((loadedCount / totalItems) * 80));
          setProgress(currentProgress);
        };

        // Helper to preload an image
        const preloadImage = (src: string): Promise<void> => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              updateProgress();
              resolve(); // resolve anyway to not block
            };
          });
        };

        // 2. Load static images in parallel (essential for initial page appearance)
        await Promise.all(staticImages.map((src) => preloadImage(src)));

        if (!active) return;
        setStatusText("Nashrlar muqovalari yuklanmoqda...");

        // 3. Load journal covers sequentially (as requested by user)
        for (let i = 0; i < coverUrls.length; i++) {
          if (!active) return;
          setStatusText(`Muqova #${i + 1} yuklanmoqda...`);
          await preloadImage(coverUrls[i]);
        }

        // Force a brief delay so the visual loading completes smoothly
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!active) return;
        setProgress(100);
        setStatusText("Tayyor!");

        setTimeout(() => {
          if (active) {
            setIsLoading(false);
            sessionStorage.setItem("iscad_loaded", "true");
          }
        }, 600);

      } catch (err) {
        console.error("Preloading failed:", err);
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Safety timeout to prevent getting stuck
    const safetyTimeout = setTimeout(() => {
      if (active && isLoading) {
        console.warn("Preloading safety timeout reached. Dismissing loader.");
        setIsLoading(false);
        sessionStorage.setItem("iscad_loaded", "true");
      }
    }, 8000);

    startPreloading();

    return () => {
      active = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LoadingScreen isLoading={isLoading} progress={progress} statusText={statusText} />
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

