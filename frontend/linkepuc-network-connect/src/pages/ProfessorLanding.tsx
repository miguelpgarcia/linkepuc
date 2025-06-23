
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Share, Eye, GraduationCap } from "lucide-react";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { useAuth } from "@/AuthContext";

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

export default function ProfessorLanding() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen">
      {user && !user.isStudent && <ProfessorHeader />}
      <div className="bg-gradient-to-b from-white to-secondary/20">
        <div className={`container mx-auto ${user && !user.isStudent ? 'pt-6' : 'pt-12'}`}>
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
