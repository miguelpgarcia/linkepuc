
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Briefcase, Award, Users, Microscope } from "lucide-react";

const opportunityTypes = [
  {
    title: "Monitoria",
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    description: "Desenvolva habilidades de ensino e aprofunde seu conhecimento acadêmico ajudando outros alunos. Ideal para quem deseja seguir carreira acadêmica.",
    link: "/opportunities?type=monitoria"
  },
  {
    title: "Iniciação Científica",
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    description: "Explore o mundo da pesquisa acadêmica, desenvolva projetos inovadores e contribua para o avanço do conhecimento científico.",
    link: "/opportunities?type=iniciacao_cientifica"
  },
  {
    title: "Estágio",
    icon: <Briefcase className="h-12 w-12 text-primary" />,
    description: "Ganhe experiência prática no mercado de trabalho enquanto aplica os conhecimentos adquiridos na universidade.",
    link: "/opportunities?type=estagio"
  },
  {
    title: "Bolsa",
    icon: <Award className="h-12 w-12 text-primary" />,
    description: "Receba apoio financeiro para desenvolver projetos acadêmicos e de pesquisa, permitindo dedicação integral aos estudos.",
    link: "/opportunities?type=bolsa"
  },
  {
    title: "Empresa Júnior",
    icon: <Users className="h-12 w-12 text-primary" />,
    description: "Desenvolva habilidades empreendedoras e de gestão em projetos reais, preparando-se para o mercado de trabalho.",
    link: "/opportunities?type=empresa_jr"
  },
  {
    title: "Laboratório",
    icon: <Microscope className="h-12 w-12 text-primary" />,
    description: "Participe de pesquisas práticas e experimentos em laboratórios especializados, aplicando teoria na prática.",
    link: "/opportunities?type=laboratorio"
  }
];

export default function LinkePuc() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Oportunidades Acadêmicas
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore diferentes caminhos para enriquecer sua jornada acadêmica na PUC-Rio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunityTypes.map((type) => (
            <Link 
              key={type.title} 
              to={type.link}
              className="block no-underline"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4 flex justify-center">
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-primary">
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>{type.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
