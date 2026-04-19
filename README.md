# PediAi - Cardápio Digital para Restaurantes

> Transforme o cardápio do seu restaurante em uma experiência digital moderna e receba pedidos diretamente pelo WhatsApp. **Zero comissão nos seus pedidos.**

---

## O que é o PediAi?

O PediAi é um **SaaS multi-tenant** de cardápio digital que permite restaurantes criarem seus cardápios online de forma simples, sem mensalidades caras ou apps complexos.

**Problema que resolve:** Muitos restaurantes ainda trabalham com cardápios físicos ou precisam pagar comissões altas para apps de delivery. O PediAi oferece uma alternativa onde o cliente acessa o cardápio pelo link, escolhe os itens e faz o pedido - tudo via WhatsApp, sem intermediários.

---

## Para quem é?

- **Restaurantes pequenos e médios** que querem digitalizar o cardápio
- **Bares, lanchonetes, pizzarias** que recebem pedidos por WhatsApp
- **Donos de restaurante** que não querem pagar comissões de delivery
- **Gerentes de restaurant chains** que precisam de controle multi-tenant

---

## Stack Tecnológica

| Tecnologia | Versão |
|------------|--------|
| Next.js | 16.2.3 |
| React | 19 |
| TypeScript | strict |
| Tailwind CSS | 4 |
| Supabase | - |

---

## Features Implementadas

### Para o Dono do Restaurante (Painel Admin)

- ✅ **Criar conta e gerenciar seu restaurante** em minutos
- ✅ **Cadastrar categorias** (ex: Bebidas, Pratos Principais, Sobremesas)
- ✅ **Cadastrar produtos** com nome, preço, descrição e foto
- ✅ **Ativar/desativar produtos** sem deletar (ex: produto do dia)
- ✅ **Ver todos os pedidos** recebidos em tempo real
- ✅ **Confirmar ou cancelar pedidos** com um clique
- ✅ **Editar informações** do restaurante (nome, WhatsApp)
- ✅ **Copiar link do cardápio** para compartilhar com clientes

### Para o Cliente (Cardápio Público)

- ✅ **Acessar o cardápio** pelo link sem precisar instalar nada
- ✅ **Ver produtos organizados por categoria** (ex: Bebidas, Pratos)
- ✅ **Ver foto, nome, preço e descrição** de cada produto
- ✅ **Adicionar itens ao carrinho** e escolher quantidade
- ✅ **Fazer o pedido** preenchendo nome e WhatsApp
- ✅ **Escolher forma de pagamento** (PIX, Dinheiro, Cartão)
- ✅ **Receber confirmação** e ser redirecionado para o WhatsApp do restaurante

### Infraestrutura

- ✅ **Arquitetura multi-tenant** isolada por `restaurant_id`
- ✅ **Design mobile-first** responsivo
- ✅ **Offline-first** - carrinho persiste em localStorage
- ✅ **Service Worker** para cache e funcionamento offline
- ✅ **PWA ready** com manifest.json

---

## Como funciona (Fluxo Simples)

```
Dono do Restaurante                    Cliente
─────────────────────                  ────────
1. Cria conta no admin                 │
2. Cadastra categorias                  │
3. Cadastra produtos                    │
4. Copia link do cardápio               │
        │                              │
        └──────────────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Cliente acessa     │
        │  /menu/bar-do-joao  │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Vê o cardápio      │
        │  escolhe produtos   │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Preenche nome,     │
        │  WhatsApp e paga    │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Pedido criado!     │
        │  Notificação no     │
        │  WhatsApp do dono   │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Cliente vai para   │
        │  WhatsApp confirmar │
        └─────────────────────┘
```

---

## Como começar

### Para desenvolvedores

```bash
# Clone o projeto
git clone https://github.com/b3ll3o/restaurante-app.git
cd restaurante

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o schema do banco de dados no Supabase
# (Copie o conteúdo de supabase/schema.sql para o SQL Editor do Supabase)

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de ambiente necessárias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto no Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase |
| `WHATSAPP_TOKEN` | Token do WhatsApp Business (opcional) |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do telefone WhatsApp (opcional) |

### Sem configuração do WhatsApp

O sistema funciona **sem** configurar o WhatsApp Business. O cliente será redirecionado para o WhatsApp do restaurante, mas a notificação automática não será enviada.

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Inicia servidor de produção

# Qualidade de código
npm run lint             # Verifica ESLint
npm run lint:fix         # Corrige problemas de lint automaticamente

# Testes
npm run test             # Executa todos os testes unitários
npm run test:unit         # Executa testes unitários
npm run test:integration  # Executa testes de integração
npm run test:e2e          # Executa testes E2E (Playwright)
npm run test:e2e:ui       # Executa testes E2E com UI interativa
npm run test:coverage     # Executa testes com cobertura de código
npm run test:watch        # Executa testes em modo watch

# Geração de relatórios
npm run test:coverage:e2e # Gera relatório de cobertura E2E
```

---

## Estrutura do Projeto

```
restaurante/
├── app/                    # Rotas da aplicação (Next.js App Router)
│   ├── admin/             # Painel do dono do restaurante
│   │   ├── auth/          # Callback de autenticação
│   │   ├── login/         # Página de login
│   │   ├── signup/        # Página de cadastro
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── categories/    # Gerenciar categorias
│   │   ├── products/      # Gerenciar produtos
│   │   ├── orders/        # Ver pedidos
│   │   └── settings/       # Configurações do restaurante
│   ├── menu/[slug]/       # Cardápio público (ex: /menu/bar-do-joao)
│   ├── landing/           # Landing pages segmentadas
│   │   ├── pizzaria/
│   │   ├── hamburgueria/
│   │   ├── bar/
│   │   └── restaurante/
│   └── api/               # API Routes
│       └── orders/        # Endpoint de criação de pedidos
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── admin/            # Componentes do painel admin
│   └── landing/          # Componentes da landing page
├── lib/                   # Funções e utilitários
│   ├── supabase/         # Clientes Supabase (client/server)
│   ├── schemas/          # Zod schemas para validação
│   ├── whatsapp.ts       # Integração com WhatsApp
│   ├── utils.ts          # Funções utilitárias
│   └── result.ts         # Tipo Result/Either
├── context/               # Contextos React
│   └── cart-context.tsx  # Gerenciamento do carrinho
├── hooks/                 # Custom hooks
│   └── useOnlineStatus.ts # Hook de status de conexão
├── types/                 # Definições TypeScript
├── tests/                 # Testes automatizados
│   ├── unit/             # Testes unitários (Vitest)
│   ├── integration/      # Testes de integração
│   └── e2e/              # Testes E2E (Playwright)
├── supabase/              # Schema do banco de dados
│   ├── schema.sql        # Schema completo
│   └── migrations/        # Migrations versionadas
├── opencode/              # Documentação e regras IA
│   ├── rules/            # Regras centralizadas
│   ├── specs/            # Especificações SDD
│   └── changes/          # Mudanças em andamento
├── public/                # Arquivos públicos
│   ├── sw.js             # Service Worker
│   └── manifest.json     # PWA manifest
└── scripts/               # Scripts utilitários
```

---

## Arquitetura

### Multi-Tenant

Cada restaurante é um tenant isolado por `restaurant_id`. O Row Level Security (RLS) do Supabase garante que:
- Donos só veem dados do seu restaurante
- Clientes públicos veem apenas cardápios públicos
- Não há vazamento de dados entre tenants

### Mobile-First

- Touch targets mínimo 44x44px
- Nenhum overflow horizontal
- Font-size base mínimo 16px
- Sidebar colapsável em mobile (<1024px)

### Offline-First

- Carrinho persiste em localStorage
- Service Worker para cache de assets
- Indicador visual quando offline

---

## Status do Projeto

| Funcionalidade | Status | Versão |
|----------------|--------|--------|
| Cardápio digital | ✅ Completo | 1.0 |
| Carrinho de compras | ✅ Completo | 1.0 |
| Checkout com WhatsApp | ✅ Completo | 1.0 |
| Painel admin | ✅ Completo | 1.0 |
| Gestão de pedidos | ✅ Completo | 1.0 |
| Landing pages segmentadas | ✅ Completo | 2.0 |
| Testes E2E | ✅ Completo | - |
| Testes de integração | ✅ Completo | - |
| Testes unitários | ✅ Completo | - |
| Bot Handover | 🔜 Em breve | - |
| Gestão de mesas | 🔜 Em breve | - |
| Histórico e gráficos | 🔜 Em breve | - |

---

## FAQ - Perguntas Frequentes

**Preciso pagar para usar?**
Não. O PediAi é código aberto e gratuito. Você só paga pela hospedagem (ex: Vercel) e pelo banco de dados (ex: Supabase - plano gratuito disponível).

**O cliente precisa instalar algo?**
Não. O cliente acessa o cardápio pelo link e faz o pedido pelo WhatsApp, sem instalar apps.

**Posso personalizar o visual?**
Sim. O design usa Tailwind CSS com cores e fontes configuráveis.

**É seguro?**
Sim. Os dados são protegidos por autenticação Supabase, Row Level Security (RLS) e criptografia. O WhatsApp Business usa tokens de acesso seguros.

**Como funciona o multi-tenant?**
Cada restaurante tem seus dados isolados. O `restaurant_id` é a chave de isolamento em todas as tabelas e queries.

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

Antes de enviar PR, certifique-se de que:
- `npm run lint` passa sem erros
- `npm run build` compila com sucesso
- `npm run test:unit` passa em 100%
- `npx tsc --noEmit` não mostra erros de TypeScript

---

## Licença

Este projeto é livre para uso e modificação sob a licença MIT.

---

**PediAi** - Cardápio digital simples, moderno e sem complicações.

**Versão**: 5.0
**Última Atualização**: 2026-04-19
