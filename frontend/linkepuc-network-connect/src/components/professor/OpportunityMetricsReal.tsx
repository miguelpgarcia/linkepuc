import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";
import { useCandidatos } from "@/hooks/use-candidaturas";

interface OpportunityMetricsRealProps {
  vagaId: number;
}

export function OpportunityMetricsReal({ vagaId }: OpportunityMetricsRealProps) {
  const { data: candidaturas, isLoading } = useCandidatos(vagaId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Candidatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card animate-pulse">
                <div className="rounded-full bg-muted w-10 h-10"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalCandidates = candidaturas?.length || 0;
  const withMotivationLetter = candidaturas?.filter(c => c.carta_motivacao && c.carta_motivacao.trim().length > 0).length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Candidatos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="rounded-full bg-violet-100 p-2">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <div className="font-medium">Total de candidatos</div>
              <div className="text-2xl font-bold">{totalCandidates}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="rounded-full bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Com carta de motivação</div>
              <div className="text-2xl font-bold">{withMotivationLetter}</div>
            </div>
          </div>
        </div>
        
        {totalCandidates === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum candidato ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 