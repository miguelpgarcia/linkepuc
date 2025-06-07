
import { Card, CardContent } from "@/components/ui/card";

interface ApplicationStatusProps {
  hasApplied: boolean;
  applicationDate: string | null;
  status: string | null;
}

export function ApplicationStatus({
  hasApplied,
  applicationDate,
  status,
}: ApplicationStatusProps) {
  if (!hasApplied) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span>
              Você se candidatou em{" "}
              {new Date(applicationDate!).toLocaleDateString("pt-BR")}
            </span>
          </div>
          {status && (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
              <span>{status}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
