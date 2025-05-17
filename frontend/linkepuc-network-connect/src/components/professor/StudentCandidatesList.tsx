
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
import { Check, X, Book, GraduationCap } from "lucide-react";
import { Candidate } from "@/types/professor";

interface StudentCandidatesListProps {
  candidates: Candidate[];
}

export function StudentCandidatesList({ candidates }: StudentCandidatesListProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Alunos Candidatos ({candidates.length})
        </h3>
      </div>
      
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.imageUrl} />
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>
                      {candidate.course} • Média: 
                      <span className={candidate.grade >= 8.0 ? "text-green-600 font-medium ml-1" : "ml-1"}>
                        {candidate.grade.toFixed(1)}
                        {candidate.grade >= 8.0 && " ✓"}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <X className="h-4 w-4 mr-1" />
                    Recusar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="text-sm text-muted-foreground mb-1">Interesses:</div>
                <div className="flex flex-wrap gap-1">
                  {candidate.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="bg-muted">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {candidate.hasMotivationLetter ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="motivation">
                    <AccordionTrigger className="text-primary flex items-center gap-1.5 py-2">
                      <Book className="h-4 w-4" />
                      Carta de Motivação
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-muted/30 p-3 rounded-md text-sm italic">
                        "{candidate.motivationLetter}"
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
    </div>
  );
}
