import { Header } from "@/components/layout/Header";
import { OpportunityCard, OpportunityType } from "@/components/opportunity/OpportunityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { RemainingHoursCredits } from "@/components/opportunity/RemainingHoursCredits";
import { BenefitsFilter } from "@/components/opportunity/BenefitsFilter";

const opportunityTypes: {
  value: OpportunityType;
  label: string;
  color: string;
}[] = [
  { value: "monitoria", label: "Monitoria", color: "bg-blue-100 text-blue-800" },
  { value: "iniciacao_cientifica", label: "Iniciação Científica", color: "bg-purple-100 text-purple-800" },
  { value: "estagio", label: "Estágio", color: "bg-green-100 text-green-800" },
  { value: "bolsa", label: "Bolsa", color: "bg-amber-100 text-amber-800" },
  { value: "empresa_jr", label: "Empresa Júnior", color: "bg-pink-100 text-pink-800" },
  { value: "laboratorio", label: "Laboratório", color: "bg-cyan-100 text-cyan-800" },
];

const departments = [
  "Todos os Departamentos",
  "Ciência da Computação",
  "Engenharia",
  "Design",
  "Física",
  "Matemática",
  "Serviço Social",
  "Comunicação",
  "Administração",
];

function mapBackendToFrontendOpportunities(data: any[]): any[] {
  return data.map((item) => ({
    id: item.id,
    title: item.titulo || "Título não especificado", // Default value
    department: item.department || "Departamento não especificado", // Default value
    location: item.location || "Localização não especificada", // Default value
    postedBy: item.autor
      ? {
          id: item.autor.id,
          name: item.autor.usuario,
          avatar: item.autor.avatar,
        }
      : { id: "0", name: "Autor desconhecido", avatar: "" },
    timeAgo: "Publicado recentemente", // Placeholder
    type: item.tipo?.nome || "Tipo não especificado", // Default value
    description: item.descricao || "Descrição não especificada", // Default value
    benefits: {
      remuneracao: item.remuneracao ? `R$${item.remuneracao},00` : undefined,
      desconto_mensalidade: item.desconto ? `${item.desconto}%` : undefined,
      horas_complementares: item.horas_complementares
        ? `${item.horas_complementares}h`
        : undefined,
    },
  }));
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Todos os Departamentos");
  const [showRecommended, setShowRecommended] = useState(true);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const response = await fetch("http://localhost:8000/vagas/");
        const data = await response.json();
        const mappedData = mapBackendToFrontendOpportunities(data);
        setOpportunities(mappedData);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

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

  const toggleType = (type: OpportunityType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };
  const filteredOpportunities = opportunities.filter((opp) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      (opp.title && opp.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (opp.description && opp.description.toLowerCase().includes(searchQuery.toLowerCase()));
  
    // Filter by selected types
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(opp.type);
  
    // Filter by department
    const matchesDepartment =
      selectedDepartment === "Todos os Departamentos" ||
      (opp.department && opp.department.includes(selectedDepartment));
  
      // Filter by benefits
      const matchesBenefits = selectedBenefits.length === 0 || 
      (opp.benefits && selectedBenefits.every(benefit => 
        opp.benefits && benefit in opp.benefits
        && opp.benefits[benefit] !== undefined
      ));
    
      return matchesSearch && matchesType && matchesDepartment && matchesBenefits;
  });
  // Simulating recommended opportunities based on user interests
  const recommendedOpportunities = showRecommended
    ? opportunities.filter(
        (opp) =>
          opp.type === "iniciacao_cientifica" ||
          opp.department.includes("Informática") ||
          opp.title.toLowerCase().includes("algoritmo")
      )
    : [];

  if (loading) {
    return <div>Loading...</div>;
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
                        key={type.value}
                        variant={selectedTypes.includes(type.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleType(type.value)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Departamento</h3>
                  <div className="space-y-1">
                    {departments.map((dept) => (
                      <Button
                        key={dept}
                        variant={selectedDepartment === dept ? "default" : "ghost"}
                        className="w-full justify-start font-normal"
                        onClick={() => setSelectedDepartment(dept)}
                      >
                        {dept}
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
                  filteredOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} {...opportunity} />
                  ))
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
