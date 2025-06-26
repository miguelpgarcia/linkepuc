import { Link } from "react-router-dom";
import { OpportunityCarousel } from "@/components/opportunity/OpportunityCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, UserPlus, GraduationCap, Share, Eye, CheckCircle, Clock, ExternalLink, Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

const studentSteps = [
  {
    icon: <UserPlus className="h-12 w-12 text-primary" />,
    title: "Cadastre-se",
    description: "Crie sua conta em poucos minutos e comece sua jornada acadêmica.",
    link: "/register"
  },
  {
    icon: <FileUp className="h-12 w-12 text-primary" />,
    title: "Importe seu currículo",
    description: "Envie seu currículo acadêmico para personalizar sua experiência.",
    link: "/import-curriculum"
  },
  {
    icon: <ArrowRight className="h-12 w-12 text-primary" />,
    title: "Receba oportunidades personalizadas",
    description: "Encontre vagas de monitoria, iniciação científica, laboratórios e muito mais.",
    link: "/opportunities"
  }
];

const completedStudentFeatures = [
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Sistema de Recomendações",
    description: "Algoritmo inteligente que sugere oportunidades baseado no seu perfil",
    link: "/opportunities",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Gestão de Candidaturas",
    description: "Acompanhe suas aplicações e status de candidaturas",
    link: "/opportunities",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Sistema de Mensagens",
    description: "Comunicação direta com professores e outros alunos",
    link: "/messages",
    isCompleted: true
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-green-600" />,
    title: "Perfil Personalizado",
    description: "Gerencie seus interesses e informações acadêmicas",
    link: "/profile",
    isCompleted: true
  }
];

const upcomingStudentFeatures = [
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Criação e Compartilhamento de Publicações",
    description: "Compartilhe projetos, experiências e conquistas com a comunidade",
    isCompleted: false
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Conexões com Alunos e Professores",
    description: "Rede social acadêmica para expandir sua network universitária",
    isCompleted: false
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Novos Algoritmos de Recomendação",
    description: "IA avançada para recomendações ainda mais precisas e personalizadas",
    isCompleted: false
  }
];



interface UserProfile {
  id: number;
  usuario: string;
  email: string;
  ehaluno: boolean;
}

// Component for logged-out users (current design)
function LoggedOutHome() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto pt-8">
          {/* Student Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Descubra todas as oportunidades que a PUC pode oferecer
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Conectamos alunos a oportunidades acadêmicas únicas para impulsionar sua carreira universitária
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center sm:items-start">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Comece Agora
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
              <div className="flex flex-col items-center gap-1">
                <Button asChild variant="outline" size="lg" className="gap-2 border-green-500 text-green-600 hover:bg-green-50">
                  <Link to="/professor">
                    <GraduationCap className="h-5 w-5" />
                    Docente da PUC?
                  </Link>
                </Button>
                <span className="text-xs text-green-600/70">Acesse espaço do professor</span>
              </div>
            </div>
          </div>
          
          <OpportunityCarousel />
          
          {/* Student Steps */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Como funciona</h2>
              <p className="text-muted-foreground">Três passos simples para começar sua jornada</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {studentSteps.map((step, index) => (
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
                  {index < studentSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Professor CTA Section - Smaller version */}
          <div className="py-8 border-t">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Docente da PUC? Publique oportunidades e ajude a formar trajetórias acadêmicas.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/professor">
                  <GraduationCap className="h-4 w-4" />
                  Acesse o espaço do professor
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for logged-in students
function LoggedInStudentHome({ userData }: { userData: UserProfile }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto pt-8">
          {/* Welcome Section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Bem-vindo, {userData.usuario}! 👋
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Você está conectado ao LinkePuc - Sua plataforma de oportunidades acadêmicas
            </p>
            <Badge variant="outline" className="mb-6 text-lg px-4 py-2">
              📢 Esta é uma versão MVP - Muitas funcionalidades incríveis estão chegando!
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ver Oportunidades</h3>
                <p className="text-muted-foreground mb-4">Explore vagas personalizadas para você</p>
                <Button asChild className="w-full">
                  <Link to="/opportunities">Explorar Agora</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Atualizar Perfil</h3>
                <p className="text-muted-foreground mb-4">Mantenha seu perfil sempre atualizado</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile">Ir para Perfil</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit mx-auto">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mensagens</h3>
                <p className="text-muted-foreground mb-4">Converse com professores e colegas</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/messages">Ver Mensagens</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Completed Features */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">✅ Funcionalidades Disponíveis</h2>
              <p className="text-muted-foreground">Recursos que você já pode usar agora mesmo</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {completedStudentFeatures.map((feature, index) => (
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
              <p className="text-muted-foreground">O que está por vir no LinkePuc</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingStudentFeatures.map((feature, index) => (
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
                    Veja todas as funcionalidades planejadas e dê seu feedback
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



export default function Home() {
  const { user } = useAuth();

  // Fetch user profile data if logged in as student
  const { data: userData } = useQuery<UserProfile>({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(API_ENDPOINTS.USERS.BY_ID(user.id));
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id && user.is_student, // Only fetch for students
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Show different components based on authentication status
  if (!user) {
    return <LoggedOutHome />;
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

  // Show student home only (professors should go to /professor)
  if (userData.ehaluno) {
    return <LoggedInStudentHome userData={userData} />;
  } else {
    // Professors should be redirected to /professor, not /
    window.location.href = "/professor";
    return null;
  }
}
