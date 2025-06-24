import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-secondary/30">
      <div className="text-center space-y-4 max-w-md px-6">
        <div className="mb-6">
          <img 
            src="https://i.ibb.co/QvHLCCn6/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
            alt="LinkePuc Logo" 
            className="h-24 mx-auto"
          />
        </div>
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/login">
              <GraduationCap className="w-4 h-4" />
              Ir para login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
