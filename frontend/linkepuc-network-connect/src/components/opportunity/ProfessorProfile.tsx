
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface Professor {
  id: string;
  name: string;
  avatar?: string;
  subjects: string[];
  otherOpportunities: number;
}

interface ProfessorProfileProps {
  professor: Professor;
}

export function ProfessorProfile({ professor }: ProfessorProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Professor Responsável
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={professor.avatar} alt={professor.name} />
            <AvatarFallback>
              {professor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{professor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {professor.subjects.join(" • ")}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {professor.otherOpportunities} outras oportunidades ativas
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to={`/profile/${professor.id}`}>Ver perfil completo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
