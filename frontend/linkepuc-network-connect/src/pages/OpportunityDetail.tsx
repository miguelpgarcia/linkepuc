import { Header } from "@/components/layout/Header";
import { OpportunityDetailHeader } from "@/components/opportunity/OpportunityDetailHeader";
import { OpportunityDescription } from "@/components/opportunity/OpportunityDescription";
import { OpportunityRequirements } from "@/components/opportunity/OpportunityRequirements";
import { ProfessorProfile } from "@/components/opportunity/ProfessorProfile";
import { OpportunityLink } from "@/components/opportunity/OpportunityLink";
import { ApplicationSection } from "@/components/opportunity/ApplicationSection";
import { Button } from "@/components/ui/button";
import { OpportunityInterests } from "@/components/professor/OpportunityInterests";
import { useParams, useNavigate } from "react-router-dom";
import { useOpportunity } from "@/hooks/use-opportunity";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { opportunity, isLoading, error } = useOpportunity(id ?? "");

  // Debug logs
  console.log("Opportunity data:", opportunity);
  console.log("Link vaga:", opportunity?.link_vaga);
  console.log("Link vaga type:", typeof opportunity?.link_vaga);
  console.log("Link vaga length:", opportunity?.link_vaga?.length);
  console.log("Interesses:", opportunity?.interesses);
  console.log("Interesses length:", opportunity?.interesses?.length);

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
                <OpportunityInterests interests={opportunity.interesses.map(i => i.interesse.nome)} />
              )}
            </div>
            
            <div className="space-y-6">
              {opportunity.professor ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Professor Responsável
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div>
                          <h3 className="font-semibold">{opportunity.professor}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Autor da Publicação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={opportunity.autor.avatar} />
                          <AvatarFallback>{opportunity.autor.usuario[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{opportunity.autor.usuario}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <ProfessorProfile professor={{
                  id: opportunity.autor.id.toString(),
                  name: opportunity.autor.usuario,
                  avatar: opportunity.autor.avatar,
                  subjects: [],
                  otherOpportunities: 0
                }} />
              )}
              
              <ApplicationSection 
                vagaId={opportunity.id} 
                vagaTitulo={opportunity.titulo} 
              />
              
              <OpportunityLink link={opportunity.link_vaga} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
