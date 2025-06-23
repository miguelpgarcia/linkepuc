import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useRecommendations } from '@/hooks/use-recommendations';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';

interface RecommendationsListProps {
  limit?: number;
  showRefreshButton?: boolean;
  className?: string;
  searchQuery?: string;
  selectedTypes?: number[];
  selectedDepartment?: string;
  selectedBenefits?: string[];
}

// Transform recommendation data to OpportunityCard format
const transformRecommendationToOpportunity = (recommendation: any) => {
  return {
    id: recommendation.vaga_id,
    title: recommendation.vaga.titulo,
    department: {
      id: recommendation.vaga.department?.id || 0,
      name: recommendation.vaga.department?.name || "Departamento"
    },
    location: recommendation.vaga.location?.name || "Campus",
    postedBy: {
      id: recommendation.vaga.autor?.id?.toString() || "0",
      name: recommendation.vaga.autor?.nome || "Professor",
      avatar: recommendation.vaga.autor?.avatar || ""
    },
    timeAgo: "Recomendado para você",
    tipo: {
      id: recommendation.vaga.tipo?.id || 0,
      nome: recommendation.vaga.tipo?.nome || "Recomendação"
    },
    description: recommendation.vaga.descricao || "Descrição não disponível",
    benefits: {},
    // Add recommendation data
    isRecommendation: true,
    recommendationScore: recommendation.total_score,
    recommendationStrategies: recommendation.strategies
  };
};

export function RecommendationsList({ 
  limit = 10, 
  showRefreshButton = true,
  className = "",
  searchQuery = "",
  selectedTypes = [],
  selectedDepartment = "",
  selectedBenefits = []
}: RecommendationsListProps) {
  const { recommendations, isLoading, error, refreshRecommendations, isRefreshing } = useRecommendations({
    limit,
    searchQuery,
    selectedTypes,
    selectedDepartment,
    selectedBenefits
  });

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recomendações Personalizadas
          </h2>
          {showRefreshButton && (
            <Skeleton className="h-9 w-24" />
          )}
        </div>
        
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar recomendações. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recomendações Personalizadas
          </h2>
          {showRefreshButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshRecommendations()}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
        </div>
        
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nenhuma recomendação disponível</h3>
          <p className="text-muted-foreground mb-4">
            Adicione interesses ao seu perfil para receber recomendações personalizadas.
          </p>
          <Button onClick={() => refreshRecommendations()} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Gerar Recomendações
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recomendações Personalizadas
          <Badge variant="secondary" className="ml-2">
            {recommendations.length} oportunidades
          </Badge>
        </h2>
        
        {showRefreshButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshRecommendations()}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => {
          const opportunity = transformRecommendationToOpportunity(recommendation);
          
          return (
            <div key={recommendation.vaga_id} className="relative">
              {/* Recommendation Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recomendado {Math.round(recommendation.total_score * 100)}%
                </Badge>
              </div>
              
              {/* Use normal OpportunityCard */}
              <OpportunityCard {...opportunity} />
            </div>
          );
        })}
      </div>
    </div>
  );
} 