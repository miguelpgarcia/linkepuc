import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { ProfessorOpportunityHeader } from "@/components/professor/ProfessorOpportunityHeader";
import { OpportunityDescription } from "@/components/opportunity/OpportunityDescription";
import { OpportunityBenefits } from "@/components/professor/OpportunityBenefits";
import { OpportunityMetricsReal } from "@/components/professor/OpportunityMetricsReal";
import { StudentCandidatesList } from "@/components/professor/StudentCandidatesList";
import { OpportunityActions } from "@/components/professor/OpportunityActions";
import { OpportunityInterests } from "@/components/professor/OpportunityInterests";
import { useParams } from "react-router-dom";
import { useProfessorOpportunity } from "@/hooks/use-professor-opportunity";
import { Loader2 } from "lucide-react";

export default function ProfessorOpportunityDetail() {
  const { id } = useParams();
  const { opportunity, isLoading, error } = useProfessorOpportunity(id ?? "");

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

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-muted/20">
        <ProfessorHeader />
        <main className="container py-6">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-destructive">Erro ao carregar detalhes da oportunidade</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <ProfessorHeader />
      <main className="container py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <ProfessorOpportunityHeader opportunity={opportunity} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <OpportunityDescription description={opportunity.description} />
              
              <OpportunityInterests interests={opportunity.interests} />
              
              <OpportunityMetricsReal vagaId={opportunity.id} />
              
              <StudentCandidatesList vagaId={opportunity.id} />
            </div>
            
            <div className="space-y-6">
              <OpportunityBenefits benefits={opportunity.benefits} />
              <OpportunityActions 
                opportunityId={opportunity.id}
                currentStatus={opportunity.status}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
