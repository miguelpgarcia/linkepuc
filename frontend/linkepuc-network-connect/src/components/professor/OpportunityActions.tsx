import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, CheckCircle, RotateCcw, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { useToast } from "@/hooks/use-toast";
import { useCandidatos } from "@/hooks/use-candidaturas";
import { useState } from "react";

interface OpportunityActionsProps {
  opportunityId: string;
  currentStatus: string;
}

export function OpportunityActions({ opportunityId, currentStatus }: OpportunityActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comunicado, setComunicado] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: candidaturas } = useCandidatos(parseInt(opportunityId));

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

  // Mutation to send message to all candidates
  const sendCommunicationMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!candidaturas || candidaturas.length === 0) {
        throw new Error('Nenhum candidato encontrado');
      }

      // Send message to each candidate
      const promises = candidaturas.map(candidatura => 
        apiFetch('http://localhost:8000/mensagens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinatario_id: candidatura.candidato.id,
            conteudo: message,
          }),
        })
      );

      const responses = await Promise.all(promises);
      const failedRequests = responses.filter(response => !response.ok);
      
      if (failedRequests.length > 0) {
        throw new Error(`Falha ao enviar ${failedRequests.length} mensagens`);
      }
      
      return responses;
    },
    onSuccess: () => {
      toast({
        title: "Comunicado enviado!",
        description: `Mensagem enviada para ${candidaturas?.length || 0} candidatos.`,
      });
      setComunicado("");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar comunicado",
        description: error.message || "Não foi possível enviar o comunicado. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendCommunication = () => {
    if (comunicado.trim()) {
      sendCommunicationMutation.mutate(comunicado.trim());
    }
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full flex justify-start" 
              variant="outline"
              disabled={!candidaturas || candidaturas.length === 0}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar comunicado aos candidatos {candidaturas && candidaturas.length > 0 && `(${candidaturas.length})`}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar Comunicado aos Candidatos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="comunicado">Mensagem</Label>
                <Textarea
                  id="comunicado"
                  placeholder="Digite sua mensagem para todos os candidatos..."
                  value={comunicado}
                  onChange={(e) => setComunicado(e.target.value)}
                  className="min-h-32 mt-2"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {comunicado.length}/1000 caracteres • Será enviado para {candidaturas?.length || 0} candidatos
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSendCommunication}
                  disabled={sendCommunicationMutation.isPending || !comunicado.trim()}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendCommunicationMutation.isPending ? "Enviando..." : "Enviar Comunicado"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={sendCommunicationMutation.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
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
