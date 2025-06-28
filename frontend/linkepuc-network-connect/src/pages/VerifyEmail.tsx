import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verificationCode, setVerificationCode] = useState(token || "");
  const [isLoading, setIsLoading] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const verifyEmailWithToken = async (tokenToVerify: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to verify email");
      }

      const data = await response.json();
      
      // Automatic login after successful verification
      if (data.access_token) {
        login(data.access_token);
        
        // Set user type in localStorage
        if (data.is_student) {
          localStorage.setItem("isStudent", "true");
        } else {
          localStorage.setItem("isStudent", "false");
        }

        toast({
          title: "Email verificado com sucesso!",
          description: `Bem-vindo, ${data.user_name}! Você foi automaticamente conectado.`,
        });

        // Redirect to appropriate dashboard
        setTimeout(() => {
          if (data.is_student) {
            navigate("/");
          } else {
            navigate("/professor/opportunities");
          }
        }, 2000);
      } else {
        // Fallback to old behavior if no token returned
        toast({
          title: "Email verificado com sucesso!",
          description: "Você já pode fazer login na sua conta.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro ao verificar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token && !autoVerified && !isLoading) {
      setAutoVerified(true);
      verifyEmailWithToken(token);
    }
  }, [token, autoVerified, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmailWithToken(verificationCode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
                              src={`${import.meta.env.BASE_URL}lovable-uploads/600b30a3-851a-493b-98ca-81653ff0f5bc.png`} 
              alt="LinkePuc Logo" 
              className="h-32"
            />
          </div>
          <h2 className="text-2xl font-bold mt-2 text-gray-900">Verificar Email</h2>
          <p className="text-gray-600 mt-1">Digite o código de verificação enviado para seu email</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verificação de Email</CardTitle>
            <CardDescription>
              {token && autoVerified 
                ? "Verificando automaticamente seu email..." 
                : "Insira o código de verificação que você recebeu por email"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {token && autoVerified ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Verificando seu email e fazendo login automaticamente...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Código de Verificação</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Digite o código de verificação"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Verificar Email"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 