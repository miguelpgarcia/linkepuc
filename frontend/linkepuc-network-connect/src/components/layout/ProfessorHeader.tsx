
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
import { useState } from "react";

export function ProfessorHeader() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
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
            <Link to="/professor/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <User size={22} />
              <span className="text-xs">Dashboard</span>
            </Link>
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
        <div className={`flex items-center justify-center gap-2 ${isMobile ? "ml-4" : ""}`}>
          <Link to="/professor/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img 
                src="/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
                alt="LinkePuc" 
                className="h-8"
              />
            </div>
            <div className="font-bold text-xl text-primary">
              LinkePuc <span className="text-sm font-normal text-muted-foreground">Professor</span>
            </div>
          </Link>
        </div>

        {/* Right section - conditionally show based on screen size */}
        {!isMobile && (
          <div className="flex items-center space-x-8">
            <Link to="/professor/messages" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <MessageSquare size={22} />
              <span className="text-xs">Mensagens</span>
            </Link>
            <Link to="/professor/notifications" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <Bell size={22} />
              <span className="text-xs">Notificações</span>
            </Link>
            <div className="border-l h-8" />
            <Link to="/professor">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
              <Link to="/professor/login">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center">
            <Link to="/professor" className="mr-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>PR</AvatarFallback>
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
              to="/professor/dashboard" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <User size={24} />
              <span>Dashboard</span>
            </Link>
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
            <div className="border-t my-2" />
            <Link 
              to="/professor" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <span>Perfil</span>
            </Link>
            <Link 
              to="/professor/login" 
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
