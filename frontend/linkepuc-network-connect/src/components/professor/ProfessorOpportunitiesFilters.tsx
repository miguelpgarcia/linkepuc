import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useOpportunityFilters } from "@/hooks/use-opportunity-filters";

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2].map((year) => year.toString());

interface FiltersProps {
  filters: {
    type: string;
    status: string;
    year: string;
    candidates: string;
  };
  onFilterChange: (filters: {
    type: string;
    status: string;
    year: string;
    candidates: string;
  }) => void;
}

export function ProfessorOpportunitiesFilters({ filters, onFilterChange }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { types: opportunityTypes } = useOpportunityFilters();

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: "",
      status: "",
      year: "",
      candidates: "",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
      <div className="text-lg font-medium mb-2 flex items-center">
        <Filter className="mr-2 h-5 w-5" />
        Filtros
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Select
            value={localFilters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              {opportunityTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="em_analise">Em análise</SelectItem>
              <SelectItem value="finalizada">Finalizada</SelectItem>
              <SelectItem value="encerrada">Encerrada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Ano</label>
          <Select
            value={localFilters.year}
            onValueChange={(value) => handleFilterChange("year", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os anos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os anos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Mín. Candidatos</label>
          <Select
            value={localFilters.candidates}
            onValueChange={(value) => handleFilterChange("candidates", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Qualquer número" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer número</SelectItem>
              <SelectItem value="5">5+ candidatos</SelectItem>
              <SelectItem value="10">10+ candidatos</SelectItem>
              <SelectItem value="15">15+ candidatos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
