
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProfessorOpportunity } from "@/pages/ProfessorOpportunities";

interface ProfessorOpportunitiesTableProps {
  opportunities: ProfessorOpportunity[];
  onSort: (field: keyof ProfessorOpportunity) => void;
  sortField: keyof ProfessorOpportunity | null;
  sortDirection: 'asc' | 'desc';
}

export function ProfessorOpportunitiesTable({
  opportunities,
  onSort,
  sortField,
  sortDirection,
}: ProfessorOpportunitiesTableProps) {
  const typeLabels: Record<string, string> = {
    monitoria: "Monitoria",
    iniciacao_cientifica: "Iniciação Científica",
    estagio: "Estágio",
    bolsa: "Bolsa",
    empresa_jr: "Empresa Júnior",
    laboratorio: "Laboratório",
  };

  const statusLabels: Record<string, string> = {
    aguardando: "Aguardando",
    em_analise: "Em análise",
    finalizada: "Finalizada",
    encerrada: "Encerrada",
  };

  const statusColors: Record<string, string> = {
    aguardando: "bg-amber-100 text-amber-800",
    em_analise: "bg-blue-100 text-blue-800",
    finalizada: "bg-green-100 text-green-800",
    encerrada: "bg-gray-100 text-gray-800",
  };

  const renderSortIcon = (field: keyof ProfessorOpportunity) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1" />
      );
    }
    return null;
  };

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => onSort('title')}
            >
              <div className="flex items-center">
                Nome da Vaga {renderSortIcon('title')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Tipo {renderSortIcon('type')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status {renderSortIcon('status')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => onSort('candidates')}
            >
              <div className="flex items-center justify-end">
                Candidatos {renderSortIcon('candidates')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center">
                Criada em {renderSortIcon('createdAt')}
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma oportunidade encontrada
              </TableCell>
            </TableRow>
          ) : (
            opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">{opportunity.title}</TableCell>
                <TableCell>{typeLabels[opportunity.type]}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[opportunity.status]}>
                    {statusLabels[opportunity.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{opportunity.candidates}</TableCell>
                <TableCell>{format(new Date(opportunity.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/professor/opportunities/${opportunity.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
