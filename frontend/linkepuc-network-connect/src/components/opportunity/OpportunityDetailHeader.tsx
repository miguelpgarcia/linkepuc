import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Award, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Opportunity } from "@/hooks/use-opportunity";

interface OpportunityDetailHeaderProps {
  opportunity: Opportunity;
}

export function OpportunityDetailHeader({ opportunity }: OpportunityDetailHeaderProps) {
  const isNew = new Date(opportunity.criado_em) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const deadlineDate = new Date(opportunity.prazo);
  const isUrgent = deadlineDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{opportunity.titulo}</h1>
                {isNew && (
                  <Badge variant="default" className="bg-orange-500">
                    🔥 Nova
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span className="capitalize">{opportunity.tipo.nome}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.department.name}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Publicada em{" "}
                {format(new Date(opportunity.criado_em), "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div>
              <Badge
                variant="outline"
                className={isUrgent ? "border-red-500 text-red-500" : ""}
              >
                Prazo: {format(deadlineDate, "dd 'de' MMMM", { locale: ptBR })}
              </Badge>
            </div>
          </div>

          {opportunity.interesses && opportunity.interesses.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                Áreas de Interesse:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.interesses.map((interest) => (
                  <Badge 
                    key={interest.id} 
                    variant="secondary" 
                    className="px-2 py-0.5 text-xs"
                  >
                    {interest.nome}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
