
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, MessageSquare, MoreHorizontal, UserPlus, UserCheck } from "lucide-react";

interface ProfileProps {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  backgroundImage?: string;
  bio: string;
  interests: string[];
  isOwnProfile?: boolean;
  isConnected?: boolean;
}

export function ProfileHeader({
  id,
  name,
  role,
  department,
  avatar,
  backgroundImage,
  bio,
  interests,
  isOwnProfile = false,
  isConnected = false,
}: ProfileProps) {
  const [connected, setConnected] = useState(isConnected);
  
  const handleConnect = () => {
    setConnected(!connected);
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div 
        className="h-40 bg-gradient-to-r from-primary/10 to-primary/20 relative" 
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {isOwnProfile && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 bg-background/40 backdrop-blur-sm hover:bg-background/60"
          >
            <Edit size={16} />
          </Button>
        )}
      </div>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row justify-between -mt-16 mb-4 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-4xl">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 sm:mt-0 mb-2">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-muted-foreground">{role} - {department}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            {isOwnProfile ? (
              <Button variant="outline">
                <Edit size={16} className="mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button 
                  variant={connected ? "outline" : "default"}
                  onClick={handleConnect}
                >
                  {connected ? (
                    <>
                      <UserCheck size={16} className="mr-2" />
                      Conectado
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Conectar
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <MessageSquare size={16} className="mr-2" />
                  Mensagem
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Sobre</h3>
            <p className="text-sm text-muted-foreground">{bio}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
