import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ProfessorOpportunity } from "@/hooks/use-professor-opportunities";

const statusLabels = {
  aguardando: "Aguardando",
  em_analise: "Em análise",
  finalizada: "Finalizada",
  encerrada: "Encerrada",
  em_andamento: "Em andamento"
};

const statusColors = {
  aguardando: "bg-yellow-100 text-yellow-800",
  em_analise: "bg-blue-100 text-blue-800",
  finalizada: "bg-green-100 text-green-800",
  encerrada: "bg-gray-100 text-gray-800",
  em_andamento: "bg-purple-100 text-purple-800"
};

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

  const renderSortIcon = (field: keyof ProfessorOpportunity) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("titulo")}
                className="flex items-center gap-1"
              >
                Título
                {sortField === "titulo" && (
                  sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("tipo")}
                className="flex items-center gap-1"
              >
                Tipo
                {sortField === "tipo" && (
                  sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("status")}
                className="flex items-center gap-1"
              >
                Status
                {sortField === "status" && (
                  sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("candidates")}
                className="flex items-center gap-1"
              >
                Candidatos
                {sortField === "candidates" && (
                  sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort("criado_em")}
                className="flex items-center gap-1"
              >
                Criado em
                {sortField === "criado_em" && (
                  sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                )}
              </Button>
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
                <TableCell className="font-medium">{opportunity.titulo}</TableCell>
                <TableCell>{opportunity.tipo.nome}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[opportunity.status]}>
                    {statusLabels[opportunity.status]}
                  </Badge>
                </TableCell>
                <TableCell>{opportunity.candidates}</TableCell>
                <TableCell>
                  {format(new Date(opportunity.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/professor/opportunities/${opportunity.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver detalhes
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
