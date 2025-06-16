import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface OpportunityLinkProps {
  link: string;
}

export function OpportunityLink({ link }: OpportunityLinkProps) {
  if (!link) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link da Oportunidade</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full" size="lg" asChild>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Me candidatar
          </a>
        </Button>
      </CardContent>
    </Card>
  );
} 