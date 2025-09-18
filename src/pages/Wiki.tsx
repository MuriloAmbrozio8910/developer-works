import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loading, ErrorState, EmptyState } from "@/components/ui/loading";
import { WikiTemplateForm } from "@/components/WikiTemplateForm";
import { useWiki } from "@/hooks/useWiki";
import { type WikiTemplate } from "@/lib/supabase";
import { 
  BookOpen, 
  Search,
  Plus,
  Copy,
  Star,
  Code,
  Database,
  Palette,
  Globe,
  FileText,
  Tag,
  Calendar,
  User,
  ExternalLink,
  Download,
  Edit,
  Trash2
} from "lucide-react";

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WikiTemplate | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<WikiTemplate | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { templates, categories, loading, error, addTemplate, updateTemplate, deleteTemplate, copyToClipboard, incrementStars } = useWiki();

  // Função para criar dados de exemplo se não houver templates
  const createSampleData = async () => {
    if (templates.length === 0 && !loading) {
      console.log('Criando dados de exemplo...');
      try {
        await addTemplate({
          title: 'React Component Template',
          description: 'Template básico para componentes React com TypeScript',
          category: 'frontend',
          language: 'TypeScript',
          author: 'Sistema',
          stars: 5,
          downloads: 10,
          tags: ['react', 'typescript', 'component'],
          code: `import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};`
        });
      } catch (error) {
        console.error('Erro ao criar dados de exemplo:', error);
      }
    }
  };

  const handleStarTemplate = async (templateId: number) => {
    try {
      await incrementStars(templateId);
    } catch (error) {
      console.error('Erro ao adicionar estrela:', error);
    }
  };

  const handleCreateTemplate = async (templateData: Omit<WikiTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setFormLoading(true);
      await addTemplate(templateData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar template:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTemplate = (template: WikiTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleEditSubmit = async (templateData: Omit<WikiTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingTemplate) return;
    
    try {
      setFormLoading(true);
      await updateTemplate(editingTemplate.id, templateData);
      setShowForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este template?')) {
      try {
        await deleteTemplate(templateId);
      } catch (error) {
        console.error('Erro ao deletar template:', error);
      }
    }
  };

  const handleCopyCode = async (code: string, templateId: number) => {
    try {
      await copyToClipboard(code, templateId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Remove feedback após 2 segundos
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  // Mapear categorias do banco para o formato esperado
  const mappedCategories = [
    {
      id: "all",
      name: "Todos",
      icon: BookOpen,
      count: templates.length
    },
    ...categories.map(cat => ({
      id: cat.name.toLowerCase(),
      name: cat.name,
      icon: getIconByName(cat.icon),
      count: cat.count
    }))
  ];

  function getIconByName(iconName: string) {
    const icons: { [key: string]: any } = {
      BookOpen,
      Globe,
      Database,
      Palette,
      Code,
      FileText
    };
    return icons[iconName] || BookOpen;
  }


  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase();
    
    
    return matchesSearch && matchesCategory;
  });


  if (loading) {
    return <Loading message="Carregando templates..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Wiki de Códigos</h1>
            <p className="text-muted-foreground">Repositório de templates e códigos reutilizáveis</p>
          </div>
        </div>
        <ErrorState 
          message={`Erro ao carregar templates: ${error}`} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wiki de Códigos</h1>
          <p className="text-muted-foreground">Repositório de templates e códigos reutilizáveis</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
          {templates.length === 0 && (
            <Button 
              onClick={createSampleData}
              variant="outline"
            >
              Criar Exemplo
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-surface border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar templates por nome, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        {/* Category Tabs */}
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full bg-surface">
          {mappedCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Templates Grid */}
        {mappedCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                          {template.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.language}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-0 h-auto"
                          onClick={() => handleStarTemplate(template.id)}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </Button>
                        <span>{template.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{template.downloads}</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{template.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(template.updated_at || template.created_at || '').toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-surface rounded-lg p-3 border border-border">
                      <pre className="text-xs text-foreground overflow-x-auto">
                        <code>{template.code.split('\n').slice(0, 8).join('\n')}
                        {template.code.split('\n').length > 8 && '\n...'}
                        </code>
                      </pre>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyCode(template.code, template.id)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copySuccess ? 'Copiado!' : 'Copiar'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="col-span-1"
                        onClick={() => setViewingTemplate(template)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver Completo
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  {templates.length === 0 ? 'Nenhum template cadastrado' : 'Nenhum template encontrado'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {templates.length === 0 
                    ? 'Comece criando seu primeiro template de código ou use o botão "Criar Exemplo" para dados de teste.'
                    : 'Tente ajustar os filtros de categoria ou termo de busca.'
                  }
                </p>
                {templates.length === 0 && (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Template
                    </Button>
                    <Button onClick={createSampleData} variant="outline">
                      Criar Exemplo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold text-foreground">{templates.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mais Popular</p>
                <p className="text-2xl font-bold text-foreground">⭐ {templates.length > 0 ? Math.max(...templates.map(t => t.stars)) : 0}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloads Totais</p>
                <p className="text-2xl font-bold text-foreground">{templates.reduce((sum, t) => sum + t.downloads, 0)}</p>
              </div>
              <Download className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contribuidores</p>
                <p className="text-2xl font-bold text-foreground">{new Set(templates.map(t => t.author)).size}</p>
              </div>
              <User className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Ver Código Completo */}
      <Dialog open={!!viewingTemplate} onOpenChange={() => setViewingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              {viewingTemplate?.title}
            </DialogTitle>
          </DialogHeader>
          
          {viewingTemplate && (
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              {/* Informações do Template */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p className="text-sm">{viewingTemplate.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Linguagem</p>
                  <Badge variant="outline">{viewingTemplate.language}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Autor</p>
                  <p className="text-sm">{viewingTemplate.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tags</p>
                  <div className="flex gap-1 flex-wrap">
                    {viewingTemplate.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Código */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Código</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCode(viewingTemplate.code, viewingTemplate.id)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copySuccess ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
                <div className="relative flex-1 overflow-auto">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 border">
                    <code>{viewingTemplate.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal do Formulário - estilo consistente com ProfileDialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditingTemplate(null); }}}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          </DialogHeader>
          <WikiTemplateForm
            onSubmit={editingTemplate ? handleEditSubmit : handleCreateTemplate}
            onCancel={() => { setShowForm(false); setEditingTemplate(null); }}
            loading={formLoading}
            initialData={editingTemplate}
            isEditing={!!editingTemplate}
          />
        </DialogContent>
      </Dialog>

      {/* Toast de Sucesso */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Código copiado para clipboard!
        </div>
      )}
    </div>
  );
}