import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Client } from "@/lib/supabase";
import { Plus, Building2 } from "lucide-react";

interface ClientFormProps {
  onSubmit: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Client | null;
  isEditing?: boolean;
}

export function ClientForm({ onSubmit, onCancel, loading = false, initialData, isEditing = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    photo: '',
    company: '',
    location: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    projects_count: 0,
    total_value: '',
    join_date: '',
    last_contact: ''
  });

  // Preencher formulário quando editando
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        contact: initialData.contact || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        photo: initialData.photo || '',
        company: initialData.company || '',
        location: initialData.location || '',
        status: initialData.status || 'Ativo',
        projects_count: initialData.projects_count || 0,
        total_value: initialData.total_value || '',
        join_date: initialData.join_date || '',
        last_contact: initialData.last_contact || ''
      });
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo,
      company: formData.company,
      location: formData.location,
      status: formData.status,
      projects_count: formData.projects_count,
      total_value: formData.total_value,
      join_date: formData.join_date,
      last_contact: formData.last_contact
    };

    onSubmit(clientData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[840px] overflow-y-scroll">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Empresa */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome da empresa"
              required
            />
          </div>

          {/* Contato Principal e Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contato Principal *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="Nome do contato"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@empresa.com"
                required
              />
            </div>
          </div>

          {/* Telefone e Foto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Foto (URL)</Label>
              <Input
                id="photo"
                value={formData.photo}
                onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
          </div>

          {/* Preview da Foto */}
          {formData.photo && (
            <div className="space-y-2">
              <Label>Preview da Foto</Label>
              <div className="w-20 h-20 rounded-full overflow-hidden border">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Empresa e Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Cidade, Estado"
              />
            </div>
          </div>

          {/* Status e Projetos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'Ativo' | 'Inativo') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projects_count">Número de Projetos</Label>
              <Input
                id="projects_count"
                type="number"
                min="0"
                value={formData.projects_count}
                onChange={(e) => setFormData(prev => ({ ...prev, projects_count: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Valor Total */}
          <div className="space-y-2">
            <Label htmlFor="total_value">Valor Total dos Projetos</Label>
            <Input
              id="total_value"
              value={formData.total_value}
              onChange={(e) => setFormData(prev => ({ ...prev, total_value: e.target.value }))}
              placeholder="R$ 50.000"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="join_date">Data de Entrada</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_contact">Último Contato</Label>
              <Input
                id="last_contact"
                type="date"
                value={formData.last_contact}
                onChange={(e) => setFormData(prev => ({ ...prev, last_contact: e.target.value }))}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Cliente')}
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
