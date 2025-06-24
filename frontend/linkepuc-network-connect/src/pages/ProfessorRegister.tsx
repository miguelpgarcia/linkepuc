import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  specialties: string[];
  bio: string;
  academicTitle: string;
  role: "professor";
};

const SPECIALTIES = [
  "Programação",
  "Inteligência Artificial",
  "Ciência de Dados",
  "Engenharia de Software",
  "Matemática",
  "Física",
  "Química",
  "Biologia",
  "Letras",
  "História",
  "Economia",
  "Direito"
];

// Mock data - in a real app, this would come from an API
const PROFESSORS = [
  "Ana Maria Silva",
  "Carlos Eduardo Santos",
  "Fernanda Oliveira",
  "José Roberto Almeida",
  "Luiza Mendes Costa",
  "Marcelo Ribeiro",
  "Patricia Andrade",
  "Roberto Carlos Pereira",
  "Silvia Rodrigues",
  "Thiago Alves Ferreira"
];

// Mock data - in a real app, this would come from an API
const DEPARTMENTS = [
  "Ciência da Computação",
  "Engenharia Elétrica",
  "Engenharia Mecânica",
  "Física",
  "Matemática",
  "Química",
  "Letras",
  "História",
  "Geografia",
  "Economia",
  "Administração",
  "Direito"
];

const ACADEMIC_TITLES = [
  "Professor Assistente",
  "Professor Adjunto",
  "Professor Associado",
  "Professor Titular",
  "Professor Visitante",
  "Professor Emérito"
];

export default function ProfessorRegister() {
  const [formData, setFormData] = useState<ProfessorData>({
    fullName: "",
    email: "",
    password: "",
    department: "",
    specialties: [],
    bio: "",
    academicTitle: "",
    role: "professor"
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.endsWith("puc-rio.br")) {
      toast({
        title: "Email inválido",
        description: "Por favor, use seu email institucional (puc-rio.br)",
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

      const userData = await userResponse.json();
      
      // Add professor specialties as interests
      const interestsResponse = await fetch(API_ENDPOINTS.INTERESSES.USUARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userData.user_id,
          interesses: formData.specialties
        }),
      });

      if (!interestsResponse.ok) {
        throw new Error("Erro ao salvar especialidades");
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
                <Select
                  onValueChange={(value) => setFormData({...formData, fullName: value})}
                  value={formData.fullName}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione seu nome" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSORS.map((professor) => (
                      <SelectItem key={professor} value={professor}>
                        {professor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="academicTitle">Título Acadêmico</Label>
                <Select
                  onValueChange={(value) => setFormData({...formData, academicTitle: value})}
                  value={formData.academicTitle}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione seu título acadêmico" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_TITLES.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  onValueChange={(value) => setFormData({...formData, department: value})}
                  value={formData.department}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione seu departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Áreas de especialidade</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {SPECIALTIES.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            specialties: checked
                              ? [...formData.specialties, specialty]
                              : formData.specialties.filter((s) => s !== specialty),
                          });
                        }}
                      />
                      <Label htmlFor={specialty}>{specialty}</Label>
                    </div>
                  ))}
                </div>
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

              <Button type="submit" className="w-full">
                Finalizar cadastro
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
