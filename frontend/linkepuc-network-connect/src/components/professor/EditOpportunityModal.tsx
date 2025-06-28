import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InterestsSelector } from "@/components/opportunity/InterestsSelector";

interface EditOpportunityModalProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    interests: string[];
  };
}

interface FormData {
  titulo: string;
  descricao: string;
  interesses: string[];
}

export function EditOpportunityModal({ opportunity }: EditOpportunityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      titulo: opportunity.title,
      descricao: opportunity.description,
      interesses: [],
    },
  });

  // Initialize form when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset({
        titulo: opportunity.title,
        descricao: opportunity.description,
        interesses: [], // Will be set by InterestsSelector based on opportunity.interests
      });
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: { titulo: string; descricao: string; prazo: string; interesses: number[] }) => {
      const response = await apiFetch(API_ENDPOINTS.VAGAS.BY_ID(opportunity.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update opportunity");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Oportunidade atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["professorOpportunity", opportunity.id] });
      queryClient.invalidateQueries({ queryKey: ["professorOpportunities"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!data.titulo.trim() || !data.descricao.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      titulo: data.titulo,
      descricao: data.descricao,
      prazo: "2024-12-31", // Keep existing deadline for now
      interesses: data.interesses.map(Number), // Convert strings to numbers
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Oportunidade
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Oportunidade</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Monitoria de Cálculo I"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva detalhadamente a oportunidade..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interesses Relacionados</FormLabel>
                  <FormControl>
                    <InterestsSelector
                      selectedInterests={field.value}
                      onInterestsChange={field.onChange}
                      existingInterests={opportunity.interests}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-pulse" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={updateMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 