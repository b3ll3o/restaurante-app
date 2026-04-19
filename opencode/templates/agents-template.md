# Template: AGENTS.md

## Visão Geral

**Módulo**: `{nome-do-modulo}`
**Responsabilidade**: {breve descrição}
**Idioma**: Português Brasileiro (pt-BR)
**Stack**: {stack tecnológica}

---

## Estrutura de Diretórios

```
{nome-do-modulo}/
├── {arquivo1}.ts
├── {arquivo2}.tsx
└── AGENTS.md
```

---

## Responsabilidade

{descrição detalhada do que o módulo faz}

### Interface Pública

```typescript
// Funções exportadas
export function {nome}({params}): {retorno}
export const {constante}: {tipo}

// Componentes exportados
export function {Componente}({props}): JSX.Element
```

---

## Arquitetura

```typescript
// {descrição da arquitetura com código exemplificar}
```

---

## Regras de Implementação

1. {regra 1}
2. {regra 2}
3. {regra 3}

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura unitária | ≥80% | Alta |
| Tempo de resposta | <200ms | Média |
| Erros de lint | 0 | Crítica |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| {dep} | {versão} | {uso} |

---

## Referências

- [Link 1]
- [Link 2]

---

**Versão**: 1.0
**Última Atualização**: {YYYY-MM-DD}
**Autor**: AI Agent
