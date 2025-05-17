
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const benefitTypes = [
  { id: "remuneracao", label: "Remuneração", unit: "R$" },
  { id: "desconto_mensalidade", label: "Desconto na Mensalidade", unit: "%" },
  { id: "horas_complementares", label: "Horas Complementares", unit: "horas" },
];

interface BenefitSelectorProps {
  form: UseFormReturn<any>;
  selectedBenefits: string[];
  onBenefitChange: (checked: boolean, id: string) => void;
}

export function BenefitSelector({ form, selectedBenefits, onBenefitChange }: BenefitSelectorProps) {
  return (
    <div>
      <FormLabel className="block mb-3">Benefícios</FormLabel>
      <div className="space-y-4 border rounded-md p-4">
        {benefitTypes.map((benefit) => (
          <div key={benefit.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={benefit.id}
                checked={selectedBenefits.includes(benefit.id)}
                onCheckedChange={(checked) => 
                  onBenefitChange(checked === true, benefit.id)
                }
              />
              <label
                htmlFor={benefit.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {benefit.label}
              </label>
            </div>
            
            {selectedBenefits.includes(benefit.id) && (
              <FormField
                control={form.control}
                name={benefit.id as "remuneracao" | "desconto_mensalidade" | "horas_complementares"}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          type={benefit.id === "desconto_mensalidade" ? "number" : "text"}
                          placeholder={`Valor em ${benefit.unit}`}
                          {...field}
                          className="max-w-[200px]"
                        />
                      </FormControl>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {benefit.unit}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
