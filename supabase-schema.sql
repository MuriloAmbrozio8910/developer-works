-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  photo TEXT,
  company VARCHAR(255),
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  projects_count INTEGER DEFAULT 0,
  total_value VARCHAR(50) DEFAULT 'R$ 0',
  join_date DATE DEFAULT CURRENT_DATE,
  last_contact DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  assignee VARCHAR(255),
  priority VARCHAR(50) DEFAULT 'Média' CHECK (priority IN ('Baixa', 'Média', 'Alta')),
  type VARCHAR(100),
  deadline DATE,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  time_spent_seconds INTEGER DEFAULT 0, -- Tempo em segundos para precisão
  time_spent VARCHAR(50) DEFAULT '0h 0m', -- Formato legível
  estimated_time VARCHAR(50),
  estimated_time_seconds INTEGER DEFAULT 0, -- Tempo estimado em segundos
  is_running BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE, -- Quando o timer foi iniciado
  photos TEXT[], -- Array de URLs das fotos
  notes TEXT, -- Notas adicionais
  tags TEXT[], -- Tags da tarefa
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de log de atividades
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('success', 'info', 'warning', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo para clientes
INSERT INTO clients (name, contact, email, phone, photo, company, location, status, projects_count, total_value, join_date, last_contact) VALUES
('TechCorp Solutions', 'João Silva', 'joao@techcorp.com', '+55 11 99999-9999', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face', 'TechCorp', 'São Paulo, SP', 'Ativo', 3, 'R$ 45.000', '2023-06-15', '2024-01-10'),
('StartupXYZ', 'Maria Santos', 'maria@startupxyz.com', '+55 21 88888-8888', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face', 'StartupXYZ', 'Rio de Janeiro, RJ', 'Ativo', 2, 'R$ 28.000', '2023-08-22', '2024-01-08'),
('BigCompany Inc', 'Pedro Costa', 'pedro@bigcompany.com', '+55 31 77777-7777', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', 'BigCompany', 'Belo Horizonte, MG', 'Inativo', 5, 'R$ 120.000', '2023-03-10', '2023-12-15'),
('DesignStudio Creative', 'Ana Lima', 'ana@designstudio.com', '+55 85 66666-6666', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face', 'DesignStudio', 'Fortaleza, CE', 'Ativo', 1, 'R$ 15.000', '2023-11-05', '2024-01-12');

-- Inserir dados de exemplo para tarefas
INSERT INTO tasks (title, description, client_id, assignee, priority, type, deadline, status, time_spent_seconds, time_spent, estimated_time, estimated_time_seconds, is_running, photos, notes, tags) VALUES
('Implementar sistema de pagamento', 'Desenvolver integração com gateway de pagamento Stripe', 1, 'João Silva', 'Alta', 'Desenvolvimento', '2024-01-15', 'em_andamento', 16200, '4h 30m', '8h', 28800, true, ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400'], 'Integração com Stripe API v2. Implementar webhooks para confirmação de pagamento.', ARRAY['stripe', 'payment', 'api']),
('Correção de bugs no frontend', 'Corrigir problemas de responsividade e validação de formulários', 2, 'Maria Santos', 'Média', 'Bug Fix', '2024-01-18', 'pendente', 8100, '2h 15m', '4h', 14400, false, ARRAY['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400'], 'Focar em dispositivos móveis. Testar em diferentes resoluções.', ARRAY['frontend', 'responsive', 'forms']),
('Otimização de performance', 'Melhorar tempo de carregamento e otimizar consultas do banco', 3, 'Pedro Costa', 'Baixa', 'Otimização', '2024-01-25', 'concluida', 31500, '8h 45m', '8h', 28800, false, ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'], 'Implementar cache Redis. Otimizar queries N+1. Comprimir imagens.', ARRAY['performance', 'database', 'optimization']),
('Design de nova landing page', 'Criar layout responsivo e moderno para página inicial', 4, 'Ana Lima', 'Alta', 'Design', '2024-01-20', 'em_andamento', 22800, '6h 20m', '12h', 43200, false, ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400'], 'Seguir guidelines da marca. Usar cores primárias. Incluir call-to-actions.', ARRAY['design', 'landing', 'ui/ux']);

-- Criar tabela de recursos/ferramentas
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version VARCHAR(50),
  size VARCHAR(50),
  platform VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  downloads INTEGER DEFAULT 0,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias de recursos
CREATE TABLE IF NOT EXISTS resource_categories (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de links rápidos
CREATE TABLE IF NOT EXISTS quick_links (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(100),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de templates do Wiki
CREATE TABLE IF NOT EXISTS wiki_templates (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  language VARCHAR(100),
  author VARCHAR(255),
  stars INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  tags TEXT[], -- Array de strings para tags
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias do Wiki
CREATE TABLE IF NOT EXISTS wiki_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_templates_updated_at BEFORE UPDATE ON wiki_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo para categorias de recursos
INSERT INTO resource_categories (title, icon, color) VALUES
('Desenvolvimento', 'Code', 'text-blue-500'),
('Design', 'Palette', 'text-purple-500'),
('Produtividade', 'Settings', 'text-green-500'),
('Banco de Dados', 'Database', 'text-orange-500');

-- Inserir dados de exemplo para recursos
INSERT INTO resources (name, description, version, size, platform, category, rating, downloads, url) VALUES
('Visual Studio Code', 'Editor de código principal da empresa', '1.85.2', '95 MB', 'Windows/Mac/Linux', 'Desenvolvimento', 5, 1240, 'https://code.visualstudio.com/download'),
('Postman', 'Ferramenta para testes de API', '10.24.0', '158 MB', 'Windows/Mac/Linux', 'Desenvolvimento', 5, 890, 'https://www.postman.com/downloads/'),
('Git', 'Sistema de controle de versão', '2.43.0', '45 MB', 'Windows/Mac/Linux', 'Desenvolvimento', 5, 2100, 'https://git-scm.com/downloads'),
('Figma', 'Ferramenta de design colaborativo', 'Desktop App', '120 MB', 'Windows/Mac', 'Design', 5, 650, 'https://www.figma.com/downloads/'),
('Adobe Creative Suite', 'Pacote completo de ferramentas Adobe', '2024', '4.2 GB', 'Windows/Mac', 'Design', 4, 320, '#empresa-adobe'),
('Slack', 'Comunicação da equipe', '4.36.0', '175 MB', 'Windows/Mac/Mobile', 'Produtividade', 4, 1450, 'https://slack.com/downloads'),
('Notion', 'Organização e documentação', '3.1.0', '89 MB', 'Windows/Mac/Web', 'Produtividade', 5, 980, 'https://www.notion.so/desktop'),
('DBeaver', 'Cliente universal de banco de dados', '23.3.2', '98 MB', 'Windows/Mac/Linux', 'Banco de Dados', 4, 720, 'https://dbeaver.io/download/'),
('MongoDB Compass', 'GUI para MongoDB', '1.41.0', '125 MB', 'Windows/Mac/Linux', 'Banco de Dados', 4, 560, 'https://www.mongodb.com/products/compass');

-- Inserir dados de exemplo para links rápidos
INSERT INTO quick_links (title, description, icon, color, url) VALUES
('Manual do Funcionário', 'Guia completo para novos funcionários', 'FileText', 'text-blue-500', '#manual'),
('Políticas de Segurança', 'Diretrizes de segurança da empresa', 'Shield', 'text-red-500', '#security'),
('Configurações de Ambiente', 'Setup inicial do ambiente de desenvolvimento', 'Settings', 'text-green-500', '#setup');

-- Inserir dados de exemplo para categorias do Wiki
INSERT INTO wiki_categories (name, icon, count) VALUES
('Todos', 'BookOpen', 4),
('Frontend', 'Globe', 2),
('Backend', 'Database', 2),
('Design', 'Palette', 0),
('Mobile', 'Code', 0),
('DevOps', 'FileText', 0);

-- Inserir dados de exemplo para templates do Wiki
INSERT INTO wiki_templates (title, description, category, language, author, stars, downloads, tags, code) VALUES
('Componente React com TypeScript', 'Template base para criar componentes React funcionais com TypeScript, props tipadas e exportação padrão', 'frontend', 'TypeScript', 'João Silva', 15, 89, ARRAY['react', 'typescript', 'component', 'props'], 'import React from ''react'';

interface ComponentProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  subtitle,
  className = ''''
}) => {
  return (
    <div className={`component-container ${className}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default Component;'),

('API Route Express.js', 'Template para criar rotas RESTful com Express.js, validação de dados e tratamento de erros', 'backend', 'JavaScript', 'Maria Santos', 12, 67, ARRAY['express', 'api', 'rest', 'validation'], 'const express = require(''express'');
const router = express.Router();

// GET /api/resource
router.get(''/'', async (req, res) => {
  try {
    // Implementar lógica aqui
    const data = await fetchData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/resource
router.post(''/'', async (req, res) => {
  try {
    const { body } = req;
    // Validar dados
    const result = await createResource(body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;'),

('Hook Customizado React', 'Template para criar hooks customizados com TypeScript, estados locais e efeitos', 'frontend', 'TypeScript', 'Pedro Costa', 8, 45, ARRAY['react', 'hooks', 'custom', 'typescript'], 'import { useState, useEffect } from ''react'';

interface UseCustomHookOptions {
  initialValue?: string;
  autoReset?: boolean;
}

interface UseCustomHookReturn {
  value: string;
  setValue: (value: string) => void;
  reset: () => void;
  loading: boolean;
}

export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  const { initialValue = '''', autoReset = false } = options;
  
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setValue(initialValue);
  };

  useEffect(() => {
    if (autoReset) {
      const timer = setTimeout(reset, 5000);
      return () => clearTimeout(timer);
    }
  }, [value, autoReset]);

  return {
    value,
    setValue,
    reset,
    loading
  };
};'),

('Esquema de Validação Zod', 'Template para validação de dados com Zod, incluindo schemas aninhados e mensagens personalizadas', 'backend', 'TypeScript', 'Ana Lima', 10, 52, ARRAY['zod', 'validation', 'schema', 'typescript'], 'import { z } from ''zod'';

// Schema básico
export const UserSchema = z.object({
  id: z.string().uuid(''ID deve ser um UUID válido''),
  name: z.string()
    .min(2, ''Nome deve ter pelo menos 2 caracteres'')
    .max(50, ''Nome deve ter no máximo 50 caracteres''),
  email: z.string().email(''Email deve ser válido''),
  age: z.number()
    .int(''Idade deve ser um número inteiro'')
    .min(18, ''Idade mínima é 18 anos'')
    .max(100, ''Idade máxima é 100 anos''),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

// Schema para criação (sem ID)
export const CreateUserSchema = UserSchema.omit({ id: true });

// Schema para atualização (todos opcionais)
export const UpdateUserSchema = UserSchema.partial();

// Tipos TypeScript
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;');

-- Inserir dados de exemplo para log de atividades
INSERT INTO activity_logs (action, details, type) VALUES
('Tarefa concluída', 'Sistema de pagamento - TechCorp', 'success'),
('Novo cliente cadastrado', 'StartupXYZ adicionada ao sistema', 'info'),
('Prazo alterado', 'Otimização de performance - BigCompany', 'warning'),
('Template adicionado', 'Novo template React no Wiki', 'info');

-- Habilitar RLS (Row Level Security) - opcional, mas recomendado
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_categories ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas (permitir tudo por enquanto - ajuste conforme necessário)
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_logs" ON activity_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on resources" ON resources FOR ALL USING (true);
CREATE POLICY "Allow all operations on resource_categories" ON resource_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on quick_links" ON quick_links FOR ALL USING (true);
CREATE POLICY "Allow all operations on wiki_templates" ON wiki_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on wiki_categories" ON wiki_categories FOR ALL USING (true);
