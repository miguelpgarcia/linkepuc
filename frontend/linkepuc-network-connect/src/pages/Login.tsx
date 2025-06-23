import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas ou email não verificado");
      }

      const data = await response.json();
      
      // Check if user is a student
      if (!data.is_student) {
        throw new Error("Esta conta não tem permissão de aluno");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("isStudent", "true");

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para a página inicial...",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao realizar login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png" 
              alt="LinkePuc Logo" 
              className="h-32"
            />
          </div>
          <h2 className="text-2xl font-bold mt-2 text-gray-900">Bem-vindo ao LinkePuc</h2>
          <p className="text-gray-600 mt-1">Da teoria à prática</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Entrar na sua conta</CardTitle>
            <CardDescription className="text-center">
              Conecte-se com a comunidade PUC-Rio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.nome@puc-rio.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Criar conta
              </Link>
            </div>
            <div className="text-center text-sm">
              Professor?{" "}
              <Link
                to="/professor/login"
                className="font-medium text-primary hover:underline"
              >
                Acesse o espaço do professor
              </Link>
            </div>
            <div className="text-center text-sm mt-2">
              <Link
                to="/"
                className="font-medium text-muted-foreground hover:underline"
              >
                Voltar para a página inicial
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
