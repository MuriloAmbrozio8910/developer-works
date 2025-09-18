import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Client } from "@/lib/supabase";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase,
  X,
  Edit,
  Activity
} from "lucide-react";

interface ClientDetailProps {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
}

export function ClientDetail({ client, onClose, onEdit }: ClientDetailProps) {
  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              {client.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(client.status)} border`}>
                {client.status}
              </Badge>
              {client.company && (
                <Badge variant="outline">{client.company}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Foto e Informações Básicas */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto */}
            {client.photo && (
              <div className="flex-shrink-0">
                <img
                  src={client.photo}
                  alt={client.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-border"
                />
              </div>
            )}

            {/* Informações Básicas */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Contato:</span>
                  <span>{client.contact}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-primary hover:underline"
                  >
                    {client.email}
                  </a>
                </div>

                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Telefone:</span>
                    <a 
                      href={`tel:${client.phone}`}
                      className="text-primary hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}

                {client.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Localização:</span>
                    <span>{client.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Estatísticas do Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Projetos</p>
                    <p className="text-2xl font-bold text-blue-600">{client.projects_count}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">{client.total_value}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold text-purple-600">{client.status}</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Datas Importantes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Histórico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.join_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Data de Entrada:</span>
                  <span>{new Date(client.join_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}

              {client.last_contact && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Último Contato:</span>
                  <span>{new Date(client.last_contact).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Informações do Sistema */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Criado em:</span>{' '}
              {client.created_at ? new Date(client.created_at).toLocaleString('pt-BR') : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Atualizado em:</span>{' '}
              {client.updated_at ? new Date(client.updated_at).toLocaleString('pt-BR') : 'N/A'}
            </div>
          </div>

          {/* Ações Rápidas */}
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${client.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </a>
            </Button>
            
            {client.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${client.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </a>
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
