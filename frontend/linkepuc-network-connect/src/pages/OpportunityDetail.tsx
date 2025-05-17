
import { Header } from "@/components/layout/Header";
import { OpportunityDetailHeader } from "@/components/opportunity/OpportunityDetailHeader";
import { OpportunityDescription } from "@/components/opportunity/OpportunityDescription";
import { OpportunityRequirements } from "@/components/opportunity/OpportunityRequirements";
import { ProfessorProfile } from "@/components/opportunity/ProfessorProfile";
import { ApplicationStatus } from "@/components/opportunity/ApplicationStatus";
import { CandidateOverview } from "@/components/opportunity/CandidateOverview";
import { Button } from "@/components/ui/button";
import { OpportunityInterests } from "@/components/professor/OpportunityInterests";
import { useParams } from "react-router-dom";
import { useOpportunity } from "@/hooks/use-opportunity";

export default function OpportunityDetail() {
  const { id } = useParams();
  const { opportunity } = useOpportunity(id ?? "");

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <OpportunityDetailHeader opportunity={opportunity} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <OpportunityDescription description={opportunity.description} />
              {opportunity.interests && opportunity.interests.length > 0 && (
                <OpportunityInterests interests={opportunity.interests} />
              )}
              <OpportunityRequirements requirements={opportunity.requirements} />
              <ApplicationStatus 
                hasApplied={opportunity.candidateInfo.hasApplied}
                applicationDate={opportunity.candidateInfo.applicationDate}
                status={opportunity.candidateInfo.status}
              />
            </div>
            
            <div className="space-y-6">
              <CandidateOverview candidateInfo={opportunity.candidateInfo} />
              <ProfessorProfile professor={opportunity.professor} />
              
              {!opportunity.candidateInfo.hasApplied && (
                <Button className="w-full" size="lg">
                  Me candidatar
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
