import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_ENDPOINTS } from "@/config/api";

type ProfessorData = {
  fullName: string;
  email: string;
  password: string;
  department: string;
  bio: string;
  role: "professor";
};

type Department = {
  id: number;
  name: string;
  sigla: string;
};

export default function ProfessorRegister() {
  const [formData, setFormData] = useState<ProfessorData>({
    fullName: "",
    email: "",
    password: "",
    department: "",
    bio: "",
    role: "professor"
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DEPARTAMENTOS.BASE);
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate PUC-Rio email domains
    const validDomains = ["@puc-rio.br", "@inf.puc-rio.br"];
    const isValidEmail = validDomains.some(domain => formData.email.endsWith(domain));
    
    if (!isValidEmail) {
      toast({
        title: "Email inválido",
        description: "Por favor, use seu email institucional (@puc-rio.br ou @inf.puc-rio.br)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create the professor user
      const userResponse = await fetch(API_ENDPOINTS.USERS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: formData.fullName,
          password: formData.password,
          ehaluno: false,
          email: formData.email
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Erro ao criar usuário");
      }
    
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Por favor, verifique seu email para ativar sua conta.",
      });
    
      // Redirect to login page
      setTimeout(() => {
        navigate("/professor/login");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro ao realizar cadastro",
        description: error.message,
        variant: "destructive",
      });
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
          <h2 className="text-2xl font-bold mt-2 text-gray-900">Cadastro de Professor no LinkePuc</h2>
          <p className="text-gray-600 mt-1">Compartilhe conhecimento e oportunidades com nossa comunidade</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            <CardDescription>
              Conte-nos sobre sua atuação na PUC-Rio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nome completo"
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
                  placeholder="seu.nome@puc-rio.br ou @inf.puc-rio.br"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <p className="text-sm text-gray-500">
                  Apenas emails institucionais da PUC-Rio são aceitos para professores
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
                <Label htmlFor="department">Departamento</Label>
                <Select
                  onValueChange={(value) => setFormData({...formData, department: value})}
                  value={formData.department}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingDepartments ? "Carregando departamentos..." : "Selecione seu departamento"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {departments.map((department) => (
                      <SelectItem key={department.name} value={department.name}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia resumida</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoadingDepartments}>
                {isLoadingDepartments ? "Carregando..." : "Finalizar cadastro"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
