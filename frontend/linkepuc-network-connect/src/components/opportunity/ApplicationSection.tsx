import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Send, X } from "lucide-react";
import { useCandidaturaStatus, useCandidatar, useCancelarCandidatura } from "@/hooks/use-candidaturas";
import { useAuth } from "@/AuthContext";

interface ApplicationSectionProps {
  vagaId: number;
  vagaTitulo: string;
}

export function ApplicationSection({ vagaId, vagaTitulo }: ApplicationSectionProps) {
  const { user } = useAuth();
  const [cartaMotivacao, setCartaMotivacao] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: candidaturaStatus, isLoading: loadingStatus, error: statusError } = useCandidaturaStatus(vagaId);
  const candidatarMutation = useCandidatar();
  const cancelarMutation = useCancelarCandidatura();

  // Only show for students
  if (!user?.is_student) {
    return null;
  }

  const handleCandidatar = () => {
    candidatarMutation.mutate(
      { vagaId, carta_motivacao: cartaMotivacao.trim() || undefined },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setCartaMotivacao("");
        },
      }
    );
  };

  const handleCancelar = () => {
    if (window.confirm("Tem certeza que deseja cancelar sua candidatura?")) {
      cancelarMutation.mutate(vagaId);
    }
  };

  if (loadingStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {candidaturaStatus?.has_applied ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              Candidatura Enviada
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Candidatar-se
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {candidaturaStatus?.has_applied ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ Você já se candidatou para esta oportunidade</p>
              <p className="text-green-600 text-sm mt-1">
                Sua candidatura foi enviada e está sendo analisada pelo professor.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleCancelar}
              disabled={cancelarMutation.isPending}
              className="w-full text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              {cancelarMutation.isPending ? "Cancelando..." : "Cancelar Candidatura"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Interessado nesta oportunidade? Candidate-se agora!
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Candidatar-se
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Candidatar-se para: {vagaTitulo}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="carta">Carta de Motivação (Opcional)</Label>
                    <Textarea
                      id="carta"
                      placeholder="Conte por que você tem interesse nesta oportunidade, suas experiências relevantes e o que espera aprender..."
                      value={cartaMotivacao}
                      onChange={(e) => setCartaMotivacao(e.target.value)}
                      className="min-h-32 mt-2"
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {cartaMotivacao.length}/2000 caracteres
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCandidatar}
                      disabled={candidatarMutation.isPending}
                      className="flex-1"
                    >
                      {candidatarMutation.isPending ? "Enviando..." : "Enviar Candidatura"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={candidatarMutation.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 