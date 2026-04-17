# Design: module-organization

## Decisões de Arquitetura

### Princípio da Proximidade
Documentação e código do mesmo módulo devem estar no mesmo nível hierárquico. Isso facilita:
- Localização de artefatos relacionados
- Manutenção de documentação junto ao código
- Coerência entre especificação e implementação

### Estrutura de Proximidade Padrão

```
módulo/
├── page.tsx              # Arquivo principal do módulo
├── AGENTS.md             # Documentação no mesmo nível
├── módulo.feature        # Cenários BDD (quando aplicável)
└── sub-módulo/
    ├── page.tsx
    └── AGENTS.md         # AGENTS.md do sub-módulo
```

### Hierarquia de Proximidade por Tipo

| Tipo | Nível do AGENTS.md | Nível do .feature |
|------|-------------------|-------------------|
| Rota (page.tsx, route.ts) | Mesma pasta da rota | Mesma pasta da rota |
| Componente | Mesma pasta do componente | Mesma pasta do componente |
| Hook | Mesma pasta do hook | Mesma pasta do hook |
| Tipo/Entidade | Mesma pasta do tipo | Mesma pasta do tipo |
| Módulo | Nível do módulo (visão geral) | Nível do módulo |

## Arquitetura

### Estrutura Alvo

```
app/
├── AGENTS.md             # Visão geral do app
├── admin/
│   ├── AGENTS.md         # Visão geral admin
│   ├── login/
│   │   ├── page.tsx
│   │   ├── AGENTS.md
│   │   └── login.feature
│   ├── signup/
│   │   ├── page.tsx
│   │   └── AGENTS.md
│   └── ...
├── menu/
│   └── [slug]/
│       ├── page.tsx
│       └── AGENTS.md
└── api/
    └── orders/
        ├── route.ts
        └── AGENTS.md

components/
├── AGENTS.md             # Visão geral components
├── ui/
│   ├── AGENTS.md
│   └── ...
└── admin/
    ├── AGENTS.md
    └── ...

lib/
├── AGENTS.md             # Visão geral lib
├── supabase/
│   └── AGENTS.md
├── whatsapp.ts
└── utils.ts

context/
├── AGENTS.md
└── cart-context.tsx

hooks/
├── AGENTS.md
└── ...

types/
├── AGENTS.md
└── index.ts

tests/
├── AGENTS.md
├── unit/
├── integration/
└── e2e/
```

## TDD (Test-Driven Development)
- Não aplicável diretamente - esta change é de reorganização
- Validação de estrutura através de verificação manual

## BDD (Behavior-Driven Development)
- Cenários em `spec.md` definem comportamento esperado da organização
- Arquivos `.feature` devem ser criados/atualizados após reorganização

## DDD (Domain-Driven Design)
- Módulos existentes representam bounded contexts
- Reorganização preserva limites de domínio

## Arquivos a Modificar
- `app/*/AGENTS.md` (criar/mover para nível correto)
- `components/*/AGENTS.md` (criar/mover)
- `lib/*/AGENTS.md` (criar/mover)
- `context/AGENTS.md` (criar)
- `hooks/AGENTS.md` (criar)
- `types/AGENTS.md` (criar)
- `tests/AGENTS.md` (criar/mover)
- Arquivos `.feature` existentes (mover para nível correto)

## Dependências
Nenhuma nova dependência.

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar imports ao mover arquivos | Média | Alto | Verificar todos os imports antes e após |
| Perder referências em AGENTS.md | Baixa | Médio | Atualizar referências durante execução |
| Arquivos .feature perder tags @integration-test | Baixa | Baixo | Re-adicionar tags após mover |

## Status
Design