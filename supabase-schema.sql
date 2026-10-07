-- Setup inicial para um workspace compartilhado, sem dados de clientes.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

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

CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT, -- opcional: pode referenciar auth.users se desejar
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  assignee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('success', 'info', 'warning', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS resource_categories (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quick_links (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(100),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS wiki_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE IF EXISTS tasks
  ADD COLUMN IF NOT EXISTS assignee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

ALTER TABLE wiki_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE wiki_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_templates_updated_at BEFORE UPDATE ON wiki_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Avatars are intentionally public images; application data stays private.
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

REVOKE ALL ON public.clients FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
CREATE POLICY "Workspace members manage clients" ON public.clients FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.tasks FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
CREATE POLICY "Workspace members manage tasks" ON public.tasks FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.activity_logs FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO authenticated;
CREATE POLICY "Workspace members manage activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.resources FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
CREATE POLICY "Workspace members manage resources" ON public.resources FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.resource_categories FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_categories TO authenticated;
CREATE POLICY "Workspace members manage resource_categories" ON public.resource_categories FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.quick_links FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quick_links TO authenticated;
CREATE POLICY "Workspace members manage quick_links" ON public.quick_links FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.wiki_templates FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wiki_templates TO authenticated;
CREATE POLICY "Workspace members manage wiki_templates" ON public.wiki_templates FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.wiki_categories FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wiki_categories TO authenticated;
CREATE POLICY "Workspace members manage wiki_categories" ON public.wiki_categories FOR ALL TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true') WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');

REVOKE ALL ON public.employees FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
CREATE POLICY "Workspace members read employees" ON public.employees FOR SELECT TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true');
CREATE POLICY "Members create their profile" ON public.employees FOR INSERT TO authenticated WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND user_id = (select auth.uid())::text);
CREATE POLICY "Members update their profile" ON public.employees FOR UPDATE TO authenticated USING (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND user_id = (select auth.uid())::text) WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND user_id = (select auth.uid())::text);

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

CREATE POLICY "Public read on avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Members upload their avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND ((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND (storage.foldername(name))[1] = (select auth.uid())::text);
CREATE POLICY "Members update their avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND ((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND (storage.foldername(name))[1] = (select auth.uid())::text) WITH CHECK (bucket_id = 'avatars' AND ((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND (storage.foldername(name))[1] = (select auth.uid())::text);
CREATE POLICY "Members delete their avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND ((select auth.jwt()) -> 'app_metadata' ->> 'workspace_access') = 'true' AND (storage.foldername(name))[1] = (select auth.uid())::text);
