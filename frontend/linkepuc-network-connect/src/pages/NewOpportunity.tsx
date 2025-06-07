
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus } from "lucide-react";
import { OpportunityForm } from "@/components/opportunity/OpportunityForm";

export default function NewOpportunity() {
  return (
    <div className="min-h-screen bg-muted/20">
      <ProfessorHeader />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FilePlus className="h-6 w-6" />
            Nova Oportunidade
          </h1>
          <p className="text-muted-foreground">
            Preencha os detalhes da oportunidade que você quer publicar
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Detalhes da Oportunidade</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunityForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
