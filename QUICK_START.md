# 🚀 Quick Start - Red Forge Hub com Supabase

## ⚡ Configuração Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Supabase
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
4. Edite o `.env` com suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3. Criar Tabelas
1. No Supabase Dashboard, vá para **SQL Editor**
2. Execute o conteúdo do arquivo `supabase-schema.sql`

### 4. Executar o Projeto
```bash
npm run dev
```

## ✅ O que foi implementado

- ✅ **Clientes**: CRUD completo com Supabase
- ✅ **Tarefas**: Gerenciamento com timer e relacionamentos
- ✅ **Dashboard**: Estatísticas em tempo real
- ✅ **Resources**: Catálogo de ferramentas com downloads
- ✅ **Wiki**: Templates de código com sistema de estrelas
- ✅ **Loading States**: UX melhorada
- ✅ **Error Handling**: Tratamento de erros
- ✅ **TypeScript**: Tipagem completa

## 📁 Estrutura dos Hooks

```typescript
// Clientes
const { clients, loading, error, addClient, updateClient, deleteClient } = useClients();

// Tarefas  
const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTimer } = useTasks();

// Atividades
const { activities, loading, error, addActivity } = useActivityLog();

// Resources
const { resources, categories, quickLinks, loading, error, incrementDownloads } = useResources();

// Wiki
const { templates, categories, loading, error, incrementStars, copyToClipboard } = useWiki();
```

## 🎯 Próximos Passos

1. **Formulários**: Implementar criação/edição de clientes e tarefas
2. **Autenticação**: Adicionar login/logout
3. **Relatórios**: Criar dashboards avançados
4. **Real-time**: Implementar updates em tempo real

---

**Documentação completa**: Veja `SUPABASE_SETUP.md` para instruções detalhadas.
