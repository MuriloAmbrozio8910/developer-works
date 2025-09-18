import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loading, ErrorState, EmptyState } from "@/components/ui/loading";
import { TaskForm } from "@/components/TaskForm";
import { TaskDetail } from "@/components/TaskDetail";
import { useTasks } from "@/hooks/useTasks";
import { type Task } from "@/lib/supabase";
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  User, 
  Building2, 
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Activity,
  AlertCircle,
  Square,
  CheckSquare,
  Edit,
  Check
} from "lucide-react";

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTimer, updateTaskTime, updateTaskStatus } = useTasks();

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
      case 'em_andamento': return <Activity className="w-4 h-4 text-primary animate-glow-pulse" />;
      case 'pendente': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluida': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'em_andamento': return 'bg-primary/20 text-primary border-primary/30';
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    try {
      setFormLoading(true);
      await addTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Função removida - agora usando handleStatusChange

  const handleEditSubmit = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'client'>) => {
    if (!editingTask) return;
    
    try {
      setFormLoading(true);
      await updateTask(editingTask.id, taskData);
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: 'pendente' | 'em_andamento' | 'concluida') => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return <Loading message="Carregando tarefas..." />;
  }

  if (error) {
    return <ErrorState message={`Erro ao carregar tarefas: ${error}`} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie suas tarefas e acompanhe o progresso</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-surface border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterPriority === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("all")}
              >
                Todas
              </Button>
              <Button
                variant={filterPriority === "Alta" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("Alta")}
              >
                Alta
              </Button>
              <Button
                variant={filterPriority === "Média" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("Média")}
              >
                Média
              </Button>
              <Button
                variant={filterPriority === "Baixa" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("Baixa")}
              >
                Baixa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                    {task.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                </div>
                {getStatusIcon(task.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Client and Assignee */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={task.client?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                    alt={task.client?.name || 'Cliente'}
                    className="w-8 h-8 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{task.client?.name || 'Cliente não encontrado'}</p>
                    <p className="text-xs text-muted-foreground">{task.assignee}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                </div>
              </div>

              {/* Status and Deadline */}
              <div className="flex items-center justify-between text-sm">
                <Badge className={`${getStatusBadge(task.status)} border`}>
                  {task.status === 'concluida' ? 'Concluída' : 
                   task.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                </Badge>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Time Tracking */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tempo gasto:</span>
                  <span className="font-medium text-foreground">{task.time_spent} / {task.estimated_time}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${task.estimated_time_seconds > 0 ? Math.min(100, (task.time_spent_seconds / task.estimated_time_seconds) * 100) : 0}%` 
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewTask(task)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTask(task)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={task.is_running ? "destructive" : "default"}
                    onClick={() => toggleTimer(task.id)}
                  >
                    {task.is_running ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Timer
                      </>
                    )}
                  </Button>

                  {/* Botões de Status */}
                  {task.status === 'pendente' && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusChange(task.id, 'em_andamento')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                  )}

                  {task.status === 'em_andamento' && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(task.id, 'concluida')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Finalizar
                    </Button>
                  )}

                  {task.status === 'concluida' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, 'em_andamento')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Reabrir
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                        handleDeleteTask(task.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <EmptyState
          icon={CheckSquare}
          title="Nenhuma tarefa encontrada"
          description="Tente ajustar os filtros ou criar uma nova tarefa."
        />
      )}

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <TaskForm
            onSubmit={editingTask ? handleEditSubmit : handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            loading={formLoading}
            initialData={editingTask}
            isEditing={!!editingTask}
          />
        </div>
      )}

      {/* Modal de Visualização */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleTimer={toggleTimer}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
}