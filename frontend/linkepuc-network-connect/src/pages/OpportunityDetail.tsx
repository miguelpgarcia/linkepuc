import { Header } from "@/components/layout/Header";
import { OpportunityDetailHeader } from "@/components/opportunity/OpportunityDetailHeader";
import { OpportunityDescription } from "@/components/opportunity/OpportunityDescription";
import { OpportunityRequirements } from "@/components/opportunity/OpportunityRequirements";
import { ProfessorProfile } from "@/components/opportunity/ProfessorProfile";
import { Button } from "@/components/ui/button";
import { OpportunityInterests } from "@/components/professor/OpportunityInterests";
import { useParams, useNavigate } from "react-router-dom";
import { useOpportunity } from "@/hooks/use-opportunity";
import { Loader2 } from "lucide-react";

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunity, isLoading, error } = useOpportunity(id ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header />
        <main className="container py-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Erro ao carregar oportunidade</h1>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os detalhes desta oportunidade.
            </p>
            <Button onClick={() => navigate("/opportunities")}>
              Voltar para Oportunidades
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <OpportunityDetailHeader opportunity={opportunity} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OpportunityDescription description={opportunity.descricao} />
              {opportunity.interesses && opportunity.interesses.length > 0 && (
                <OpportunityInterests interests={opportunity.interesses.map(i => i.nome)} />
              )}
              <OpportunityRequirements requirements={[]} />
            </div>
            
            <div className="space-y-6">
              <ProfessorProfile professor={{
                id: opportunity.autor.id.toString(),
                name: opportunity.autor.usuario,
                avatar: opportunity.autor.avatar,
                subjects: [],
                otherOpportunities: 0
              }} />
              
              <Button className="w-full" size="lg" asChild>
                <a href={opportunity.link_vaga} target="_blank" rel="noopener noreferrer">
                  Me candidatar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
