import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, RotateCcw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { useToast } from "@/hooks/use-toast";

interface OpportunityActionsProps {
  opportunityId: string;
  currentStatus: string;
}

export function OpportunityActions({ opportunityId, currentStatus }: OpportunityActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation to update opportunity status
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await apiFetch(`http://localhost:8000/vagas/${opportunityId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professorOpportunity", opportunityId] });
      queryClient.invalidateQueries({ queryKey: ["professorOpportunities"] });
      toast({
        title: "Status atualizado",
        description: "O status da oportunidade foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    // TODO: Implementar funcionalidade de enviar comunicado
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A funcionalidade de enviar comunicado será implementada em breve.",
    });
  };

  const handleStatusChange = () => {
    if (currentStatus === 'em_andamento') {
      updateStatusMutation.mutate('finalizada');
    } else if (currentStatus === 'encerrada' || currentStatus === 'finalizada') {
      updateStatusMutation.mutate('em_andamento');
    }
  };

  // Determine button text and icon based on current status
  const getStatusButtonConfig = () => {
    if (currentStatus === 'em_andamento') {
      return {
        text: "Finalizar seleção",
        icon: CheckCircle,
        variant: "default" as const
      };
    } else if (currentStatus === 'encerrada' || currentStatus === 'finalizada') {
      return {
        text: "Reativar Vaga",
        icon: RotateCcw,
        variant: "outline" as const
      };
    }
    return null;
  };

  const statusButtonConfig = getStatusButtonConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full flex justify-start" 
          variant="outline"
          onClick={handleSendMessage}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Enviar comunicado aos candidatos
        </Button>
        
        {statusButtonConfig && (
          <Button 
            className="w-full flex justify-start" 
            variant={statusButtonConfig.variant}
            onClick={handleStatusChange}
            disabled={updateStatusMutation.isPending}
          >
            {currentStatus === 'em_andamento' ? (
              <CheckCircle className="h-4 w-4 mr-2" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            {updateStatusMutation.isPending ? "Atualizando..." : statusButtonConfig.text}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
