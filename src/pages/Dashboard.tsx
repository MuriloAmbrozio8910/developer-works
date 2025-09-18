import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useClients } from "@/hooks/useClients";
import { useTasks } from "@/hooks/useTasks";
import { useActivityLog } from "@/hooks/useActivityLog";
import { type Task } from "@/lib/supabase";
import { 
  CheckSquare, 
  Users, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Activity,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Plus,
  User,
  Building2,
  X
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading, toggleTimer, updateTask } = useTasks();
  const { activities, loading: activitiesLoading, error: activitiesError, addActivity } = useActivityLog();

  const loading = clientsLoading || tasksLoading || activitiesLoading;

  // Calcular estatísticas dinâmicas
  const activeTasks = tasks.filter(task => task.status === 'em_andamento').length;
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'Ativo').length;
  
  // Calcular tempo total trabalhado (simplificado)
  const totalTimeWorked = tasks.reduce((total, task) => {
    const timeMatch = task.time_spent.match(/(\d+)h\s*(\d+)m/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]) || 0;
      const minutes = parseInt(timeMatch[2]) || 0;
      return total + (hours * 60) + minutes;
    }
    return total;
  }, 0);

  // Funções de ação

  const handleToggleTimer = async (taskId: number) => {
    try {
      await toggleTimer(taskId);
      const task = tasks.find(t => t.id === taskId);
      console.log('Adicionando atividade:', {
        type: 'info',
        action: 'Timer Alterado',
        details: `Timer ${task?.is_running ? 'pausado' : 'iniciado'} para tarefa "${task?.title}"`
      });
      await addActivity({
        type: 'info',
        action: 'Timer Alterado',
        details: `Timer ${task?.is_running ? 'pausado' : 'iniciado'} para tarefa "${task?.title}"`
      });
      console.log('Atividade adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao alternar timer:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await updateTask(taskId, { 
        status: 'concluida',
        is_running: false 
      });
      const task = tasks.find(t => t.id === taskId);
      console.log('Adicionando atividade de conclusão:', {
        type: 'success',
        action: 'Tarefa Concluída',
        details: `Tarefa "${task?.title}" foi concluída`
      });
      await addActivity({
        type: 'success',
        action: 'Tarefa Concluída',
        details: `Tarefa "${task?.title}" foi concluída`
      });
      console.log('Atividade de conclusão adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao finalizar tarefa:', error);
    }
  };

  // Tarefas recentes (últimas 5)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 5);

  // Atividades recentes (últimas 10)
  const recentActivities = activities
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    .slice(0, 10);

  const stats = [
    {
      title: "Tarefas Ativas",
      value: activeTasks.toString(),
      change: `${tasks.length} total`,
      icon: CheckSquare,
      color: "text-primary"
    },
    {
      title: "Clientes Cadastrados",
      value: totalClients.toString(),
      change: `${activeClients} ativos`,
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Tempo Trabalhado",
      value: `${Math.round(totalTimeWorked)}h`,
      change: "este mês",
      icon: Clock,
      color: "text-green-500"
    },
    {
      title: "Produtividade",
      value: "94%",
      change: "vs semana anterior",
      icon: TrendingUp,
      color: "text-purple-500"
    }
  ];

  // Remover duplicação - já definido acima

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-destructive text-destructive-foreground';
      case 'Média': return 'bg-primary text-primary-foreground';
      case 'Baixa': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'em_andamento': return <Activity className="w-4 h-4 text-primary" />;
      case 'pendente': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das atividades da empresa</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Tarefas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {task.client?.name || 'Sem cliente'}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {task.assignee}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.time_spent}
                    </div>
                  </div>
                </div>
                
                {/* Ações Rápidas */}
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setSelectedTask(task)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant={task.is_running ? "destructive" : "default"}
                    onClick={() => handleToggleTimer(task.id)}
                  >
                    {task.is_running ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  {task.status !== 'concluida' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {recentTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-surface border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-gradient-primary hover:shadow-glow transition-all duration-200" 
              size="lg"
              onClick={() => navigate('/tarefas')}
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-surface-hover" 
              size="lg"
              onClick={() => navigate('/clientes')}
            >
              <Users className="w-4 h-4 mr-2" />
              Cadastrar Cliente
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-surface-hover" 
              size="lg"
              onClick={() => navigate('/tarefas')}
            >
              <Activity className="w-4 h-4 mr-2" />
              Gerenciar Tarefas
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-surface-hover" 
              size="lg"
              onClick={() => navigate('/wiki')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Wiki de Códigos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-gradient-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Atividades Recentes
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                activity.type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
          
          {recentActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade recente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Visualização de Tarefa */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedTask.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="text-foreground">{selectedTask.description || 'Sem descrição'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="text-foreground">{selectedTask.client?.name || 'Sem cliente'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="text-foreground">{selectedTask.assignee}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prioridade</p>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-foreground">{selectedTask.status}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tempo Trabalhado</p>
                <p className="text-foreground">{selectedTask.time_spent}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}