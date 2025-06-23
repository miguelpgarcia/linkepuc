import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function CurriculumPrompt() {
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Melhores Oportunidades Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Importe seu Currículo Acadêmico
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Faça upload do seu histórico escolar e receba recomendações de oportunidades 
              baseadas no seu desempenho acadêmico e disciplinas cursadas.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Oportunidades mais relevantes</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Recomendações personalizadas</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link to="/import-curriculum">
              <FileText className="h-4 w-4 mr-2" />
              Importar Currículo Acadêmico
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/import-curriculum">
              Saiba mais
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 