
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { MessageCircle, Book, GraduationCap, ExternalLink } from "lucide-react";
import { useCandidatos } from "@/hooks/use-candidaturas";
import { useNavigate } from "react-router-dom";

interface StudentCandidatesListProps {
  vagaId: number;
}

export function StudentCandidatesList({ vagaId }: StudentCandidatesListProps) {
  const { data: candidaturas, isLoading, error } = useCandidatos(vagaId);
  const navigate = useNavigate();

  const handleSendMessage = (candidatoId: number) => {
    navigate(`/professor/messages?userId=${candidatoId}`);
  };

  const handleViewProfile = (candidatoId: number) => {
    navigate(`/professor/profile/${candidatoId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Alunos Candidatos
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Alunos Candidatos
          </h3>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Erro ao carregar candidatos</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const candidates = candidaturas || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Alunos Candidatos ({candidates.length})
        </h3>
      </div>
      
      {candidates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum candidato ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Os candidatos aparecerão aqui quando se inscreverem para esta oportunidade.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidatura) => (
          <Card key={candidatura.id} className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar 
                    className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleViewProfile(candidatura.candidato.id)}
                    title="Clique para ver o perfil"
                  >
                    <AvatarImage src={candidatura.candidato.avatar || undefined} />
                    <AvatarFallback>
                      {candidatura.candidato.usuario
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                      onClick={() => handleViewProfile(candidatura.candidato.id)}
                      title="Clique para ver o perfil"
                    >
                      {candidatura.candidato.usuario}
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription>
                      {candidatura.candidato.email} • Candidatura em {new Date(candidatura.criado_em).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSendMessage(candidatura.candidato.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {candidatura.carta_motivacao ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="motivation">
                    <AccordionTrigger className="text-primary flex items-center gap-1.5 py-2">
                      <Book className="h-4 w-4" />
                      Carta de Motivação
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted/30 p-3 rounded-md text-sm italic">
                        "{candidatura.carta_motivacao}"
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  * Aluno não enviou carta de motivação
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
