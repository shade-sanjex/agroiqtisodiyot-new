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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-8xl font-serif font-bold gradient-text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Sahifa topilmadi</p>
        <Link to="/">
          <Button className="rounded-full px-8">
            <Home className="h-4 w-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
