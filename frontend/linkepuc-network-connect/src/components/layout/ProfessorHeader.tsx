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
import { useState, useEffect } from "react";

export function ProfessorHeader() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isStudent");
    window.location.href = "/professor/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between bg-secondary/10">
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
            <Link to="/professor/opportunities" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Briefcase size={22} />
              <span className="text-xs">Minhas Oportunidades</span>
            </Link>
            <Link to="/professor/opportunities/new" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <FileText size={22} />
              <span className="text-xs">Nova Oportunidade</span>
            </Link>
          </div>
        )}

        {/* Center section - Logo always visible */}
        <div className="flex-1 flex justify-center">
          <Link to="/professor" className="flex items-center">
              <img 
                src="/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
              alt="LinkePuc Logo" 
                className="h-8"
              />
          </Link>
        </div>

        {/* Right section - hidden on mobile unless menu is open */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/professor/messages">
              <MessageSquare size={22} />
            </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/professor/notifications">
              <Bell size={22} />
              </Link>
            </Button>
            <Link to="/professor">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-40 p-4 shadow-md">
          <div className="flex flex-col space-y-6 p-4">
            <Link 
              to="/professor/opportunities" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Briefcase size={24} />
              <span>Minhas Oportunidades</span>
            </Link>
            <Link 
              to="/professor/opportunities/new" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <FileText size={24} />
              <span>Nova Oportunidade</span>
            </Link>
            <Link 
              to="/professor/messages" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <MessageSquare size={24} />
              <span>Mensagens</span>
            </Link>
            <Link 
              to="/professor/notifications" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Bell size={24} />
              <span>Notificações</span>
            </Link>
            </div>
          </div>
        )}
        </div>
    </header>
  );
}
