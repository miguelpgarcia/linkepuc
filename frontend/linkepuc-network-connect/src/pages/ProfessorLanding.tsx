import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Share, Eye, GraduationCap, CheckCircle, Clock, ExternalLink, Mail, FileUp } from "lucide-react";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { useAuth } from "@/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

const professorSteps = [
  {
    icon: <UserPlus className="h-12 w-12 text-primary" />,
    title: "Faça seu cadastro",
    description: "Cadastre-se em poucos minutos e fortaleça sua atuação acadêmica com novas conexões e oportunidades.",
    link: "/professor/register"
  },
  {
    icon: <Share className="h-12 w-12 text-primary" />,
    title: "Compartilhe oportunidades",
    description: "Divulgue projetos, orientações, vagas de pesquisa ou extensão. Incentive o protagonismo estudantil e fortaleça a troca de saberes.",
    link: "/professor/opportunities/new"
  },
  {
    icon: <Eye className="h-12 w-12 text-primary" />,
    title: "Acompanhe e amplie o impacto",
    description: "Monitore o interesse dos alunos e divulgue suas iniciativas para toda a comunidade PUC-RJ.",
    link: "/professor/opportunities"
  }
];

const completedProfessorFeatures = [
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Gestão de Oportunidades",
    description: "Crie e gerencie suas vagas de monitoria, pesquisa e projetos",
    link: "/professor/opportunities",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Análise de Candidatos",
    description: "Visualize e avalie candidatos para suas oportunidades",
    link: "/professor/opportunities",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Sistema de Comunicação",
    description: "Comunique-se diretamente com alunos interessados",
    link: "/professor/messages",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Métricas Básicas",
    description: "Acompanhe visualizações e candidaturas em suas oportunidades",
    link: "/professor/opportunities",
    isCompleted: true
  }
];

const upcomingProfessorFeatures = [
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Gráficos de Visualização Avançados",
    description: "Dashboards completos com análises detalhadas de desempenho",
    isCompleted: false
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Exportação de Candidatos",
    description: "Exporte dados de candidatos em formatos CSV e PDF",
    isCompleted: false
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Sistema de Publicações",
    description: "Compartilhe pesquisas, artigos e atualizações acadêmicas",
    isCompleted: false
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Rede de Conexões",
    description: "Sistema de networking para colaborações acadêmicas",
    isCompleted: false
  }
];

interface UserProfile {
  id: number;
  usuario: string;
  email: string;
  ehaluno: boolean;
}

// Component for logged-out professors (current design)
function LoggedOutProfessorLanding() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-white to-secondary/20">
        <div className="container mx-auto pt-12">
          {/* Professor Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="mb-4 p-3 bg-primary/10 inline-block rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Ensinar também é abrir caminhos
            </h1>
            <p className="text-xl text-primary/90 mb-2">
              Crie oportunidades para toda a comunidade PUC
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Suas iniciativas já fazem a diferença. Com o LinkePUC, você pode alcançar alunos engajados de diferentes cursos, contribuir para seu desenvolvimento e ampliar o impacto do seu trabalho na universidade e na sociedade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/professor/login">
                  Entrar como professor
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/professor/register">
                  Cadastrar-se
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Professor Steps */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Como funciona para professores</h2>
              <p className="text-muted-foreground">Três passos simples para ampliar seu impacto acadêmico</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {professorSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative bg-white p-6 rounded-lg shadow-sm border border-muted hover:border-primary/20 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-primary/10 rounded-full">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <Button asChild variant="outline">
                      <Link to={step.link}>
                        Saiba mais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  {index < professorSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for logged-in professors
function LoggedInProfessorLanding({ userData }: { userData: UserProfile }) {
  return (
    <div className="min-h-screen">
      <ProfessorHeader />
      <div className="bg-gradient-to-b from-white to-secondary/20">
        <div className="container mx-auto pt-8">
          {/* Welcome Section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Bem-vindo, Prof. {userData.usuario}! 🎓
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Você está no espaço do professor do LinkePuc - Transforme oportunidades em conexões
            </p>
            <Badge variant="outline" className="mb-6 text-lg px-4 py-2">
              📢 Esta é uma versão MVP - Ferramentas avançadas de gestão estão chegando!
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Criar Oportunidade</h3>
                <p className="text-muted-foreground mb-4">Publique uma nova vaga ou projeto</p>
                <Button asChild className="w-full">
                  <Link to="/professor/opportunities/new">Criar Agora</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Minhas Oportunidades</h3>
                <p className="text-muted-foreground mb-4">Gerencie suas vagas e candidatos</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/professor/opportunities">Ver Oportunidades</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mensagens</h3>
                <p className="text-muted-foreground mb-4">Converse com candidatos interessados</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/professor/messages">Ver Mensagens</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Completed Features */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">✅ Funcionalidades Disponíveis</h2>
              <p className="text-muted-foreground">Ferramentas que você já pode usar para gestão acadêmica</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {completedProfessorFeatures.map((feature, index) => (
                <Card key={index} className="border border-green-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {feature.title}
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Ativo</Badge>
                        </h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                          <Link to={feature.link}>
                            Usar Agora
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Features */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">🚀 Próximas Funcionalidades</h2>
              <p className="text-muted-foreground">Ferramentas avançadas que estão sendo desenvolvidas</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingProfessorFeatures.map((feature, index) => (
                <Card key={index} className="border border-orange-200 hover:border-orange-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {feature.title}
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Em Breve</Badge>
                        </h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="py-12 border-t">
            <Card className="border border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <ExternalLink className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Explore o Protótipo Completo
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Veja todas as funcionalidades planejadas para professores e contribua com sugestões
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2">
                      <a href="https://lovable.dev/projects/fffc40c4-e496-42f2-bffc-78111dc01020" target="_blank" rel="noopener noreferrer">
                        Ver Protótipo Completo
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2">
                      <a href="mailto:support-linkepuc@gmail.com">
                        <Mail className="h-4 w-4" />
                        Suporte
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessorLanding() {
  const { user } = useAuth();

  // Fetch user profile data if logged in
  const { data: userData } = useQuery<UserProfile>({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(API_ENDPOINTS.USERS.BY_ID(user.id));
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id && !user.is_student, // Only fetch if user is a professor
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Show different components based on authentication status
  if (!user || user.is_student) {
    return <LoggedOutProfessorLanding />;
  }

  if (!userData) {
    // Loading state while fetching user data
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show logged-in professor landing page
  return <LoggedInProfessorLanding userData={userData} />;
}
