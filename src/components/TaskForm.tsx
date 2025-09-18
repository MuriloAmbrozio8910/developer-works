import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useClients } from "@/hooks/useClients";
import { type Task } from "@/lib/supabase";
import { X, Plus, Upload, Clock } from "lucide-react";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'client'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Task | null;
  isEditing?: boolean;
}

export function TaskForm({ onSubmit, onCancel, loading = false, initialData, isEditing = false }: TaskFormProps) {
  const { clients } = useClients();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    assignee: '',
    priority: 'Média' as 'Baixa' | 'Média' | 'Alta',
    type: '',
    deadline: '',
    estimated_time: '',
    estimated_time_seconds: 0,
    notes: '',
    photos: [] as string[],
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  // Preencher formulário quando editando
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        client_id: initialData.client_id?.toString() || '',
        assignee: initialData.assignee || '',
        priority: initialData.priority || 'Média',
        type: initialData.type || '',
        deadline: initialData.deadline || '',
        estimated_time: initialData.estimated_time || '',
        estimated_time_seconds: initialData.estimated_time_seconds || 0,
        notes: initialData.notes || '',
        photos: initialData.photos || [],
        tags: initialData.tags || []
      });
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'client'> = {
      title: formData.title,
      description: formData.description,
      client_id: formData.client_id ? parseInt(formData.client_id) : undefined,
      assignee: formData.assignee,
      priority: formData.priority,
      type: formData.type,
      deadline: formData.deadline,
      status: 'pendente',
      time_spent_seconds: 0,
      time_spent: '0h 0m',
      estimated_time: formData.estimated_time,
      estimated_time_seconds: parseTimeToSeconds(formData.estimated_time),
      is_running: false,
      photos: formData.photos,
      notes: formData.notes,
      tags: formData.tags
    };

    onSubmit(taskData);
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const matches = timeStr.match(/(\d+)h?\s*(\d+)?m?/);
    if (!matches) return 0;
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    return hours * 3600 + minutes * 60;
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPhoto = () => {
    if (newPhoto.trim() && !formData.photos.includes(newPhoto.trim())) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhoto.trim()]
      }));
      setNewPhoto('');
    }
  };

  const removePhoto = (photoToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo !== photoToRemove)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[840px] overflow-y-scroll">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a tarefa em detalhes"
              rows={3}
            />
          </div>

          {/* Cliente e Responsável */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={formData.client_id} onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Responsável *</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          {/* Prioridade, Tipo e Prazo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: 'Baixa' | 'Média' | 'Alta') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Ex: Desenvolvimento, Design"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          {/* Tempo Estimado */}
          <div className="space-y-2">
            <Label htmlFor="estimated_time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tempo Estimado
            </Label>
            <Input
              id="estimated_time"
              value={formData.estimated_time}
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
              placeholder="Ex: 8h, 2h 30m, 45m"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Fotos */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Fotos (URLs)
            </Label>
            <div className="flex gap-2">
              <Input
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                placeholder="URL da imagem"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
              />
              <Button type="button" onClick={addPhoto} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Informações extras, observações, links úteis..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Tarefa')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
