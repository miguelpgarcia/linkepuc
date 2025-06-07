
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface OpportunityDescriptionProps {
  description: string;
}

export function OpportunityDescription({ description }: OpportunityDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Descrição da Oportunidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {description.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
