
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BenefitsFilterProps {
  selectedBenefits: string[];
  onToggleBenefit: (benefit: string) => void;
}

export function BenefitsFilter({
  selectedBenefits,
  onToggleBenefit,
}: BenefitsFilterProps) {
  const benefitOptions = [
    { id: "remuneracao", label: "Remuneração" },
    { id: "desconto_mensalidade", label: "Desconto na Mensalidade" },
    { id: "horas_complementares", label: "Horas Complementares" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Benefícios</h3>
      <div className="space-y-2">
        {benefitOptions.map((benefit) => (
          <div key={benefit.id} className="flex items-center space-x-2">
            <Checkbox
              id={benefit.id}
              checked={selectedBenefits.includes(benefit.id)}
              onCheckedChange={() => onToggleBenefit(benefit.id)}
            />
            <Label
              htmlFor={benefit.id}
              className="text-sm cursor-pointer"
            >
              {benefit.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
