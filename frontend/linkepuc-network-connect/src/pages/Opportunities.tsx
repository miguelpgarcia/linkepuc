import { Header } from "@/components/layout/Header";
import { OpportunityCard, OpportunityType } from "@/components/opportunity/OpportunityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { RemainingHoursCredits } from "@/components/opportunity/RemainingHoursCredits";
import { BenefitsFilter } from "@/components/opportunity/BenefitsFilter";
import { CurriculumPrompt } from "@/components/opportunities/CurriculumPrompt";
import { apiFetch } from "@/apiFetch";
import { useQuery } from "@tanstack/react-query";
import { useCurriculumStatus } from "@/hooks/use-curriculum-status";
import { useComplementaryHours } from "@/hooks/use-curriculum-data";
import { useGlobalData } from "@/hooks/use-global-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { API_ENDPOINTS } from "@/config/api";

interface Opportunity {
  id: number;
  titulo: string;
  descricao: string;
  // add other fields as needed
}

export default function Opportunities() {
  // Separate states for pending filters (UI) and applied filters (sent to backend)
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [pendingSelectedTypes, setPendingSelectedTypes] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Todos os Departamentos");
  const [pendingSelectedDepartment, setPendingSelectedDepartment] = useState("Todos os Departamentos");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [pendingSelectedBenefits, setPendingSelectedBenefits] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 8;

  // Check curriculum status
  const { data: curriculumStatus } = useCurriculumStatus();
  
  // Get complementary hours data
  const { hasHistory, completed, totalRequired, isLoading: isLoadingHours } = useComplementaryHours();

  // Use centralized global data instead of making duplicate API calls
  const { types: rawTypes, departments: rawDepartments, isLoading: isLoadingFilters } = useGlobalData();

  // Transform data to the format expected by this component
  const filtersData = useMemo(() => {
    if (!rawTypes.length || !rawDepartments.length) return null;
    
    return {
      types: rawTypes.map((type: { id: number; nome: string }) => ({
        id: type.id,
        value: type.id.toString(),
        label: type.nome,
        color: "bg-blue-100 text-blue-800",
      })),
      departments: ["Todos os Departamentos", ...rawDepartments.map((dept: { id: number; name: string }) => dept.name)],
    };
  }, [rawTypes, rawDepartments]);

  // Check if there are pending filter changes
  const hasPendingChanges = useMemo(() => {
    const pendingTypesSorted = [...pendingSelectedTypes].sort();
    const selectedTypesSorted = [...selectedTypes].sort();
    const pendingBenefitsSorted = [...pendingSelectedBenefits].sort();
    const selectedBenefitsSorted = [...selectedBenefits].sort();
    
    return (
      JSON.stringify(pendingTypesSorted) !== JSON.stringify(selectedTypesSorted) ||
      pendingSelectedDepartment !== selectedDepartment ||
      JSON.stringify(pendingBenefitsSorted) !== JSON.stringify(selectedBenefitsSorted) ||
      pendingSearchQuery.trim() !== searchQuery.trim()
    );
  }, [pendingSelectedTypes, selectedTypes, pendingSelectedDepartment, selectedDepartment, pendingSelectedBenefits, selectedBenefits, pendingSearchQuery, searchQuery]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return selectedTypes.length > 0 || 
           selectedDepartment !== "Todos os Departamentos" || 
           selectedBenefits.length > 0 || 
           searchQuery.trim() !== "";
  }, [selectedTypes, selectedDepartment, selectedBenefits, searchQuery]);

  // Build query parameters for backend filtering
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append('skip', (page * PAGE_SIZE).toString());
    params.append('limit', PAGE_SIZE.toString());
    
    // Add filters
    if (selectedTypes.length > 0) {
      params.append('tipos', selectedTypes.join(','));
    }
    if (selectedDepartment !== "Todos os Departamentos") {
      params.append('departamento', selectedDepartment);
    }
    if (selectedBenefits.length > 0) {
      params.append('beneficios', selectedBenefits.join(','));
    }
    if (searchQuery.trim()) {
      params.append('busca', searchQuery.trim());
    }
    
    return params.toString();
  }, [page, selectedTypes, selectedDepartment, selectedBenefits, searchQuery]);

  // Fetch opportunities with React Query
  const { data: opportunitiesData, isLoading: isLoadingOpportunities } = useQuery({
    queryKey: ['opportunities', page, selectedTypes, selectedDepartment, selectedBenefits, searchQuery], 
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const response = await apiFetch(`${API_ENDPOINTS.VAGAS.BASE}?${queryParams}`);
      const data = await response.json();
      return data;
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
    enabled: !isLoadingFilters && !!filtersData,
  });

  const opportunityTypes = filtersData?.types || [];
  const departments = filtersData?.departments || [];

  // Map raw opportunities to frontend shape using useMemo
  const allOpportunities = useMemo(() => {
    if (!opportunitiesData?.vagas || !opportunityTypes) return [];
    return mapBackendToFrontendOpportunities(opportunitiesData.vagas, opportunityTypes);
  }, [opportunitiesData, opportunityTypes]);

  // No need for frontend filtering since backend handles it
  const filteredOpportunities = allOpportunities;

  // Reset page when filters are applied
  useEffect(() => {
    setPage(0);
  }, [selectedTypes, selectedDepartment, selectedBenefits, searchQuery]);

  const isLoading = isLoadingFilters || isLoadingOpportunities;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      setPendingSearchQuery(searchInputRef.current.value);
    }
  };

  const togglePendingType = (typeId: number) => {
    if (pendingSelectedTypes.includes(typeId)) {
      setPendingSelectedTypes(pendingSelectedTypes.filter((id) => id !== typeId));
    } else {
      setPendingSelectedTypes([...pendingSelectedTypes, typeId]);
    }
  };

  const togglePendingBenefit = (benefit: string) => {
    if (pendingSelectedBenefits.includes(benefit)) {
      setPendingSelectedBenefits(pendingSelectedBenefits.filter((b) => b !== benefit));
    } else {
      setPendingSelectedBenefits([...pendingSelectedBenefits, benefit]);
    }
  };

  const applyFilters = () => {
    setSelectedTypes([...pendingSelectedTypes]);
    setSelectedDepartment(pendingSelectedDepartment);
    setSelectedBenefits([...pendingSelectedBenefits]);
    setSearchQuery(pendingSearchQuery);
  };

  const clearAllFilters = () => {
    // Clear both pending and applied filters
    setPendingSelectedTypes([]);
    setPendingSelectedDepartment("Todos os Departamentos");
    setPendingSelectedBenefits([]);
    setPendingSearchQuery("");
    setSelectedTypes([]);
    setSelectedDepartment("Todos os Departamentos");
    setSelectedBenefits([]);
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // Initialize pending filters with current applied filters only once
  useEffect(() => {
    if (selectedTypes.length === 0 && selectedDepartment === "Todos os Departamentos" && 
        selectedBenefits.length === 0 && searchQuery === "") {
      // Only initialize if we're starting fresh
      setPendingSelectedTypes([]);
      setPendingSelectedDepartment("Todos os Departamentos");
      setPendingSelectedBenefits([]);
      setPendingSearchQuery("");
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-72 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Tipo de Oportunidade</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunityTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={pendingSelectedTypes.includes(type.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          pendingSelectedTypes.includes(type.id) && !selectedTypes.includes(type.id) 
                            ? "ring-2 ring-primary ring-opacity-50" 
                            : ""
                        }`}
                        onClick={() => togglePendingType(type.id)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Departamento</h3>
                  <div className="max-h-60 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                    {departments.map((dept) => (
                      <Button
                        key={dept}
                        variant={pendingSelectedDepartment === dept ? "default" : "ghost"}
                        className={`w-full justify-start font-normal text-left ${
                          pendingSelectedDepartment === dept && selectedDepartment !== dept
                            ? "ring-2 ring-primary ring-opacity-50"
                            : ""
                        }`}
                        onClick={() => setPendingSelectedDepartment(dept)}
                      >
                        <span className="truncate">{dept}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <BenefitsFilter
                  selectedBenefits={pendingSelectedBenefits}
                  onToggleBenefit={togglePendingBenefit}
                />

                {(hasActiveFilters || hasPendingChanges) && (
                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="w-full"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <RemainingHoursCredits
              totalRequired={totalRequired}
              completed={completed}
              hasUploadedHistory={hasHistory}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold">Oportunidades Acadêmicas</h1>
            </div>

            {/* Show curriculum prompt if user hasn't imported their curriculum */}
            {curriculumStatus && !curriculumStatus.has_curriculum && (
              <CurriculumPrompt />
            )}

            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar oportunidades..."
                className="pl-10"
                defaultValue={searchQuery}
              />
            </form>

            {/* Apply Filters Section */}
            {hasPendingChanges && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-2">Filtros Selecionados:</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      {pendingSelectedTypes.length > 0 && (
                        <div>
                          <strong>Tipos:</strong> {pendingSelectedTypes.map(id => 
                            opportunityTypes.find(t => t.id === id)?.label
                          ).filter(Boolean).join(', ')}
                        </div>
                      )}
                      {pendingSelectedDepartment !== "Todos os Departamentos" && (
                        <div><strong>Departamento:</strong> {pendingSelectedDepartment}</div>
                      )}
                      {pendingSelectedBenefits.length > 0 && (
                        <div><strong>Benefícios:</strong> {pendingSelectedBenefits.join(', ')}</div>
                      )}
                      {pendingSearchQuery.trim() && (
                        <div><strong>Busca:</strong> "{pendingSearchQuery.trim()}"</div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={applyFilters}
                    className="ml-4"
                    size="sm"
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-green-900 mb-1">Filtros Aplicados:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTypes.length > 0 && selectedTypes.map(id => {
                        const type = opportunityTypes.find(t => t.id === id);
                        return type ? (
                          <Badge key={id} className="bg-green-100 text-green-800 border-green-300">
                            {type.label}
                          </Badge>
                        ) : null;
                      })}
                      {selectedDepartment !== "Todos os Departamentos" && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          {selectedDepartment}
                        </Badge>
                      )}
                      {selectedBenefits.map(benefit => (
                        <Badge key={benefit} className="bg-green-100 text-green-800 border-green-300">
                          {benefit}
                        </Badge>
                      ))}
                      {searchQuery.trim() && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          "{searchQuery.trim()}"
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={clearAllFilters}
                    variant="outline"
                    size="sm"
                    className="ml-4 text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            )}

            {/* Single list of opportunities */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Oportunidades para Você
                  </h2>
                  {hasActiveFilters && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {opportunitiesData?.total || 0} oportunidade{(opportunitiesData?.total || 0) !== 1 ? 's' : ''} encontrada{(opportunitiesData?.total || 0) !== 1 ? 's' : ''} com os filtros aplicados
                    </p>
                  )}
                </div>
                {opportunitiesData?.recommended_count > 0 && !hasActiveFilters && (
                  <span className="text-sm text-muted-foreground">
                    {opportunitiesData.recommended_count} recomendadas baseadas nos seus interesses
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando oportunidades...</p>
                </div>
              ) : filteredOpportunities.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {filteredOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="relative">
                        {/* Recommendation Badge */}
                        {opportunity.isRecommended && (
                          <div className="absolute top-4 right-4 z-10">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge className="bg-primary/10 text-primary border-primary/20">
                                    <span className="text-xs">★</span>
                                    <span className="ml-1">
                                      {opportunity.recommendationScore 
                                        ? `${Math.round(opportunity.recommendationScore * 100)}% match`
                                        : 'Recomendado'
                                      }
                                    </span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-xs">
                                    <p className="font-medium mb-1">Por que foi recomendado:</p>
                                    {opportunity.recommendationStrategies && opportunity.recommendationStrategies.length > 0 ? (
                                      <ul className="text-sm space-y-1">
                                        {opportunity.recommendationStrategies.map((strategy: any, index: number) => (
                                          <li key={index}>
                                            • {strategy.explanation}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm">Baseado nos seus interesses</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                        <OpportunityCard {...opportunity} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button 
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0 || isLoading}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    <span className="py-2">
                      Página {page + 1} de {Math.ceil((opportunitiesData?.total || 0) / PAGE_SIZE)}
                    </span>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={(page + 1) * PAGE_SIZE >= (opportunitiesData?.total || 0) || isLoading}
                      variant="outline"
                    >
                      Próxima
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhuma oportunidade encontrada com os filtros atuais.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function mapBackendToFrontendOpportunities(data: any[], opportunityTypes: { id: number; value: string; label: string; color: string }[]): any[] {
  // Function to map backend type names to frontend type enum
  const mapTypeToFrontend = (backendType: any): "monitoria" | "iniciacao_cientifica" | "estagio" | "bolsa" | "empresa_jr" | "laboratorio" => {
    if (!backendType?.nome) return "monitoria";
    
    const typeName = backendType.nome.toLowerCase()
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z\s]/g, ""); // Remove non-alphabetic characters except spaces
    
    // More comprehensive matching
    if (typeName.includes("monitoria")) return "monitoria";
    if (typeName.includes("iniciacao") || typeName.includes("cientifica") || 
        typeName.includes("pesquisa") || typeName.includes("ic")) return "iniciacao_cientifica";
    if (typeName.includes("estagio") || typeName.includes("trainee")) return "estagio";
    if (typeName.includes("bolsa") || typeName.includes("auxilio")) return "bolsa";
    if (typeName.includes("empresa") || typeName.includes("junior") || typeName.includes("jr")) return "empresa_jr";
    if (typeName.includes("laboratorio") || typeName.includes("lab")) return "laboratorio";
    
    return "monitoria"; // default
  };

  return data.map((item) => {
    return {
      id: item.id.toString(), // Convert to string
      title: item.titulo || "Título não especificado",
      department: {
        id: item.department?.id || 0,
        name: item.department?.name || "Departamento não especificado"
      },
      location: item.location?.name || "Localização não especificada", // Extract name from location object
      postedBy: item.autor
        ? {
            id: item.autor.id.toString(), // Convert to string
            name: item.autor.nome || item.autor.usuario, // Use nome field from backend
            avatar: item.autor.avatar,
          }
        : { id: "0", name: "Autor desconhecido", avatar: "" },
      timeAgo: "Publicado recentemente",
      type: mapTypeToFrontend(item.tipo), // Map to correct frontend type
      description: item.descricao || "Descrição não especificada",
      benefits: {
        remuneracao: item.remuneracao ? `R$${item.remuneracao},00` : undefined,
        desconto_mensalidade: item.desconto ? `${item.desconto}%` : undefined,
        horas_complementares: item.horas_complementares
          ? `${item.horas_complementares}h`
          : undefined,
      },
      isRecommended: item.isRecommended,
      // Keep original tipo for filtering
      originalTipo: item.tipo,
      // Add recommendation data
      recommendationScore: item.recommendationScore,
      recommendationStrategies: item.recommendationStrategies,
    };
  });
}
