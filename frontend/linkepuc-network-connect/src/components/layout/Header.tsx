import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Briefcase,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  User,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/AuthContext";
import { useState } from "react";

export function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}

        {/* Left section - hidden on mobile unless menu is open */}
        {!isMobile && (
          <div className="flex items-center space-x-8">
            <Link to="/opportunities" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Briefcase size={22} />
              <span className="text-xs">Oportunidades</span>
            </Link>
            <Link to="/publicacoes" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <FileText size={22} />
              <span className="text-xs">Publicações</span>
            </Link>
            <Link to="/network" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <User size={22} />
              <span className="text-xs">Rede</span>
            </Link>
          </div>
        )}

        {/* Center section - Logo always visible */}
        <div className={`flex items-center justify-center gap-2 ${isMobile ? "ml-4" : ""}`}>
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img 
                src="/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
                alt="LinkePuc" 
                className="h-8"
              />
            </div>
            <div className="font-bold text-xl text-primary">LinkePuc</div>
          </Link>
        </div>

        {/* Right section - conditionally show based on screen size */}
        {!isMobile && (
          <div className="flex items-center space-x-8">
            <Link to="/messages" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <MessageSquare size={22} />
              <span className="text-xs">Mensagens</span>
            </Link>
            <Link to="/notifications" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Bell size={22} />
              <span className="text-xs">Notificações</span>
            </Link>
            <div className="border-l h-8" />
            <Link to="/profile">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
              <Link to="/login">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center">
            <Link to="/profile" className="mr-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-40 p-4 shadow-md">
          <div className="flex flex-col space-y-6 p-4">
            <Link 
              to="/opportunities" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Briefcase size={24} />
              <span>Oportunidades</span>
            </Link>
            <Link 
              to="/publicacoes" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <FileText size={24} />
              <span>Publicações</span>
            </Link>
            <Link 
              to="/network" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <User size={24} />
              <span>Rede</span>
            </Link>
            <Link 
              to="/messages" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <MessageSquare size={24} />
              <span>Mensagens</span>
            </Link>
            <Link 
              to="/notifications" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Bell size={24} />
              <span>Notificações</span>
            </Link>
            <div className="border-t my-2" />
            <Link 
              to="/profile" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <span>Perfil</span>
            </Link>
            <Link 
              to="/login" 
              className="flex items-center gap-3 text-lg text-destructive" 
              onClick={toggleMobileMenu}
            >
              <LogOut size={24} />
              <span>Sair</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
