import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { API_ENDPOINTS } from "@/config/api";

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
  const [availableInterests, setAvailableInterests] = useState<Record<string, { id: number; nome: string; categoria: string }[]>>({});
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    course: "",
    currentPeriod: "",
    mainObjective: "networking",
    interests: []
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch available interests from the backend
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        console.log("Attempting to fetch interests...");
        const response = await fetch(API_ENDPOINTS.INTERESSES.BASE);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch interests: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Received interests:", data);
        setAvailableInterests(data);
      } catch (error) {
        console.error("Detailed error:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        toast({
          title: "Erro ao carregar interesses",
          description: "Não foi possível carregar a lista de interesses. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    };

    fetchInterests();
  }, [toast]);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Exception list for testing purposes (same as backend)
    const exceptionEmails = [
      "alessandra.dpgarcia@gmail.com"
    ];
    
    if (formData.email && !exceptionEmails.includes(formData.email)) {
      if (!formData.email.endsWith("puc-rio.br")) {
        toast({
          title: "Email inválido",
          description: "Por favor, use seu email institucional (puc-rio.br)",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(2);
  };

  const handleObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInterestsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log("⚠️ Submission already in progress, ignoring duplicate request");
      return; // Prevent double submission
    }
    
    console.log("🚀 Starting registration process...");
    setIsSubmitting(true);
  
    try {
      // First create the user
      console.log("📤 Creating user...");
      const userResponse = await fetch(API_ENDPOINTS.USERS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formData.fullName,
          password: formData.password,
          ehaluno: formData.role === "student",
          email: formData.email
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error("❌ User creation failed:", errorData);
        throw new Error(errorData.detail || "Erro ao criar usuário");
      }

      const userData = await userResponse.json();
      console.log("✅ User created successfully:", userData);
      
      // Get the names of the selected interests
      const allInterests = Object.values(availableInterests).flat();
      const selectedInterests = allInterests
        .filter(interest => formData.interests.includes(interest.id))
        .map(interest => interest.nome);
      
      // Prepare interests data
      const interestsData = {
        usuario_id: userData.user_id,
        interesses: selectedInterests
      };
      console.log("📤 Sending interests data:", interestsData);
      
      // Then add interests
      const interestsResponse = await fetch(API_ENDPOINTS.INTERESSES.USUARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interestsData),
      });

      if (!interestsResponse.ok) {
        const errorData = await interestsResponse.json();
        console.error("Interests error response:", {
          status: interestsResponse.status,
          statusText: interestsResponse.statusText,
          errorData,
          requestData: interestsData
        });
        throw new Error(errorData.detail || `Erro ao salvar interesses: ${interestsResponse.status} ${interestsResponse.statusText}`);
      }

      const interestsResult = await interestsResponse.json();
      console.log("✅ Interests saved successfully:", interestsResult);
    
      console.log("🎉 Registration completed successfully!");
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Por favor, verifique seu email para ativar sua conta.",
      });
    
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("❌ Registration error:", error);
      toast({
        title: "Erro ao realizar cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      console.log("🔄 Re-enabling submission button");
      setIsSubmitting(false); // Re-enable submission
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary/20 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={`${import.meta.env.BASE_URL}lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png`} 
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
                    placeholder="seu.nome@aluno.puc-rio.br ou outro email institucional"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Não conhece seu Email Institucional?{" "}
                    <a 
                      href="https://www.rdc.puc-rio.br/email/criar/aluno/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Clique aqui para criar
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={6}
                  />
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
                <div className="space-y-6">
                  {Object.entries(availableInterests).map(([categoria, interests]) => (
                    <div key={categoria} className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900">{categoria}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {interests.map((interest) => (
                          <div key={interest.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${categoria}-${interest.nome}`}
                              checked={formData.interests.includes(interest.id)}
                              onCheckedChange={(checked) => {
                                setFormData({
                                  ...formData,
                                  interests: checked
                                    ? [...formData.interests, interest.id]
                                    : formData.interests.filter((i) => i !== interest.id),
                                });
                              }}
                            />
                            <Label htmlFor={`${categoria}-${interest.nome}`}>{interest.nome}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Finalizando..." : "Finalizar cadastro"}
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
