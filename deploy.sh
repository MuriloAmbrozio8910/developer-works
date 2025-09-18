#!/bin/bash

# Deploy Script para Vercel - Image Press
echo "🚀 Iniciando deploy do Image Press na Vercel..."

# Verificar se está logado na Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Você não está logado na Vercel. Execute: vercel login"
    exit 1
fi

# Verificar se as variáveis de ambiente estão configuradas
echo "🔧 Verificando variáveis de ambiente..."

if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Edite o arquivo .env com suas credenciais do Supabase antes de continuar."
        exit 1
    else
        echo "❌ Arquivo .env.example não encontrado."
        exit 1
    fi
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar verificações
echo "🔍 Executando verificações de código..."
npm run type-check
npm run lint

# Build local para testar
echo "🏗️  Fazendo build local para testes..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou. Corrija os erros antes de fazer deploy."
    exit 1
fi

# Deploy para produção
echo "🌐 Fazendo deploy para produção..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deploy realizado com sucesso!"
    echo "🎉 Sua aplicação está disponível na URL fornecida pela Vercel."
else
    echo "❌ Deploy falhou. Verifique os logs acima."
    exit 1
fi
