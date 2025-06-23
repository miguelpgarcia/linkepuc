import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, GraduationCap, BookOpen, Calendar, Award } from "lucide-react";
import { useCurriculumData } from "@/hooks/use-curriculum-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CurriculumViewerProps {
  disabled?: boolean;
}

export function CurriculumViewer({ disabled = false }: CurriculumViewerProps) {
  const [open, setOpen] = useState(false);
  const { data: curriculumData, isLoading, error } = useCurriculumData();

  const getStatusColor = (situacao: string) => {
    switch (situacao?.toLowerCase()) {
      case 'aprovado':
      case 'ap':
        return 'bg-green-100 text-green-800';
      case 'reprovado':
      case 'rp':
        return 'bg-red-100 text-red-800';
      case 'cursando':
      case 'cr':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grau: number | null) => {
    if (!grau) return 'text-gray-500';
    if (grau >= 7) return 'text-green-600 font-semibold';
    if (grau >= 5) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  // Group by periods and calculate statistics
  const groupedData = curriculumData?.reduce((acc, entry) => {
    if (!acc[entry.periodo]) {
      acc[entry.periodo] = [];
    }
    acc[entry.periodo].push(entry);
    return acc;
  }, {} as Record<string, typeof curriculumData>) || {};

  const totalCredits = curriculumData?.reduce((sum, entry) => sum + (entry.n_creditos || 0), 0) || 0;
  const averageGrade = curriculumData?.length 
    ? curriculumData.reduce((sum, entry) => sum + (entry.grau || 0), 0) / curriculumData.filter(entry => entry.grau).length
    : 0;
  const approvedSubjects = curriculumData?.filter(entry => 
    entry.situacao?.toLowerCase() === 'aprovado' || entry.situacao?.toLowerCase() === 'ap'
  ).length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className="gap-2">
          <Eye className="h-4 w-4" />
          Visualizar Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Meu Histórico Acadêmico
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando histórico...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            Erro ao carregar histórico acadêmico
          </div>
        )}

        {curriculumData && curriculumData.length > 0 && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Disciplinas</p>
                      <p className="text-2xl font-bold">{curriculumData.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Créditos Totais</p>
                      <p className="text-2xl font-bold">{totalCredits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Média Geral</p>
                      <p className="text-2xl font-bold">{averageGrade.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subjects Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Disciplinas por Período
              </h3>
              
              <ScrollArea className="h-[400px] border rounded-lg">
                <div className="space-y-6 p-4">
                  {Object.entries(groupedData)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([periodo, subjects]) => (
                    <div key={periodo} className="space-y-2">
                      <h4 className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-md">
                        Período: {periodo}
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Disciplina</TableHead>
                            <TableHead>Turma</TableHead>
                            <TableHead>Grau</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Créditos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subjects.map((subject) => (
                            <TableRow key={subject.id}>
                              <TableCell className="font-mono text-sm">
                                {subject.codigo_disciplina}
                              </TableCell>
                              <TableCell className="font-medium">
                                {subject.nome_disciplina}
                              </TableCell>
                              <TableCell>{subject.turma}</TableCell>
                              <TableCell className={getGradeColor(subject.grau)}>
                                {subject.grau?.toFixed(1) || '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={getStatusColor(subject.situacao)}
                                >
                                  {subject.situacao}
                                </Badge>
                              </TableCell>
                              <TableCell>{subject.n_creditos}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {curriculumData && curriculumData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado de histórico encontrado
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 