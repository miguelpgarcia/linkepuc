import { useState, useEffect } from "react";
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
import { useProfessorOpportunities, ProfessorOpportunity } from "@/hooks/use-professor-opportunities";
import { Loader2 } from "lucide-react";

export default function ProfessorOpportunities() {
  const { opportunities, isLoading, error } = useProfessorOpportunities();
  const [filteredOpportunities, setFilteredOpportunities] = useState<ProfessorOpportunity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof ProfessorOpportunity | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    year: "",
    candidates: ""
  });

  // Update filtered opportunities when opportunities data changes
  useEffect(() => {
    if (opportunities) {
      setFilteredOpportunities(opportunities);
    }
  }, [opportunities]);

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
    
    let filtered = opportunities || [];
    
    if (newFilters.type) {
      filtered = filtered.filter(opp => opp.tipo.nome === newFilters.type);
    }
    
    if (newFilters.status) {
      filtered = filtered.filter(opp => opp.status === newFilters.status);
    }
    
    if (newFilters.year) {
      filtered = filtered.filter(opp => opp.criado_em.startsWith(newFilters.year));
    }
    
    if (newFilters.candidates) {
      const minCandidates = parseInt(newFilters.candidates);
      filtered = filtered.filter(opp => opp.candidates >= minCandidates);
    }
    
    setFilteredOpportunities(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <ProfessorHeader />
        <main className="container py-6">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/20">
        <ProfessorHeader />
        <main className="container py-6">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-destructive">Erro ao carregar oportunidades</p>
          </div>
        </main>
      </div>
    );
  }

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
