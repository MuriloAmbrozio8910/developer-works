import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading, ErrorState, EmptyState } from "@/components/ui/loading";
import { useResources } from "@/hooks/useResources";
import {
  Download,
  Search,
  ExternalLink,
  Smartphone,
  Monitor,
  Code,
  Palette,
  Settings,
  FileText,
  Database,
  Shield,
  Star,
  Clock
} from "lucide-react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const { resources, categories, quickLinks, loading, error, incrementDownloads } = useResources();

  const handleDownload = async (resource: (typeof resources)[number]) => {
    try {
      await incrementDownloads(resource.id);
      window.open(resource.url, '_blank');
    } catch (error) {
      console.error('Erro ao incrementar downloads:', error);
      window.open(resource.url, '_blank');
    }
  };

  // Agrupar recursos por categoria
  const resourceCategories = categories.map(category => ({
    title: category.title,
    icon: getIconByName(category.icon),
    color: category.color,
    resources: resources.filter(resource => resource.category === category.title)
  }));

  // Filtrar recursos por pesquisa
  const filteredCategories = resourceCategories.map(category => ({
    ...category,
    resources: category.resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.resources.length > 0);

  function getIconByName(iconName: string) {
    const icons: Record<string, LucideIcon> = {
      Code,
      Palette,
      Settings,
      Database,
      FileText,
      Shield
    };
    return icons[iconName] || Settings;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  if (loading) {
    return <Loading message="Carregando recursos..." />;
  }

  if (error) {
    return <ErrorState message={`Erro ao carregar recursos: ${error}`} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recursos</h1>
          <p className="text-muted-foreground">Ferramentas e aplicativos essenciais para a equipe</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Última atualização: hoje</span>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-gradient-surface border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar ferramentas e recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = getIconByName(link.icon);
          return (
            <Card key={index} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Icon className={`w-5 h-5 text-white`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {link.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resource Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <CategoryIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.resources.length} ferramentas disponíveis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {category.resources.map((resource, resourceIndex) => (
                  <Card key={resourceIndex} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                            {resource.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          v{resource.version}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(resource.rating)}
                        </div>
                        <span className="text-xs text-muted-foreground">({resource.downloads} downloads)</span>
                      </div>

                      {/* Resource Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tamanho:</span>
                          <span className="text-foreground">{resource.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plataforma:</span>
                          <span className="text-foreground text-xs">{resource.platform}</span>
                        </div>
                      </div>

                      {/* Platform Icons */}
                      <div className="flex gap-2">
                        {resource.platform.includes('Windows') && (
                          <div className="w-6 h-6 rounded bg-surface flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        {resource.platform.includes('Mac') && (
                          <div className="w-6 h-6 rounded bg-surface flex items-center justify-center">
                            <Monitor className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        {resource.platform.includes('Mobile') && (
                          <div className="w-6 h-6 rounded bg-surface flex items-center justify-center">
                            <Smartphone className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Download Button */}
                      <Button
                        className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-200"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <EmptyState
            icon={Search}
            title="Nenhum recurso encontrado"
            description="Tente ajustar a pesquisa ou verifique se há recursos cadastrados."
          />
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-surface border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5 text-primary" />
            Precisa de Ajuda?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Para Novos Funcionários</h4>
              <p className="text-sm text-muted-foreground">
                Se você é novo na empresa, recomendamos começar com o Manual do Funcionário
                e seguir o guia de Configurações de Ambiente.
              </p>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Ver Guia de Iniciação
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Suporte Técnico</h4>
              <p className="text-sm text-muted-foreground">
                Problemas com instalação ou configuração? Entre em contato com nossa
                equipe de TI pelo Slack ou email.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contatar TI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
