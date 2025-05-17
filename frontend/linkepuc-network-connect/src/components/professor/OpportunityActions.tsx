
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, CheckCircle, Book } from "lucide-react";

export function OpportunityActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full flex justify-start" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Exportar lista de alunos
        </Button>
        
        <Button className="w-full flex justify-start" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Enviar comunicado aos alunos
        </Button>
        
        <Button className="w-full flex justify-start" variant="outline">
          <CheckCircle className="h-4 w-4 mr-2" />
          Finalizar seleção
        </Button>
        
        <Button className="w-full flex justify-start" variant="outline">
          <Book className="h-4 w-4 mr-2" />
          Histórico acadêmico da vaga
        </Button>
      </CardContent>
    </Card>
  );
}
