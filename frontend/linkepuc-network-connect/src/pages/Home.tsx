
import { Link } from "react-router-dom";
import { OpportunityCarousel } from "@/components/opportunity/OpportunityCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, UserPlus, GraduationCap, Share, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";

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
    link: "/publicacoes"
  },
  {
    icon: <ArrowRight className="h-12 w-12 text-primary" />,
    title: "Receba oportunidades personalizadas",
    description: "Encontre vagas de monitoria, iniciação científica, laboratórios e muito mais.",
    link: "/opportunities"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
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
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Comece Agora
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
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
          
          {/* Professor CTA Section */}
          <div className="py-12 border-t">
            <Card className="border border-primary/20 bg-gradient-to-r from-secondary/80 to-secondary/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <div className="mb-2 p-3 bg-primary/10 inline-block rounded-full">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      Docente da PUC? Ajude a formar trajetórias.
                    </h2>
                    <p className="text-muted-foreground">
                      Publique monitorias, projetos ou iniciações.
                    </p>
                  </div>
                  <Button asChild size="lg" className="gap-2 whitespace-nowrap">
                    <Link to="/professor">
                      Acesse o espaço do professor
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
