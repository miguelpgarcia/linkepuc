
import { Header } from "@/components/layout/Header";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/post/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, GraduationCap, Users } from "lucide-react";

// Sample data (in a real app, this would come from your backend)
const profileData = {
  id: "401",
  name: "João Paulo",
  role: "Estudante",
  department: "Departamento de Ciência da Computação",
  avatar: "https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
  backgroundImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  bio: "Estudante de Ciência da Computação na PUC-Rio, com interesse em desenvolvimento web, inteligência artificial e computação gráfica. Atualmente participo do laboratório de IA e estou em busca de oportunidades de pesquisa em aprendizado de máquina.",
  interests: [
    "Inteligência Artificial", 
    "Desenvolvimento Web", 
    "Computação Gráfica", 
    "Algoritmos", 
    "Ciência de Dados"
  ],
  isOwnProfile: true,
};

const posts = [
  {
    id: "501",
    author: {
      id: "401",
      name: "João Paulo",
      role: "Estudante, Ciência da Computação",
      avatar: "https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    },
    timeAgo: "2d",
    content: "Acabo de finalizar meu projeto de iniciação científica sobre redes neurais aplicadas ao processamento de linguagem natural. Agradeço ao Prof. André pelo apoio e orientação durante esse período!",
    likes: 18,
    comments: 3,
  },
  {
    id: "502",
    author: {
      id: "401",
      name: "João Paulo",
      role: "Estudante, Ciência da Computação",
      avatar: "https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    },
    timeAgo: "1w",
    content: "Alguém aqui já cursou a disciplina de Aprendizado Profundo? Estou pensando em me matricular no próximo semestre e gostaria de algumas recomendações.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    likes: 5,
    comments: 10,
  },
];

const education = [
  {
    id: "601",
    institution: "PUC-Rio",
    degree: "Bacharelado em Ciência da Computação",
    dateRange: "2021 - Presente",
    description: "Foco em Inteligência Artificial e Desenvolvimento Web.",
  },
  {
    id: "602",
    institution: "Colégio São Bento",
    degree: "Ensino Médio",
    dateRange: "2018 - 2020",
    description: "Participação em olimpíadas de matemática e informática.",
  },
];

const experience = [
  {
    id: "701",
    role: "Pesquisador de Iniciação Científica",
    organization: "Laboratório de IA - PUC-Rio",
    dateRange: "Mar 2022 - Presente",
    description: "Pesquisa em processamento de linguagem natural e aprendizado de máquina aplicado a textos em português.",
  },
  {
    id: "702",
    role: "Monitor",
    organization: "Departamento de Informática - PUC-Rio",
    dateRange: "Ago 2021 - Dez 2021",
    description: "Monitoria na disciplina de Introdução à Programação, auxiliando alunos com exercícios e projetos em Python.",
  },
];

const connections = [
  {
    id: "801",
    name: "Maria Fernanda",
    role: "Estudante, Engenharia de Computação",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "802",
    name: "Pedro Alves",
    role: "Professor, Departamento de Matemática",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "803",
    name: "Ana Clara",
    role: "Estudante, Design",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "804",
    name: "Lucas Mendes",
    role: "Estudante, Ciência da Computação",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
  },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        <ProfileHeader {...profileData} />
        
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
            <TabsTrigger value="posts">Publicações</TabsTrigger>
            <TabsTrigger value="education">Formação</TabsTrigger>
            <TabsTrigger value="experience">Experiência</TabsTrigger>
            <TabsTrigger value="connections">Conexões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2" />
                  Formação Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-lg">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground mb-2">{edu.dateRange}</p>
                      <p className="text-sm">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2" />
                  Experiência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-lg">{exp.role}</h3>
                      <p className="text-primary font-medium">{exp.organization}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exp.dateRange}</p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" />
                  Conexões ({connections.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage src={connection.avatar} />
                          <AvatarFallback>
                            {connection.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-medium">{connection.name}</h3>
                        <p className="text-sm text-muted-foreground">{connection.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
