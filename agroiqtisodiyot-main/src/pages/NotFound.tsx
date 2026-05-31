import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Dekorativ fon — grid + glow; reduced-motion'da glow animatsiyasi o'chadi (index.css) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="mesh-gradient-glow" />
      </div>
      <div aria-hidden className="glow-blob left-1/4 top-1/3 h-64 w-64 bg-primary" />
      <div aria-hidden className="glow-blob bottom-1/4 right-1/4 h-64 w-64 bg-accent" />

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* Editorial display "404" */}
        <h1 className="gradient-text-primary font-serif text-[6.5rem] font-bold leading-none tracking-tight sm:text-[9rem]">
          404
        </h1>

        {/* Nafis oltin ajratgich */}
        <div className="mx-auto mb-6 mt-2 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <p className="mb-3 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Sahifa topilmadi
        </p>
        <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
          Siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan bo'lishi mumkin.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg" className="rounded-full px-8 text-xs">
            <Home className="mr-2 h-4 w-4" />
            Bosh sahifaga qaytish
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
