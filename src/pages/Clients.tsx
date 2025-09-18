import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading, ErrorState, EmptyState } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "@/components/ClientForm";
import { ClientDetail } from "@/components/ClientDetail";
import { useClients } from "@/hooks/useClients";
import { type Client } from "@/lib/supabase";
import { 
  Search, 
  Plus, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Trash2,
  Users,
  Eye,
  Edit
} from "lucide-react";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { clients, loading, error, addClient, updateClient, deleteClient } = useClients();

  const handleDeleteClient = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      }
    }
  };

  const handleCreateClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setFormLoading(true);
      await addClient(clientData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleEditSubmit = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingClient) return;
    
    try {
      setFormLoading(true);
      await updateClient(editingClient.id, clientData);
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading message="Carregando clientes..." />;
  }

  if (error) {
    return <ErrorState message={`Erro ao carregar clientes: ${error}`} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e informações de contato</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:shadow-glow transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-surface border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar clientes por nome, empresa ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold text-foreground">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.filter(c => c.status === 'Ativo').length}
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projetos Ativos</p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.reduce((sum, client) => sum + client.projects_count, 0)}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-surface border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {clients.reduce((sum, client) => 
                    sum + parseInt(client.total_value.replace(/\D/g, '')), 0
                  ).toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-gradient-surface border-border hover:shadow-card transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={client.photo} 
                    alt={client.contact}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                      {client.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{client.contact}</p>
                  </div>
                </div>
                
                <Badge className={`${getStatusBadge(client.status)} border text-xs`}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{client.location}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Projetos</p>
                  <p className="text-lg font-semibold text-foreground">{client.projects_count}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-semibold text-foreground">{client.total_value}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Cliente desde:</span>
                  <span>{new Date(client.join_date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Último contato:</span>
                  <span>{new Date(client.last_contact).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewClient(client)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditClient(client)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  onClick={() => handleDeleteClient(client.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Tente ajustar a pesquisa ou adicionar um novo cliente."
        />
      )}

      {/* Modal do Formulário - estilo consistente com ProfileDialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); setEditingClient(null); }}}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <ClientForm
            onSubmit={editingClient ? handleEditSubmit : handleCreateClient}
            onCancel={() => { setShowForm(false); setEditingClient(null); }}
            loading={formLoading}
            initialData={editingClient}
            isEditing={!!editingClient}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização */}
      {selectedClient && (
        <ClientDetail
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={() => {
            setEditingClient(selectedClient);
            setSelectedClient(null);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}