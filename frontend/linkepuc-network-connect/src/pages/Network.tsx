
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  UserCheck, 
  UserPlus, 
  MessageSquare, 
  Filter,
  GraduationCap,
  BookUser,
  Briefcase,
  Star
} from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ConnectionProps {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  tags?: string[];
  isConnected?: boolean;
}

const suggestedConnections: ConnectionProps[] = [
  {
    id: "1",
    name: "Ana Silva",
    role: "Estudante",
    department: "Ciência da Computação - 5º período",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Programação", "IA", "Monitoria de Algoritmos"],
    isConnected: false
  },
  {
    id: "2",
    name: "Prof. Carlos Mendes",
    role: "Professor",
    department: "Departamento de Computação",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Banco de Dados", "Sistemas Distribuídos"],
    isConnected: false
  },
  {
    id: "3",
    name: "Julia Costa",
    role: "Estudante",
    department: "Design - 7º período",
    avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["UX/UI", "Design Thinking", "Projeto Final"],
    isConnected: false
  },
  {
    id: "4",
    name: "Felipe Rodrigues",
    role: "Estudante",
    department: "Engenharia - 8º período",
    avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["IoT", "Robótica", "Iniciação Científica"],
    isConnected: false
  },
];

const professorConnections: ConnectionProps[] = [
  {
    id: "5",
    name: "Profa. Mariana Alves",
    role: "Professor",
    department: "Departamento de Matemática",
    avatar: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Cálculo", "Estatística"],
    isConnected: false
  },
  {
    id: "6",
    name: "Prof. Roberto Santos",
    role: "Professor",
    department: "Departamento de Computação",
    tags: ["Algoritmos", "Estruturas de Dados"],
    isConnected: false
  },
];

const myConnections: ConnectionProps[] = [
  {
    id: "7",
    name: "Pedro Oliveira",
    role: "Estudante",
    department: "Ciência da Computação - 6º período",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Algoritmos", "Front-end", "React"],
    isConnected: true
  },
  {
    id: "8",
    name: "Profa. Luciana Melo",
    role: "Professor",
    department: "Departamento de Computação",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Engenharia de Software", "Gestão de Projetos"],
    isConnected: true
  },
];

const smartRecommendations: ConnectionProps[] = [
  {
    id: "9",
    name: "Marcos Henrique",
    role: "Ex-aluno",
    department: "Desenvolvedor Sr. na Google",
    avatar: "https://images.unsplash.com/photo-1501286353178-1ec881214838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Ciência da Computação", "IA", "Google"],
    isConnected: false
  },
  {
    id: "10",
    name: "Camila Santos",
    role: "Estudante",
    department: "Ciência da Computação - 7º período",
    avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    tags: ["Monitora de Banco de Dados", "Programação"],
    isConnected: false
  },
];

function ConnectionCard({ connection }: { connection: ConnectionProps }) {
  const [isConnected, setIsConnected] = useState(connection.isConnected);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    // In a real app, would make API call to connect/disconnect
    console.log(`${isConnected ? "Disconnected from" : "Connected with"} ${connection.name}`);
  };

  const getRoleIcon = (role: string) => {
    switch (true) {
      case role.includes("Professor"):
        return <GraduationCap size={16} className="text-purple-500" />;
      case role.includes("Monitor"):
        return <BookUser size={16} className="text-blue-500" />;
      case role.includes("Ex-aluno"):
        return <Briefcase size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <HoverCard>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback>
                {connection.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex items-center gap-1">
                <h3 className="font-medium leading-none">{connection.name}</h3>
                {getRoleIcon(connection.role)}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{connection.role}</span>
                {connection.role !== connection.department && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="truncate">{connection.department}</span>
                  </>
                )}
              </div>
              
              {connection.tags && connection.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {connection.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {connection.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{connection.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex gap-2 justify-end">
            <HoverCardTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Ver perfil
              </Button>
            </HoverCardTrigger>
            <Button
              variant={isConnected ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={handleConnect}
            >
              {isConnected ? (
                <>
                  <UserCheck size={16} className="mr-1" />
                  Conectado
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-1" />
                  Conectar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <HoverCardContent className="w-80 p-0">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback>
                {connection.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{connection.name}</h3>
              <p className="text-sm text-muted-foreground">{connection.role} • {connection.department}</p>
            </div>
          </div>
          
          {connection.tags && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Interesses e áreas:</p>
              <div className="flex flex-wrap gap-1">
                {connection.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2 flex gap-2">
            <Button className="w-full" size="sm">
              <MessageSquare size={16} className="mr-2" />
              Enviar mensagem
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function ConnectionGrid({ connections }: { connections: ConnectionProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {connections.map((connection) => (
        <ConnectionCard key={connection.id} connection={connection} />
      ))}
    </div>
  );
}

export default function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    students: true,
    professors: true,
    projects: true,
    otherCourses: true,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <h1 className="text-3xl font-bold">Sua Rede</h1>
        
        <Tabs defaultValue="suggested" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="suggested">Sugestões</TabsTrigger>
            <TabsTrigger value="myConnections">Minhas Conexões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggested" className="space-y-8">
            {/* Search and Filters Section */}
            <div className="bg-background rounded-lg border p-4 space-y-4">
              <h2 className="text-xl font-semibold">Encontre pessoas</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome, curso, interesse..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Filtros
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="students" 
                    checked={filters.students}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, students: checked === true})
                    }
                  />
                  <label htmlFor="students" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Alunos
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="professors" 
                    checked={filters.professors}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, professors: checked === true})
                    }
                  />
                  <label htmlFor="professors" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Professores
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="projects" 
                    checked={filters.projects}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, projects: checked === true})
                    }
                  />
                  <label htmlFor="projects" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Monitorias/IC/Projetos
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="otherCourses" 
                    checked={filters.otherCourses}
                    onCheckedChange={(checked) => 
                      setFilters({...filters, otherCourses: checked === true})
                    }
                  />
                  <label htmlFor="otherCourses" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Outros cursos
                  </label>
                </div>
              </div>
            </div>
            
            {/* Suggested Connections Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pessoas que você pode conhecer</h2>
              </div>
              <ConnectionGrid connections={suggestedConnections} />
            </section>
            
            {/* Professor Connections Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Professores que lecionaram matérias suas</h2>
              </div>
              <ConnectionGrid connections={professorConnections} />
            </section>
            
            {/* Smart Recommendations Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Recomendações com base no seu perfil
                  <Badge className="ml-2 bg-purple-500">
                    <Star size={12} className="mr-1" />
                    Inteligente
                  </Badge>
                </h2>
              </div>
              <ConnectionGrid connections={smartRecommendations} />
            </section>
          </TabsContent>
          
          <TabsContent value="myConnections" className="space-y-8">
            {/* My Connections Section */}
            <div className="bg-background rounded-lg border p-4 space-y-4">
              <h2 className="text-xl font-semibold">Minhas Conexões</h2>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filtrar minhas conexões..."
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {myConnections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
