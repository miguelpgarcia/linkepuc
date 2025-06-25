import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, CheckCircle, AlertCircle, Info, GraduationCap, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { useCurriculumStatus } from "@/hooks/use-curriculum-status";
import { CurriculumViewer } from "@/components/curriculum/CurriculumViewer";
import { API_ENDPOINTS } from "@/config/api";

export default function ImportCurriculum() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: curriculumStatus, isLoading: statusLoading } = useCurriculumStatus();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiFetch(API_ENDPOINTS.HISTORICOS.UPLOAD, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Falha ao fazer upload do arquivo");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Histórico acadêmico importado com sucesso!",
        description: "Suas disciplinas foram processadas e agora você receberá recomendações personalizadas baseadas no seu perfil acadêmico.",
      });
      queryClient.invalidateQueries({ queryKey: ["curriculumStatus"] });
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao importar histórico acadêmico",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione apenas arquivos PDF.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Histórico Acadêmico</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Importe seu histórico escolar da PUC-Rio para receber recomendações de oportunidades 
              personalizadas baseadas nas disciplinas que você já cursou.
            </p>
          </div>

          {/* Status Card */}
          {!statusLoading && (
            <Card className={curriculumStatus?.has_curriculum ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {curriculumStatus?.has_curriculum ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Histórico acadêmico já importado
                          </p>
                          <p className="text-sm text-green-700">
                            Suas disciplinas estão sendo usadas para gerar recomendações personalizadas. 
                            Você pode atualizar com uma versão mais recente a qualquer momento.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Info className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">
                            Nenhum histórico acadêmico importado
                          </p>
                          <p className="text-sm text-blue-700">
                            Importe seu histórico escolar para receber oportunidades de monitoria, 
                            iniciação científica e projetos baseados no seu perfil acadêmico.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Show view button only when curriculum is imported */}
                  {curriculumStatus?.has_curriculum && (
                    <CurriculumViewer />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload do Histórico Escolar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="curriculum-file">Arquivo PDF do Histórico Escolar</Label>
                  <Input
                    id="curriculum-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploadMutation.isPending}
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo 10MB • Apenas arquivos PDF do histórico oficial da PUC-Rio
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-pulse" />
                      Processando histórico...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Histórico Acadêmico
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Como obter seu histórico escolar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Acesse o Portal do Aluno PUC-Rio</p>
                      <p className="text-sm text-muted-foreground">
                        Entre no Sistema Acadêmico Universitário (SAU) com seu login
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Baixe o Espelho do Histórico</p>
                      <p className="text-sm text-muted-foreground">
                        Vá em "Histórico Escolar" → "Espelho do Histórico" → "Gerar PDF"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Faça o Upload Aqui</p>
                      <p className="text-sm text-muted-foreground">
                        Selecione o arquivo PDF do histórico e clique em "Importar"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Importante
                      </p>
                      <p className="text-sm text-yellow-700">
                        Use apenas o histórico oficial da PUC-Rio. Certifique-se de que 
                        contém todas as disciplinas cursadas para melhores recomendações.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Por que importar seu histórico acadêmico?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Recomendações Inteligentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Oportunidades baseadas nas disciplinas que você cursou e seu desempenho
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Melhor Compatibilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Encontre monitorias e projetos que combinam com seu perfil acadêmico
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">Análise Automática</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema analisa automaticamente suas disciplinas e notas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What we analyze Card */}
          <Card>
            <CardHeader>
              <CardTitle>O que analisamos do seu histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Disciplinas Cursadas
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Matérias obrigatórias e optativas</li>
                    <li>• Áreas de conhecimento</li>
                    <li>• Pré-requisitos cumpridos</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Desempenho Acadêmico
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Notas e conceitos obtidos</li>
                    <li>• Coeficiente de rendimento</li>
                    <li>• Progresso no curso</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 