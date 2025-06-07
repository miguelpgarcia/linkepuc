import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formSchema, fetchOpportunityTypes, fetchDepartments, OpportunityFormValues } from "./opportunityFormSchema";
import { BenefitSelector } from "./BenefitSelector";
import { InterestsSelector } from "./InterestsSelector";
import { apiFetch } from "@/apiFetch";

export function OpportunityForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [opportunityTypes, setOpportunityTypes] = useState<{ value: string; label: string }[]>([]);
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      description: "",
      benefits: [],
      interests: [],
      remuneracao: "",
      desconto_mensalidade: "",
      horas_complementares: "",
    },
  });

  useEffect(() => {
    fetchOpportunityTypes().then(setOpportunityTypes);
    fetchDepartments().then(setDepartments);
  }, []);

  const handleBenefitChange = (checked: boolean, id: string) => {
    setSelectedBenefits(
      checked
        ? [...selectedBenefits, id]
        : selectedBenefits.filter((item) => item !== id)
    );
  };

  const handleInterestsChange = (interests: string[]) => {
    setSelectedInterests(interests);
    form.setValue("interests", interests);
  };

  async function onSubmit(values: OpportunityFormValues) {
    // Map user-facing values to IDs
    console.log("onSubmit called with values:", values);

    const tipo = opportunityTypes.find((type) => type.value === values.type);
    const department = departments.find((dept) => dept.value === values.department);

    const locationId = values.location === "1" ? 1 : 2; // Map location to IDs (1 = Remoto, 2 = PUC)

    const payload = {
      titulo: values.title,
      descricao: values.description,
      prazo: "2024-12-31", // Example deadline
      autor_id: 1, // Hardcoded for now
      interesses: selectedInterests.map(Number), // Convert interests to numbers
      location_id: locationId,
      department_id: department ? department.id : undefined,
      remuneracao: parseInt(values.remuneracao || "0", 10),
      horas_complementares: parseInt(values.horas_complementares || "0", 10),
      desconto: parseInt(values.desconto_mensalidade || "0", 10),
      tipo_id: tipo ? tipo.id : undefined, // or tipo?.value if backend expects value
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await apiFetch("http://localhost:8000/vagas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create vaga");
      }

      toast({
        title: "Oportunidade criada com sucesso!",
        description: "Sua oportunidade foi publicada e já está disponível.",
      });

      navigate("/opportunities");
    } catch (error) {
      console.error("Error creating vaga:", error);
      toast({
        title: "Erro ao criar oportunidade",
        description: "Não foi possível criar a oportunidade. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Monitoria em Algoritmos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.value} value={department.value}>
                      {department.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Remoto</SelectItem>
                  <SelectItem value="2">PUC</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Oportunidade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de oportunidade" />
                </SelectTrigger>
                <SelectContent>
                  {opportunityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <BenefitSelector 
          form={form}
          selectedBenefits={selectedBenefits}
          onBenefitChange={handleBenefitChange}
        />

        <InterestsSelector
          selectedInterests={selectedInterests}
          onInterestsChange={handleInterestsChange}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os detalhes da oportunidade, requisitos, responsabilidades..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/opportunities")}
          >
            Cancelar
          </Button>
          <Button type="submit">Publicar Oportunidade</Button>
        </div>
      </form>
    </Form>
  );
}
