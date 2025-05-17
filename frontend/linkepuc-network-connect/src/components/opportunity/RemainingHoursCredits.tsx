
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Clock } from "lucide-react";

interface RemainingHoursCreditsProps {
  totalRequired: number;
  completed: number;
  hasUploadedHistory: boolean;
}

export function RemainingHoursCredits({
  totalRequired = 200,
  completed = 120,
  hasUploadedHistory = true,
}: RemainingHoursCreditsProps) {
  const remaining = totalRequired - completed;
  const percentage = Math.min(100, Math.round((completed / totalRequired) * 100));

  if (!hasUploadedHistory) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Horas Complementares
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Envie seu histórico para visualizar suas horas complementares
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Horas Complementares
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
                ? `Faltam ${remaining} horas`
                : "Todas horas completadas!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {completed} de {totalRequired} horas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
