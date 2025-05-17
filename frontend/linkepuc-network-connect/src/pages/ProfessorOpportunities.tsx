
import { useState } from "react";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  Plus, 
  Eye,
  Calendar, 
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProfessorOpportunitiesTable } from "@/components/professor/ProfessorOpportunitiesTable";
import { ProfessorOpportunitiesFilters } from "@/components/professor/ProfessorOpportunitiesFilters";
import { OpportunityType } from "@/components/opportunity/OpportunityCard";

export interface ProfessorOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  status: "aguardando" | "em_analise" | "finalizada" | "encerrada";
  candidates: number;
  createdAt: string;
}

// Sample data for professor opportunities
const sampleProfessorOpportunities: ProfessorOpportunity[] = [
  {
    id: "1",
    title: "Monitoria de Álgebra",
    type: "monitoria",
    status: "aguardando",
    candidates: 12,
    createdAt: "2025-04-20"
  },
  {
    id: "2",
    title: "IC em Redes Neurais",
    type: "iniciacao_cientifica",
    status: "em_analise",
    candidates: 8,
    createdAt: "2025-03-10"
  },
  {
    id: "3",
    title: "Estágio em Laboratório de Computação",
    type: "estagio",
    status: "finalizada",
    candidates: 5,
    createdAt: "2025-02-15"
  },
  {
    id: "4",
    title: "Bolsa de Pesquisa em Engenharia de Software",
    type: "bolsa",
    status: "encerrada",
    candidates: 15,
    createdAt: "2025-01-25"
  },
  {
    id: "5",
    title: "Monitoria de Cálculo",
    type: "monitoria",
    status: "aguardando",
    candidates: 10,
    createdAt: "2025-04-10"
  }
];

export default function ProfessorOpportunities() {
  const [opportunities, setOpportunities] = useState<ProfessorOpportunity[]>(sampleProfessorOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState<ProfessorOpportunity[]>(sampleProfessorOpportunities);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof ProfessorOpportunity | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    year: "",
    candidates: ""
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSort = (field: keyof ProfessorOpportunity) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    
    const sorted = [...filteredOpportunities].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    
    setFilteredOpportunities(sorted);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Apply filters
    let filtered = [...opportunities];
    
    if (newFilters.type) {
      filtered = filtered.filter(opp => opp.type === newFilters.type);
    }
    
    if (newFilters.status) {
      filtered = filtered.filter(opp => opp.status === newFilters.status);
    }
    
    if (newFilters.year) {
      filtered = filtered.filter(opp => {
        const oppYear = new Date(opp.createdAt).getFullYear().toString();
        return oppYear === newFilters.year;
      });
    }
    
    if (newFilters.candidates) {
      const minCandidates = parseInt(newFilters.candidates);
      filtered = filtered.filter(opp => opp.candidates >= minCandidates);
    }
    
    setFilteredOpportunities(filtered);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <ProfessorHeader />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              👨‍🏫 Minhas Oportunidades
            </h1>
            <p className="text-muted-foreground">
              Gerencie as vagas e oportunidades que você criou
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button asChild>
              <Link to="/professor/opportunities/new">
                <Plus className="h-4 w-4 mr-2" />
                Nova Oportunidade
              </Link>
            </Button>
          </div>
        </div>

        {showFilters && (
          <ProfessorOpportunitiesFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        )}

        <ProfessorOpportunitiesTable 
          opportunities={filteredOpportunities} 
          onSort={handleSort} 
          sortField={sortField} 
          sortDirection={sortDirection} 
        />
      </main>
    </div>
  );
}
