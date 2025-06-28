import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, TrendingUp, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const STORAGE_KEY = "curriculum-prompt-dismissed";

export function CurriculumPrompt() {
  const [isVisible, setIsVisible] = useState(true);

  // Check if user has previously dismissed this prompt
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  // Don't render if dismissed
  if (!isVisible) {
    return null;
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            Melhores Oportunidades Personalizadas
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
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
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link to="/import-curriculum">
              <FileText className="h-4 w-4 mr-2" />
              Importar Currículo Acadêmico
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1 sm:flex-initial">
            <Link to="/import-curriculum">
              Saiba mais
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            Não mostrar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 