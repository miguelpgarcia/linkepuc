import { useAuth } from "@/AuthContext";
import { useRecommendations } from "@/hooks/use-recommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function DebugRecommendations() {
  const { user } = useAuth();
  const { 
    data: recommendations, 
    isLoading, 
    error, 
    refetch,
    isError 
  } = useRecommendations();

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          Debug: Status das Recomendações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Usuário logado:</strong>
            <div className="flex items-center gap-2 mt-1">
              {user ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>ID: {user.id} | Estudante: {user.is_student ? 'Sim' : 'Não'}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Não logado</span>
                </>
              )}
            </div>
          </div>

          <div>
            <strong>Status da requisição:</strong>
            <div className="flex items-center gap-2 mt-1">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span>Carregando...</span>
                </>
              ) : isError ? (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Erro na requisição</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Sucesso</span>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <strong className="text-red-800">Erro:</strong>
            <pre className="text-red-700 text-xs mt-1 whitespace-pre-wrap">
              {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div>
          <strong>Recomendações encontradas:</strong>
          <div className="flex items-center gap-2 mt-1">
            {recommendations ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{recommendations.length} recomendações</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Nenhuma recomendação</span>
              </>
            )}
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong className="text-blue-800">Primeiras 3 recomendações:</strong>
            <pre className="text-blue-700 text-xs mt-1 whitespace-pre-wrap">
              {JSON.stringify(recommendations.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Recarregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 