# Configuração do Supabase - Red Forge Hub

Este guia irá ajudá-lo a configurar o Supabase para o projeto Red Forge Hub, migrando de dados hardcoded para um banco de dados real.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto Red Forge Hub clonado

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Preencha:
   - **Name**: `red-forge-hub` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America)
5. Clique em "Create new project"
6. Aguarde alguns minutos para o projeto ser criado

### 2. Obter Credenciais

1. No dashboard do seu projeto Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public key** (chave pública)

### 3. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

### 4. Criar Tabelas no Banco de Dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql` e cole no editor
4. Clique em "Run" para executar o script
5. Verifique se as tabelas foram criadas em **Table Editor**

### 5. Instalar Dependências

Se ainda não instalou, execute:
```bash
npm install
```

### 6. Executar o Projeto

```bash
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Tabela `clients`
- `id`: Identificador único
- `name`: Nome da empresa/cliente
- `contact`: Nome do contato principal
- `email`: Email do contato
- `phone`: Telefone
- `photo`: URL da foto do contato
- `company`: Nome da empresa
- `location`: Localização
- `status`: Status (Ativo/Inativo)
- `projects_count`: Número de projetos
- `total_value`: Valor total dos projetos
- `join_date`: Data de cadastro
- `last_contact`: Data do último contato

### Tabela `tasks`
- `id`: Identificador único
- `title`: Título da tarefa
- `description`: Descrição detalhada
- `client_id`: Referência ao cliente (FK)
- `assignee`: Responsável pela tarefa
- `priority`: Prioridade (Alta/Média/Baixa)
- `type`: Tipo da tarefa
- `deadline`: Prazo de entrega
- `status`: Status (pendente/em_andamento/concluida)
- `time_spent`: Tempo gasto
- `estimated_time`: Tempo estimado
- `is_running`: Se o timer está ativo

### Tabela `activity_logs`
- `id`: Identificador único
- `action`: Ação realizada
- `details`: Detalhes da ação
- `type`: Tipo (success/info/warning/error)
- `created_at`: Data/hora da ação

## 🔧 Funcionalidades Implementadas

### ✅ Clientes
- ✅ Listagem de clientes
- ✅ Filtro de pesquisa
- ✅ Estatísticas dinâmicas
- ✅ Exclusão de clientes
- ✅ Estados de loading e erro

### ✅ Tarefas
- ✅ Listagem de tarefas
- ✅ Filtros por prioridade
- ✅ Timer de tarefas
- ✅ Relacionamento com clientes
- ✅ Estados de loading e erro

### ✅ Dashboard
- ✅ Estatísticas em tempo real
- ✅ Tarefas recentes
- ✅ Log de atividades
- ✅ Cálculos dinâmicos

### ✅ Resources
- ✅ Listagem de recursos/ferramentas
- ✅ Categorização dinâmica
- ✅ Links rápidos
- ✅ Contador de downloads
- ✅ Filtro de pesquisa
- ✅ Estados de loading e erro

### ✅ Wiki
- ✅ Templates de código
- ✅ Categorização por tecnologia
- ✅ Sistema de estrelas
- ✅ Contador de downloads
- ✅ Cópia para clipboard
- ✅ Filtros e busca
- ✅ Estatísticas dinâmicas

## 🛠️ Hooks Personalizados

### `useClients()`
```typescript
const { clients, loading, error, addClient, updateClient, deleteClient, refetch } = useClients();
```

### `useTasks()`
```typescript
const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTimer, refetch } = useTasks();
```

### `useActivityLog()`
```typescript
const { activities, loading, error, addActivity, refetch } = useActivityLog();
```

### `useResources()`
```typescript
const { resources, categories, quickLinks, loading, error, addResource, updateResource, deleteResource, incrementDownloads, refetch } = useResources();
```

### `useWiki()`
```typescript
const { templates, categories, loading, error, addTemplate, updateTemplate, deleteTemplate, incrementStars, incrementDownloads, copyToClipboard, refetch } = useWiki();
```

## 🔐 Segurança

O projeto está configurado com Row Level Security (RLS) básico. Para produção, considere:

1. Configurar políticas de RLS mais restritivas
2. Implementar autenticação de usuários
3. Definir permissões por usuário/role

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe e contém as variáveis corretas
- Reinicie o servidor de desenvolvimento após criar/editar o `.env`

### Erro: "Failed to fetch"
- Verifique se a URL do Supabase está correta
- Confirme se o projeto Supabase está ativo
- Verifique sua conexão com a internet

### Tabelas não aparecem
- Execute novamente o script SQL no Supabase
- Verifique se não há erros no SQL Editor
- Confirme se está no projeto correto

## 📝 Próximos Passos

1. **Implementar CRUD completo**: Adicionar formulários para criar/editar clientes e tarefas
2. **Autenticação**: Implementar login/logout de usuários
3. **Relatórios**: Criar páginas de relatórios e analytics
4. **Notificações**: Implementar sistema de notificações em tempo real
5. **Upload de arquivos**: Permitir upload de documentos e imagens

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

**Nota**: Este projeto migrou de dados hardcoded para Supabase. Todos os dados manuais foram substituídos por consultas dinâmicas ao banco de dados.
