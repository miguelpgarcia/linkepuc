
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Opportunity {
  id: string;
  title: string;
  department: string;
}

const opportunities: Opportunity[] = [
  {
    id: "1",
    title: "Monitoria em Algoritmos e Estruturas de Dados",
    department: "Departamento de Informática"
  },
  {
    id: "2",
    title: "Iniciação Científica em Inteligência Artificial",
    department: "Laboratório de IA"
  }
];

export function RecentOpportunities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Oportunidades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opp) => (
          <div key={opp.id} className="border-b pb-3 last:border-b-0">
            <Link to={`/opportunities/${opp.id}`} className="font-medium hover:underline">
              {opp.title}
            </Link>
            <p className="text-sm text-muted-foreground">{opp.department}</p>
          </div>
        ))}
        <Button asChild variant="outline" className="w-full">
          <Link to="/opportunities">Ver Todas</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
