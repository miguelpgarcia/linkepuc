
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Requirement {
  id: string;
  description: string;
  isMet: boolean;
  details?: string;
  optional?: boolean;
}

interface OpportunityRequirementsProps {
  requirements: Requirement[];
}

export function OpportunityRequirements({ requirements }: OpportunityRequirementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Requisitos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {requirements.map((req) => (
            <li key={req.id} className="flex items-start gap-3">
              <Badge
                variant="outline"
                className={
                  req.isMet
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : req.optional
                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                }
              >
                {req.isMet ? "✓" : req.optional ? "?" : "!"}
              </Badge>
              <div>
                <p className="font-medium">
                  {req.description}
                  {req.optional && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (Opcional)
                    </span>
                  )}
                </p>
                {req.details && (
                  <p className="text-sm text-muted-foreground">{req.details}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
