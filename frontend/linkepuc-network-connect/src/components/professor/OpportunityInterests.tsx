
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface OpportunityInterestsProps {
  interests: string[];
}

export function OpportunityInterests({ interests }: OpportunityInterestsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Áreas de Interesse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <Badge 
              key={index} 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 text-sm"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
