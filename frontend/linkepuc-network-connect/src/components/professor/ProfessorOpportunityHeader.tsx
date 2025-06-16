import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Award } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProfessorOpportunityDetail } from "@/types/professor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProfessorOpportunityHeaderProps {
  opportunity: ProfessorOpportunityDetail;
}

export function ProfessorOpportunityHeader({ opportunity }: ProfessorOpportunityHeaderProps) {
  const deadlineDate = new Date(opportunity.deadline);
  
  const statusLabels: Record<string, string> = {
    aguardando: "Aguardando",
    em_analise: "Em análise",
    finalizada: "Finalizada",
    encerrada: "Encerrada",
    em_andamento: "Em andamento"
  };

  const statusColors: Record<string, string> = {
    aguardando: "bg-amber-100 text-amber-800",
    em_analise: "bg-blue-100 text-blue-800",
    finalizada: "bg-green-100 text-green-800",
    encerrada: "bg-gray-100 text-gray-800",
    em_andamento: "bg-purple-100 text-purple-800"
  };

  const typeLabels: Record<string, string> = {
    monitoria: "Monitoria",
    iniciacao_cientifica: "Iniciação Científica",
    estagio: "Estágio",
    bolsa: "Bolsa",
    empresa_jr: "Empresa Júnior",
    laboratorio: "Laboratório",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{opportunity.title}</h1>
                <Badge variant="outline" className={statusColors[opportunity.status]}>
                  {statusLabels[opportunity.status]}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{typeLabels[opportunity.type]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.location} • {opportunity.modality}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{opportunity.workload}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <Link to="/professor/opportunities">
                Voltar
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Publicada em{" "}
                {format(new Date(opportunity.createdAt), "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div>
              <Badge variant="outline">
                Prazo: {format(deadlineDate, "dd 'de' MMMM", { locale: ptBR })}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
