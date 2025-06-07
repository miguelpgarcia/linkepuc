
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrationData, UserRole, MainObjective } from "@/types/registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Cursos disponíveis na PUC-Rio
const COURSES = [
  "Administração",
  "Arquitetura e Urbanismo",
  "Ciência da Computação",
  "Ciências Biológicas",
  "Ciências Sociais",
  "Design",
  "Direito",
  "Economia",
  "Engenharia Civil",
  "Engenharia de Computação",
  "Engenharia de Controle e Automação",
  "Engenharia de Petróleo",
  "Engenharia de Produção",
  "Engenharia Elétrica",
  "Engenharia Mecânica",
  "Engenharia Química",
  "Filosofia",
  "Física",
  "Geografia",
  "História",
  "Letras",
  "Matemática",
  "Pedagogia",
  "Psicologia",
  "Química",
  "Relações Internacionais",
  "Sistemas de Informação",
  "Teologia"
];

// Lista de períodos acadêmicos
const PERIODS = [
  "2023.2",
  "2023.1",
  "2022.2",
  "2022.1",
  "2021.2",
  "2021.1", 
  "2020.2", 
  "2020.1",
  "2019.2",
  "2019.1",
  "2018.2",
  "2018.1"
];

const INTERESTS = [
  {
    category: "Tecnologia",
    subInterests: [
      "Programação Frontend",
      "Desenvolvimento Backend",
      "Mobile",
      "IA/Machine Learning",
      "Dados"
    ]
  },
  {
    category: "Engenharia",
    subInterests: [
      "Cálculo",
      "Física",
      "Estruturas",
      "Lógica",
      "Automação"
    ]
  },
  {
    category: "Comunicação",
    subInterests: [
      "Redação",
      "Línguas",
      "Oratória",
      "Documentação",
      "Artigos"
    ]
  },
  // ... outros interesses principais
];

const OBJECTIVES: { value: MainObjective; label: string }[] = [
  { value: "mentoring", label: "Encontrar vagas de monitoria" },
  { value: "academic_projects", label: "Participar de projetos acadêmicos (IC, TCC, pesquisa)" },
  { value: "networking", label: "Me conectar com colegas e professores" },
  { value: "opportunities", label: "Descobrir eventos, grupos e oportunidades" },
  { value: "curriculum", label: "Construir meu currículo acadêmico" },
  { value: "other", label: "Outros" }
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    role: "student",
    course: "",
    currentPeriod: "",
    mainObjective: "networking",
    interests: []
  });
  
  const { toast } = useToast();

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith("@puc-rio.br")) {
      toast({
        title: "Email inválido",
        description: "Por favor, use seu email institucional (@puc-rio.br)",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleInterestsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados finais:", formData);
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Redirecionando para a página inicial...",
    });
    
    // Simular delay antes do redirecionamento
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary/20 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
              alt="LinkePuc Logo" 
              className="h-32"
            />
          </div>
          <h2 className="text-2xl font-bold mt-2 text-gray-900">Criar sua conta no LinkePuc</h2>
          <p className="text-gray-600 mt-1">Passo {step} de 3</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Conte-nos um pouco sobre você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.nome@puc-rio.br"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seu papel na PUC</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({...formData, role: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Aluno</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professor" id="professor" />
                      <Label htmlFor="professor">Professor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Outro</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => setFormData({...formData, course: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione seu curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startPeriod">Início</Label>
                  <Select
                    value={formData.currentPeriod}
                    onValueChange={(value) => setFormData({...formData, currentPeriod: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione seu período de início" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIODS.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Próximo passo
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Objetivo Principal</CardTitle>
              <CardDescription>
                O que você mais quer alcançar por aqui?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleObjectiveSubmit} className="space-y-4">
                <RadioGroup
                  value={formData.mainObjective}
                  onValueChange={(value: MainObjective) => 
                    setFormData({...formData, mainObjective: value})
                  }
                  className="space-y-2"
                >
                  {OBJECTIVES.map((objective) => (
                    <div key={objective.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={objective.value} id={objective.value} />
                      <Label htmlFor={objective.value}>{objective.label}</Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit">
                    Próximo passo
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Interesses</CardTitle>
              <CardDescription>
                Selecione as áreas que mais te interessam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInterestsSubmit} className="space-y-6">
                {INTERESTS.map((category) => (
                  <div key={category.category} className="space-y-4">
                    <h3 className="font-semibold text-lg">{category.category}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {category.subInterests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => {
                              setFormData({
                                ...formData,
                                interests: checked
                                  ? [...formData.interests, interest]
                                  : formData.interests.filter((i) => i !== interest),
                              });
                            }}
                          />
                          <Label htmlFor={interest}>{interest}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit">
                    Finalizar cadastro
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
