import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Task } from "@/lib/supabase";
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Tag, 
  FileText, 
  Play, 
  Pause, 
  Square,
  Eye,
  X
} from "lucide-react";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onToggleTimer: (taskId: number) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

export function TaskDetail({ task, onClose, onToggleTimer, onUpdateTask }: TaskDetailProps) {
  const [currentTime, setCurrentTime] = useState(task.time_spent_seconds);
  const [isRunning, setIsRunning] = useState(task.is_running);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Atualizar no banco a cada minuto
          if (newTime % 60 === 0) {
            onUpdateTask(task.id, {
              time_spent_seconds: newTime,
              time_spent: formatTime(newTime)
            });
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, task.id, onUpdateTask]);

  useEffect(() => {
    setCurrentTime(task.time_spent_seconds);
    setIsRunning(task.is_running);
  }, [task.time_spent_seconds, task.is_running]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleToggleTimer = () => {
    onToggleTimer(task.id);
    setIsRunning(!isRunning);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500';
      case 'Média': return 'bg-yellow-500';
      case 'Baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'pendente': return 'bg-yellow-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const progressPercentage = task.estimated_time_seconds > 0 
    ? Math.min((currentTime / task.estimated_time_seconds) * 100, 100)
    : 0;

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Eye className="w-6 h-6" />
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${getPriorityColor(task.priority)} text-white`}>
            {task.priority}
          </Badge>
          <Badge className={`${getStatusColor(task.status)} text-white`}>
            {getStatusText(task.status)}
          </Badge>
          {task.type && (
            <Badge variant="outline">{task.type}</Badge>
          )}
        </div>

        <div className="space-y-6">
          {/* Cronômetro */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold text-blue-600">
                  {formatTime(currentTime)}
                </div>
                
                {task.estimated_time && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Progresso</span>
                      <span>{task.estimated_time} estimado</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {progressPercentage.toFixed(1)}% concluído
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handleToggleTimer}
                    className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  
                  {currentTime > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentTime(0);
                        onUpdateTask(task.id, {
                          time_spent_seconds: 0,
                          time_spent: '0h 0m',
                          is_running: false
                        });
                        setIsRunning(false);
                      }}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Resetar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Responsável:</span>
                {task.assignee_employee?.avatar_url && (
                  <img
                    src={task.assignee_employee.avatar_url}
                    alt={task.assignee_employee.name}
                    className="w-5 h-5 rounded-full border"
                  />
                )}
                <span>{task.assignee_employee?.name || task.assignee}</span>
              </div>

              {task.client && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Cliente:</span>
                  {task.client.photo && (
                    <img
                      src={task.client.photo}
                      alt={task.client.name}
                      className="w-5 h-5 rounded-full border"
                    />
                  )}
                  <span>{task.client.name}</span>
                </div>
              )}

              {task.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Prazo:</span>
                  <span>{new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {task.estimated_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Tempo Estimado:</span>
                  <span>{task.estimated_time}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Tempo Trabalhado:</span>
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          {task.description && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descrição
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Fotos */}
          {task.photos && task.photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Fotos do Projeto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {task.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1} do projeto`}
                      className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(photo, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {task.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notas Adicionais</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.notes}
                </p>
              </div>
            </div>
          )}

          {/* Informações de Sistema */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span>{' '}
              {task.created_at ? new Date(task.created_at).toLocaleString('pt-BR') : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span>{' '}
              {task.updated_at ? new Date(task.updated_at).toLocaleString('pt-BR') : 'N/A'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
