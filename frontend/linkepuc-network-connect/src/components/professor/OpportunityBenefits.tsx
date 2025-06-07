
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Clock } from "lucide-react";

interface BenefitsProps {
  benefits: {
    remuneracao?: string;
    desconto_mensalidade?: string;
    horas_complementares?: string;
  };
}

export function OpportunityBenefits({ benefits }: BenefitsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefícios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benefits.remuneracao && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Remuneração</div>
              <div className="text-sm text-muted-foreground">{benefits.remuneracao}</div>
            </div>
          </div>
        )}

        {benefits.desconto_mensalidade && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Percent className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Desconto na mensalidade</div>
              <div className="text-sm text-muted-foreground">{benefits.desconto_mensalidade}</div>
            </div>
          </div>
        )}

        {benefits.horas_complementares && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-medium">Horas complementares</div>
              <div className="text-sm text-muted-foreground">{benefits.horas_complementares}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
