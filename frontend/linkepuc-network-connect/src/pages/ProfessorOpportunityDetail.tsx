
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { ProfessorOpportunityHeader } from "@/components/professor/ProfessorOpportunityHeader";
import { OpportunityDescription } from "@/components/opportunity/OpportunityDescription";
import { OpportunityBenefits } from "@/components/professor/OpportunityBenefits";
import { OpportunityMetrics } from "@/components/professor/OpportunityMetrics";
import { StudentCandidatesList } from "@/components/professor/StudentCandidatesList";
import { OpportunityActions } from "@/components/professor/OpportunityActions";
import { OpportunityInterests } from "@/components/professor/OpportunityInterests";
import { useParams } from "react-router-dom";
import { useProfessorOpportunity } from "@/hooks/use-professor-opportunity";

export default function ProfessorOpportunityDetail() {
  const { id } = useParams();
  const { opportunity } = useProfessorOpportunity(id ?? "");

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
              
              <OpportunityMetrics 
                totalCandidates={opportunity.metrics.totalCandidates}
                eligibleCandidates={opportunity.metrics.eligibleCandidates}
                withMotivationLetter={opportunity.metrics.withMotivationLetter}
                courseDistribution={opportunity.metrics.courseDistribution}
                semesterDistribution={opportunity.metrics.semesterDistribution}
              />
              
              <StudentCandidatesList candidates={opportunity.candidates} />
            </div>
            
            <div className="space-y-6">
              <OpportunityBenefits benefits={opportunity.benefits} />
              <OpportunityActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
