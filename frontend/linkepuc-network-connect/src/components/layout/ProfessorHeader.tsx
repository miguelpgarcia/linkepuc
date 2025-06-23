import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Briefcase,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/AuthContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";

interface UserProfile {
  id: number;
  usuario: string;
  avatar: string | null;
}

export function ProfessorHeader() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Fetch current user's profile data for avatar
  const { data: profileData } = useQuery<UserProfile>({
    queryKey: ['header-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(`http://localhost:8000/users/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/professor/login";
  };

  // Get user initials for fallback
  const getUserInitials = () => {
    if (!profileData?.usuario) return "P";
    const names = profileData.usuario.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return profileData.usuario.charAt(0).toUpperCase();
  };

  // Don't render header if user is not logged in
  if (!user) {
    return null;
  }

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
          <Link to="/professor" className="flex items-center gap-2">
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
            <Link to="/professor/messages" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
              <MessageSquare size={22} />
              <span className="text-xs">Mensagens</span>
            </Link>
            <div className="border-l h-8" />
            <Link to="/professor/profile">
              <Avatar>
                <AvatarImage src={profileData?.avatar || undefined} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
        {isMobile && !mobileMenuOpen && (
          <div className="flex items-center">
            <Link to="/professor/profile" className="mr-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.avatar || undefined} />
                <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
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
            <div className="border-t my-2" />
            <Link 
              to="/professor/profile" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <Avatar>
                <AvatarImage src={profileData?.avatar || undefined} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span>Perfil</span>
            </Link>
            <Button 
              variant="ghost"
              className="flex items-center gap-3 text-lg text-destructive justify-start p-0 h-auto" 
              onClick={() => {
                toggleMobileMenu();
                handleLogout();
              }}
            >
              <LogOut size={24} />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
