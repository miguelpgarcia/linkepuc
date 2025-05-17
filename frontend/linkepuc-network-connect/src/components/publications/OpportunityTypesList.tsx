
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Briefcase, Award, Users, Microscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface OpportunityType {
  title: string;
  icon: JSX.Element;
  description: string;
  link: string;
}

const opportunityTypes: OpportunityType[] = [
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

export function OpportunityTypesList() {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Tipos de Oportunidades</h2>
        <p className="text-muted-foreground">Explore as diferentes oportunidades disponíveis na PUC</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunityTypes.map((type) => (
          <Link key={type.title} to={type.link}>
            <Card className="h-full hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  {type.icon}
                </div>
                <CardTitle>{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{type.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
