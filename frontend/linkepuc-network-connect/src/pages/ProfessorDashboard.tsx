
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, FileText, User, Eye, Plus } from "lucide-react";

export default function ProfessorDashboard() {
  // Sample data for dashboard
  const stats = {
    opportunities: 5,
    activeOpportunities: 3,
    totalCandidates: 24,
    pendingReviews: 12
  };

  const recentOpportunities = [
    { id: "1", title: "Monitoria de Álgebra", candidates: 12 },
    { id: "2", title: "IC em Redes Neurais", candidates: 8 },
    { id: "3", title: "Estágio em Laboratório de Computação", candidates: 5 }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <ProfessorHeader />
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard do Professor</h1>
            <p className="text-muted-foreground">
              Bem-vindo(a)! Aqui está um resumo das suas atividades
            </p>
          </div>
          <Button asChild>
            <Link to="/professor/opportunities/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Oportunidade
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total de oportunidades</p>
                  <h3 className="text-3xl font-bold">{stats.opportunities}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Oportunidades ativas</p>
                  <h3 className="text-3xl font-bold">{stats.activeOpportunities}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total de candidatos</p>
                  <h3 className="text-3xl font-bold">{stats.totalCandidates}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Candidaturas pendentes</p>
                  <h3 className="text-3xl font-bold">{stats.pendingReviews}</h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Eye className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Opportunities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Oportunidades recentes</CardTitle>
            <CardDescription>
              Suas oportunidades mais recentes e o número de candidatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities.map(opportunity => (
                <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.candidates} candidatos
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/professor/opportunities/${opportunity.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link to="/professor/opportunities">
                  Ver todas as oportunidades
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
