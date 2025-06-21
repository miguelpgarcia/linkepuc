import { Header } from "@/components/layout/Header";
import { OpportunityCard, OpportunityType } from "@/components/opportunity/OpportunityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState, useMemo } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { RemainingHoursCredits } from "@/components/opportunity/RemainingHoursCredits";
import { BenefitsFilter } from "@/components/opportunity/BenefitsFilter";
import { apiFetch } from "@/apiFetch";
import { useQuery } from "@tanstack/react-query";

interface Opportunity {
  id: number;
  titulo: string;
  descricao: string;
  // add other fields as needed
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Todos os Departamentos");
  const [showRecommended, setShowRecommended] = useState(true);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 8;

  // Fetch filters with React Query
  const { data: filtersData, isLoading: isLoadingFilters } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const [typesResponse, departmentsResponse] = await Promise.all([
        apiFetch("http://localhost:8000/vagas/tipo"),
        apiFetch("http://localhost:8000/departamentos"),
      ]);

      const typesData = await typesResponse.json();
      const departmentsData = await departmentsResponse.json();

      return {
        types: typesData.map((type: { id: number; nome: string }) => ({
          id: type.id,
          value: type.id.toString(),
          label: type.nome,
          color: "bg-blue-100 text-blue-800",
        })),
        departments: ["Todos os Departamentos", ...departmentsData.map((dept: { id: string; name: string }) => dept.name)],
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000,  // Keep unused data for 30 minutes
  });

  // Fetch opportunities with React Query
  const { data: rawOpportunities = [], isLoading: isLoadingOpportunities } = useQuery({
    queryKey: ['opportunities', page], // Only depend on page number
    queryFn: async () => {
      const response = await apiFetch(`http://localhost:8000/vagas/?skip=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`);
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
  const opportunities = useMemo(() => {
    if (!rawOpportunities || !opportunityTypes) return [];
    return mapBackendToFrontendOpportunities(rawOpportunities, opportunityTypes);
  }, [rawOpportunities, opportunityTypes]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [selectedTypes, selectedDepartment, selectedBenefits, searchQuery]);

  const isLoading = isLoadingFilters || isLoadingOpportunities;

  // Mock data for complementary hours
  const hasUploadedHistory = true;
  const totalRequiredHours = 200;
  const completedHours = 120;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value);
    }
  };

  const toggleType = (typeId: number) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((id) => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const toggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesType = selectedTypes.length === 0 || (opp.tipo && selectedTypes.includes(opp.tipo.id));
      const matchesSearch =
        searchQuery === "" ||
        (opp.titulo && opp.titulo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (opp.descricao && opp.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDepartment =
        selectedDepartment === "Todos os Departamentos" ||
        (opp.department && opp.department.name === selectedDepartment);
      const matchesBenefits =
        selectedBenefits.length === 0 ||
        (opp.benefits &&
          selectedBenefits.every(
            (benefit) => opp.benefits && benefit in opp.benefits && opp.benefits[benefit] !== undefined
          ));

      return matchesType && matchesSearch && matchesDepartment && matchesBenefits;
    });
  }, [opportunities, selectedTypes, searchQuery, selectedDepartment, selectedBenefits]);

  // Simulating recommended opportunities based on user interests
  const recommendedOpportunities = useMemo(() => {
    return showRecommended
      ? opportunities.filter(
          (opp) =>
            (opp.tipo && opp.tipo.nome === "Iniciação Ciêntifica") ||
            (opp.department && opp.department.name.includes("Informática")) ||
            (opp.titulo && opp.titulo.toLowerCase().includes("algoritmo"))
        )
      : [];
  }, [opportunities, showRecommended]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando oportunidades...</p>
        </div>
      </div>
    );
  }

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
                        variant={selectedTypes.includes(type.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleType(type.id)}
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
                        variant={selectedDepartment === dept ? "default" : "ghost"}
                        className="w-full justify-start font-normal text-left"
                        onClick={() => setSelectedDepartment(dept)}
                      >
                        <span className="truncate">{dept}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <BenefitsFilter
                  selectedBenefits={selectedBenefits}
                  onToggleBenefit={toggleBenefit}
                />

                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recommended"
                      checked={showRecommended}
                      onCheckedChange={setShowRecommended}
                    />
                    <Label htmlFor="recommended">Mostrar recomendadas</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <RemainingHoursCredits
              totalRequired={totalRequiredHours}
              completed={completedHours}
              hasUploadedHistory={hasUploadedHistory}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold">Oportunidades Acadêmicas</h1>
            </div>

            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar oportunidades..."
                className="pl-10"
                defaultValue={searchQuery}
              />
            </form>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="recommended">Recomendadas</TabsTrigger>
                <TabsTrigger value="recent">Recentes</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {filteredOpportunities.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {filteredOpportunities.map((opportunity) => (
                        <OpportunityCard key={opportunity.id} {...opportunity} />
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
                        Página {page + 1}
                      </span>
                      <Button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={rawOpportunities.length < PAGE_SIZE || isLoading}
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
              </TabsContent>

              <TabsContent value="recommended">
                {recommendedOpportunities.length > 0 ? (
                  recommendedOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} {...opportunity} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Nenhuma oportunidade recomendada encontrada. Atualize seu perfil com seus interesses para receber recomendações.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                {opportunities.slice(0, 3).map((opportunity) => (
                  <OpportunityCard key={opportunity.id} {...opportunity} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export function mapBackendToFrontendOpportunities(data: any[], opportunityTypes: { id: number; value: string; label: string; color: string }[]): any[] {
  return data.map((item) => {
    const matchedType = opportunityTypes.find((type) => type.id === item.tipo?.id);

    return {
      id: item.id,
      title: item.titulo || "Título não especificado",
      department: {
        id: item.department?.id || 0,
        name: item.department?.name || "Departamento não especificado"
      },
      location: item.location || "Localização não especificada",
      postedBy: item.autor
        ? {
            id: item.autor.id,
            name: item.autor.usuario,
            avatar: item.autor.avatar,
          }
        : { id: "0", name: "Autor desconhecido", avatar: "" },
      timeAgo: "Publicado recentemente",
      tipo: item.tipo,
      description: item.descricao || "Descrição não especificada",
      benefits: {
        remuneracao: item.remuneracao ? `R$${item.remuneracao},00` : undefined,
        desconto_mensalidade: item.desconto ? `${item.desconto}%` : undefined,
        horas_complementares: item.horas_complementares
          ? `${item.horas_complementares}h`
          : undefined,
      },
    };
  });
}
