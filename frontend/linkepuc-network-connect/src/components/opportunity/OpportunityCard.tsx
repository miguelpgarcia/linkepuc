import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookmarkIcon, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";

export type OpportunityType = 
  | "monitoria" 
  | "iniciacao_cientifica" 
  | "estagio" 
  | "bolsa" 
  | "empresa_jr" 
  | "laboratorio";

interface OpportunityProps {
  id: string;
  title: string;
  department: {
    id: number;
    name: string;
  };
  location: string;
  postedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  timeAgo: string;
  type: OpportunityType;
  description: string;
  benefits?: {
    remuneracao?: string;
    desconto_mensalidade?: string;
    horas_complementares?: string;
  };
  isSaved?: boolean;
}

export function OpportunityCard({
  id,
  title,
  department,
  location,
  postedBy,
  timeAgo,
  type,
  description,
  benefits,
  isSaved = false,
}: OpportunityProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
  };

  const typeLabels: Record<OpportunityType, string> = {
    monitoria: "Monitoria",
    iniciacao_cientifica: "Iniciação Científica",
    estagio: "Estágio",
    bolsa: "Bolsa",
    empresa_jr: "Empresa Júnior",
    laboratorio: "Laboratório",
  };

  const typeColors: Record<OpportunityType, string> = {
    monitoria: "bg-blue-100 text-blue-800",
    iniciacao_cientifica: "bg-purple-100 text-purple-800",
    estagio: "bg-green-100 text-green-800",
    bolsa: "bg-amber-100 text-amber-800",
    empresa_jr: "bg-pink-100 text-pink-800",
    laboratorio: "bg-cyan-100 text-cyan-800",
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Link to={`/profile/${postedBy.id}`}>
              <Avatar>
                <AvatarImage src={postedBy.avatar} />
                <AvatarFallback>
                  {postedBy.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${postedBy.id}`}
                  className="font-medium hover:underline"
                >
                  {postedBy.name}
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                <span>Publicado {timeAgo}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={saved ? "text-primary" : ""}
            onClick={handleSave}
          >
            <BookmarkIcon size={18} className={saved ? "fill-primary" : ""} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Link to={`/opportunities/${id}`}>
          <h3 className="text-lg font-semibold mb-1 hover:underline">{title}</h3>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground gap-3 mb-2">
          <span>{department.name}</span>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
        <Badge className={`${typeColors[type]} border-0 mb-3`}>
          {typeLabels[type]}
        </Badge>
        
        {/* Benefits section */}
        {benefits && Object.keys(benefits).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {benefits.remuneracao && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Remuneração: {benefits.remuneracao}
              </Badge>
            )}
            {benefits.desconto_mensalidade && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Desconto: {benefits.desconto_mensalidade}
              </Badge>
            )}
            {benefits.horas_complementares && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Horas Complementares: {benefits.horas_complementares}
              </Badge>
            )}
          </div>
        )}
        
        <p className="text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex justify-between w-full">
          <Button asChild>
            <Link to={`/opportunities/${id}`}>
              <Briefcase size={16} className="mr-2" />
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
