# Developer Works

Aplicação para organizar clientes, tarefas e materiais de uma equipe de desenvolvimento. O frontend usa React, TypeScript e Vite, com componentes Radix/shadcn e Tailwind. Autenticação, dados e fotos de perfil ficam no Supabase.

O código inclui cadastro de clientes, responsáveis por tarefas, cronômetro de trabalho, registros de atividade, recursos e uma wiki com editor de texto. O workspace é compartilhado pela equipe; não há isolamento entre empresas ou organizações.

## Rodar

Use Node.js 20 ou superior. Instale com `npm ci`, copie `.env.example` para `.env` e configure a URL e uma chave publicável do seu Supabase. A chave legada anon também é aceita. Nunca use service_role ou uma chave secreta em variáveis `VITE_`, porque elas entram no código enviado ao navegador.

Em um projeto Supabase vazio de teste, execute `supabase-schema.sql`. Ele cria as tabelas sem dados de clientes e restringe o acesso aos integrantes autorizados do workspace.

Crie os usuários pelo Supabase Auth e, usando uma conta administrativa no servidor ou o Dashboard, configure `app_metadata.workspace_access` como `true` para os integrantes da equipe. Isso não pode ser feito pelo próprio usuário no frontend. Atualize a sessão após mudar a autorização. Cadastro por si só não concede acesso aos dados.

```sh
npm run dev
npm run build
npm run type-check
```

Na hospedagem, configure as mesmas variáveis e habilite o fallback de rotas da SPA. `vercel.json` já contém essa configuração.

## Organização e limites

`src/pages/` contém as telas; `src/hooks/` reúne consultas e alterações; `src/lib/supabase.ts` declara o cliente e os tipos. A área de recursos e wiki depende das tabelas do schema. Avatares enviados ao bucket `avatars` são públicos; não envie documentos pessoais para esse bucket.

O schema é um setup inicial, não um script para sobrescrever políticas de um banco existente. Antes de usar clientes reais, revise permissões e teste o acesso de um usuário autorizado, de um usuário sem autorização e de um visitante. As alterações neste repositório não atualizam um banco já implantado.

O upload de imagens do editor também depende de um bucket `rte-images`, que não é criado pelo schema inicial. Configure permissões específicas antes de habilitar esse recurso.
