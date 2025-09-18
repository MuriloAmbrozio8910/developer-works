# Image Press

**Plataforma de Gestão de Desenvolvimento**

Uma aplicação moderna e completa para gerenciamento de projetos, clientes, tarefas e recursos de desenvolvimento, construída com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Visão geral com métricas em tempo real
- **Gestão de Clientes**: Cadastro e acompanhamento completo de clientes
- **Sistema de Tarefas**: Criação, edição e controle de tarefas com timer integrado
- **Wiki de Códigos**: Repositório de templates e códigos reutilizáveis
- **Catálogo de Recursos**: Organização de ferramentas e tecnologias
- **Log de Atividades**: Histórico completo de ações do sistema
- **Interface Responsiva**: Design moderno com tema escuro/claro

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **UI/UX**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Deploy**: Vercel

## 📦 Instalação Local

```bash
# 1. Clone o repositório
git clone <repository-url>
cd image-press

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 4. Execute o projeto em desenvolvimento
npm run dev
```

## 🌐 Deploy na Vercel

### Método 1: Deploy Automático via GitHub

1. **Fork/Clone este repositório**
2. **Conecte com a Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
3. **Configure as variáveis de ambiente**:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase
4. **Deploy**: A Vercel fará o build e deploy automaticamente

### Método 2: Deploy via CLI

```bash
# 1. Instale a CLI da Vercel
npm i -g vercel

# 2. Faça login na Vercel
vercel login

# 3. Configure o projeto
vercel

# 4. Configure as variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 5. Deploy para produção
vercel --prod
```

## ⚙️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto

### 2. Executar Schema SQL

Execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase para criar:
- Tabelas (clients, tasks, activity_logs, wiki_templates, etc.)
- Dados de exemplo
- Políticas de segurança (RLS)

### 3. Configurar Variáveis de Ambiente

```bash
# No arquivo .env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── forms/          # Formulários específicos
├── hooks/              # Hooks customizados
├── lib/                # Configurações e utilitários
├── pages/              # Páginas da aplicação
└── types/              # Definições de tipos TypeScript
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint
npm run type-check   # Verificar tipos TypeScript
```

## 🚀 Otimizações para Produção

- **Code Splitting**: Chunks otimizados por funcionalidade
- **Tree Shaking**: Remoção de código não utilizado
- **Minificação**: Compressão com esbuild
- **Cache**: Headers de cache otimizados
- **Lazy Loading**: Carregamento sob demanda de componentes

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.
