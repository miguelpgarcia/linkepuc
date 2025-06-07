
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, MessageSquare } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";
import { ChartData } from "@/types/professor";

interface MetricsProps {
  totalCandidates: number;
  eligibleCandidates: number;
  withMotivationLetter: number;
  courseDistribution: ChartData[];
  semesterDistribution: ChartData[];
}

const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#F97316', '#10B981'];

export function OpportunityMetrics({
  totalCandidates,
  eligibleCandidates,
  withMotivationLetter,
  courseDistribution,
  semesterDistribution
}: MetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Candidatos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="rounded-full bg-violet-100 p-2">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <div className="font-medium">Total de candidatos</div>
              <div className="text-2xl font-bold">{totalCandidates}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium">Candidatos elegíveis</div>
              <div className="text-2xl font-bold">{eligibleCandidates}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <div className="rounded-full bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Com carta de motivação</div>
              <div className="text-2xl font-bold">{withMotivationLetter}</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4">Distribuição por Curso</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Distribuição por Período</h3>
            <div className="space-y-6">
              {semesterDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
