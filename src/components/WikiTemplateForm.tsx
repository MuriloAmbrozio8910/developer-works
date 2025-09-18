import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type WikiTemplate } from "@/lib/supabase";
import { X, Plus, Code2 } from "lucide-react";

interface WikiTemplateFormProps {
  onSubmit: (template: Omit<WikiTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: WikiTemplate | null;
  isEditing?: boolean;
}

export function WikiTemplateForm({ onSubmit, onCancel, loading = false, initialData, isEditing = false }: WikiTemplateFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    language: '',
    author: '',
    stars: 0,
    downloads: 0,
    tags: [] as string[],
    code: ''
  });
  const [newTag, setNewTag] = useState('');

  // Preencher formulário quando editando
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        language: initialData.language || '',
        author: initialData.author || '',
        stars: initialData.stars || 0,
        downloads: initialData.downloads || 0,
        tags: initialData.tags || [],
        code: initialData.code || ''
      });
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData: Omit<WikiTemplate, 'id' | 'created_at' | 'updated_at'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      language: formData.language,
      author: formData.author,
      stars: formData.stars,
      downloads: formData.downloads,
      tags: formData.tags,
      code: formData.code
    };

    onSubmit(templateData);
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

  return (
    <Card className="w-full max-w-4xl mx-auto h-[840px] overflow-y-scroll">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          {isEditing ? 'Editar Template' : 'Novo Template'}
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
              placeholder="Digite o título do template"
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
              placeholder="Descreva o que este template faz"
              rows={3}
            />
          </div>

          {/* Categoria, Linguagem e Autor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Linguagem *</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                placeholder="Ex: TypeScript, JavaScript"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Nome do autor"
                required
              />
            </div>
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

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">Código *</Label>
            <Textarea
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Cole o código do template aqui..."
              rows={15}
              className="font-mono text-sm"
              required
            />
          </div>

          {/* Preview do Código */}
          {formData.code && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-surface rounded-lg p-4 border border-border">
                <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                  <code>{formData.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Template')}
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
