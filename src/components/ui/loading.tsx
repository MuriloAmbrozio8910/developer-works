import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

interface LoadingProps {
  message?: string;
}

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-gradient-surface border-border max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Ops! Algo deu errado</h3>
          <p className="text-destructive mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Tentar Novamente
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="bg-gradient-surface border-border">
      <CardContent className="text-center py-12">
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
