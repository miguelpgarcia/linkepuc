import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Clock, HelpCircle } from "lucide-react";

interface RemainingHoursCreditsProps {
  totalRequired?: number;
  completed?: number | null;
  hasUploadedHistory: boolean;
}

export function RemainingHoursCredits({
  totalRequired = 10, // Total de 10 créditos para atividades complementares
  completed = null,
  hasUploadedHistory = false,
}: RemainingHoursCreditsProps) {
  
  if (!hasUploadedHistory) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Atividades Complementares
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-4">
          <div className="flex items-center justify-center mb-2">
            <HelpCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Importe seu histórico acadêmico para saber quantos créditos de atividades complementares faltam
          </p>
        </CardContent>
      </Card>
    );
  }

  // Se tem histórico mas não tem dados de atividades complementares
  if (completed === null) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Atividades Complementares
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-4">
          <div className="flex items-center justify-center mb-2">
            <HelpCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade complementar encontrada em relação ao seu último histórico importado
          </p>
        </CardContent>
      </Card>
    );
  }

  const remaining = Math.max(0, totalRequired - completed);
  const percentage = Math.min(100, Math.round((completed / totalRequired) * 100));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Atividades Complementares
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center">
          <div className="w-16 h-16 mr-4">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                textSize: "24px",
                pathColor: percentage >= 100 ? "#10b981" : "#3b82f6",
                textColor: percentage >= 100 ? "#10b981" : "#3b82f6",
              })}
            />
          </div>
          <div>
            <p className="font-medium">
              {remaining > 0
                ? `Faltam ${remaining} créditos`
                : "Todos os créditos completados!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {completed} de {totalRequired} créditos
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Em relação ao seu último histórico importado
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
