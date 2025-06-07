import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CandidateInfo } from "@/types/opportunity";

interface CandidateOverviewProps {
  candidateInfo: CandidateInfo;
}

export function CandidateOverview({ candidateInfo }: CandidateOverviewProps) {
  const compatibilityPercentage =
    candidateInfo.compatibility === "Alta"
      ? 90
      : candidateInfo.compatibility === "Média"
      ? 60
      : 30;

  const compatibilityColor =
    candidateInfo.compatibility === "Alta"
      ? "text-green-600"
      : candidateInfo.compatibility === "Média"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Seu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Compatibilidade</span>
            <span className={compatibilityColor}>{candidateInfo.compatibility}</span>
          </div>
          <Progress value={compatibilityPercentage} className="h-2" />
        </div>

        <dl className="space-y-2">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Sua média na disciplina</dt>
            <dd className="font-medium">{candidateInfo.grade.toFixed(1)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Cursou em</dt>
            <dd className="font-medium">{candidateInfo.semester}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
