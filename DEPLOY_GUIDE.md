# 🚀 Guia Completo de Deploy - Image Press

## ✅ Pré-requisitos

- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Node.js 18+ instalado
- [ ] Git configurado

## 📋 Checklist de Deploy

### 1. Configuração do Supabase

- [ ] Criar projeto no Supabase
- [ ] Executar o arquivo `supabase-schema.sql` no SQL Editor
- [ ] Anotar URL e chave anônima do projeto
- [ ] Verificar se as tabelas foram criadas corretamente

### 2. Configuração Local

- [ ] Clonar o repositório
- [ ] Executar `npm install`
- [ ] Copiar `.env.example` para `.env`
- [ ] Configurar variáveis de ambiente no `.env`
- [ ] Testar localmente com `npm run dev`

### 3. Deploy na Vercel

#### Opção A: Deploy Automático (Recomendado)

1. **Conectar Repositório**:
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Conecte sua conta do GitHub
   - Selecione o repositório do projeto

2. **Configurar Projeto**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variáveis de Ambiente**:
   ```
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

4. **Deploy**: Clique em "Deploy"

#### Opção B: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login na Vercel
vercel login

# 3. Deploy
./deploy.sh
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | `eyJhbGciOiJIUzI1NiIs...` |

### Configurações de Build

- **Framework**: Vite
- **Node Version**: 18.x
- **Build Command**: `tsc && vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🚨 Troubleshooting

### Erro de Build

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro de Variáveis de Ambiente

1. Verificar se as variáveis estão configuradas na Vercel
2. Verificar se os nomes estão corretos (com prefixo `VITE_`)
3. Redeployar após configurar

### Erro de Supabase

1. Verificar se a URL e chave estão corretas
2. Verificar se o projeto Supabase está ativo
3. Verificar se as tabelas foram criadas

## 📊 Métricas de Performance

Após o deploy, o projeto deve ter:

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## 🔄 CI/CD Automático

O projeto está configurado para:

- ✅ Deploy automático a cada push na branch `main`
- ✅ Preview deployments para PRs
- ✅ Otimizações automáticas de performance
- ✅ Cache inteligente de assets

## 🌐 Domínio Customizado

Para configurar um domínio próprio:

1. Acesse o projeto na Vercel
2. Vá em **Settings** > **Domains**
3. Adicione seu domínio
4. Configure os DNS conforme instruções

## 📈 Monitoramento

Após o deploy, monitore:

- **Vercel Analytics**: Métricas de performance
- **Supabase Dashboard**: Uso do banco de dados
- **Browser DevTools**: Erros no console

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. [ ] Configurar domínio customizado
2. [ ] Configurar monitoramento de erros
3. [ ] Configurar backup do banco de dados
4. [ ] Documentar APIs e endpoints
5. [ ] Configurar testes automatizados

---

## 📞 Suporte

Em caso de problemas:

1. Verificar logs na Vercel Dashboard
2. Verificar logs no Supabase Dashboard
3. Consultar documentação oficial
4. Abrir issue no repositório
