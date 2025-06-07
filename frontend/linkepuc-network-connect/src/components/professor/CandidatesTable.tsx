
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Check, X } from "lucide-react";
import { Candidate } from "@/types/professor";

interface CandidatesTableProps {
  candidates: Candidate[];
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Candidatos ({candidates.length})</h3>
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Média</TableHead>
              <TableHead>Interesses</TableHead>
              <TableHead>Motivação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={candidate.imageUrl} />
                      <AvatarFallback>
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                </TableCell>
                <TableCell>{candidate.course}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={candidate.grade >= 8.0 ? "text-green-600 font-medium" : ""}>
                      {candidate.grade.toFixed(1)}
                    </span>
                    {candidate.grade >= 8.0 && (
                      <Check className="h-4 w-4 ml-1 text-green-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {candidate.interests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="bg-muted">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {candidate.hasMotivationLetter ? (
                    <Button variant="ghost" size="sm">
                      👁️ Ver
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">Não enviada</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="icon" className="text-green-600">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
