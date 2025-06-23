import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, TrendingUp, Users, Star } from 'lucide-react';
import { RecommendationStrategy } from '@/hooks/use-recommendations';

interface RecommendationExplanationProps {
  strategies: RecommendationStrategy[];
  totalScore: number;
  className?: string;
}

const getStrategyIcon = (strategyName: string) => {
  switch (strategyName) {
    case 'common_interests':
      return <Star className="h-4 w-4" />;
    case 'popular':
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getStrategyColor = (strategyName: string) => {
  switch (strategyName) {
    case 'common_interests':
      return 'bg-blue-500';
    case 'popular':
      return 'bg-green-500';
    default:
      return 'bg-purple-500';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  if (score >= 0.4) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreLabel = (score: number) => {
  if (score >= 0.8) return 'Excelente match';
  if (score >= 0.6) return 'Bom match';
  if (score >= 0.4) return 'Match moderado';
  return 'Match baixo';
};

export function RecommendationExplanation({ 
  strategies, 
  totalScore, 
  className = "" 
}: RecommendationExplanationProps) {
  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Por que esta oportunidade foi recomendada?
          </CardTitle>
          <div className="text-right">
            <div className={`text-sm font-medium ${getScoreColor(totalScore)}`}>
              {getScoreLabel(totalScore)}
            </div>
            <div className="text-xs text-muted-foreground">
              Score: {(totalScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <Progress value={totalScore * 100} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {strategies.map((strategy, index) => (
          <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/30">
            <div className={`p-2 rounded-full ${getStrategyColor(strategy.name)} bg-opacity-10`}>
              {getStrategyIcon(strategy.name)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {strategy.description}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {(strategy.score * 100).toFixed(0)}%
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strategy.explanation}
              </p>
            </div>
          </div>
        ))}
        
        {strategies.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma explicação disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CompactRecommendationBadgeProps {
  totalScore: number;
  strategiesCount: number;
  className?: string;
}

export function CompactRecommendationBadge({ 
  totalScore, 
  strategiesCount, 
  className = "" 
}: CompactRecommendationBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${className}`}
    >
      <Star className="h-3 w-3" />
      <span className="text-xs">
        {(totalScore * 100).toFixed(0)}% match
      </span>
      <span className="text-xs text-muted-foreground">
        ({strategiesCount} razões)
      </span>
    </Badge>
  );
} 