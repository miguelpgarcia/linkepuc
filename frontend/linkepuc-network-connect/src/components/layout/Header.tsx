import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Briefcase,
  LogOut,
  Menu,
  MessageSquare,
  X,
  GraduationCap
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/AuthContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

interface UserProfile {
  id: number;
  usuario: string;
  avatar: string | null;
}

export function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch current user's profile data for avatar
  const { data: profileData } = useQuery<UserProfile>({
    queryKey: ['user-profile', user?.id], // Unified key for user profile
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(API_ENDPOINTS.USERS.BY_ID(user.id));
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes - user data doesn't change frequently
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for fallback
  const getUserInitials = () => {
    if (!profileData?.usuario) return "U";
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
      <div className="container flex h-16 items-center">
        {/* Left section - hidden on mobile unless menu is open */}
        <div className="flex items-center space-x-8 flex-1">
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
          {!isMobile && (
            <>
              <Link to="/opportunities" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                <Briefcase size={22} />
                <span className="text-xs">Oportunidades</span>
              </Link>
              <Link to="/import-curriculum" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                <GraduationCap size={22} />
                <span className="text-xs">Histórico</span>
              </Link>
            </>
          )}
        </div>

        {/* Center section - Logo always visible and centered */}
        <div className="flex items-center justify-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <img 
                src={`${import.meta.env.BASE_URL}lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png`} 
                alt="LinkePuc" 
                className="h-8"
              />
            </div>
            <div className="font-bold text-xl text-primary">LinkePuc</div>
          </Link>
        </div>

        {/* Right section - conditionally show based on screen size */}
        <div className="flex items-center space-x-8 flex-1 justify-end">
          {!isMobile && (
            <>
              <Link to="/messages" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                <MessageSquare size={22} />
                <span className="text-xs">Mensagens</span>
              </Link>
              <div className="border-l h-8" />
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src={profileData?.avatar || undefined} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
          {isMobile && !mobileMenuOpen && (
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.avatar || undefined} />
                <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>

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
              to="/import-curriculum" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <GraduationCap size={24} />
              <span>Histórico Acadêmico</span>
            </Link>
            <Link 
              to="/messages" 
              className="flex items-center gap-3 text-lg" 
              onClick={toggleMobileMenu}
            >
              <MessageSquare size={24} />
              <span>Mensagens</span>
            </Link>
            <div className="border-t my-2" />
            <Link 
              to="/profile" 
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
