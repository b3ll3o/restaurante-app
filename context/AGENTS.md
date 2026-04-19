# Context - PediAi

## Visão Geral

O módulo **Context** contém os contextos React globais da aplicação PediAi, responsáveis pelo gerenciamento de estado compartilhado entre componentes.

**Idioma**: Português Brasileiro (pt-BR)
**Stack**: React 19 + TypeScript (strict)

---

## Estrutura de Diretórios

```
context/
├── AGENTS.md # Documentação do módulo (este arquivo)
└── cart-context.tsx # Implementação do CartContext
```

---

## Contexts Disponíveis

### CartContext (`cart-context.tsx`)

Gerenciamento do estado do carrinho de compras com suporte multi-tenant (restaurantId).

**Responsabilidade**: Controlar itens, quantidades, totais e isolamento por restaurante.

**Arquivo de documentação detalhada**: `cart-context/AGENTS.md`

---

## Métricas de Qualidade

| Métrica | Target | Prioridade |
|---------|--------|------------|
| Cobertura de testes | ≥80% | Alta |
| Re-renders desnecessários | 0 | Alta |

---

## Dependências

| Dependência | Versão | Uso |
|-------------|--------|-----|
| react | 19.2.4 | Framework |
| react-dom | 19.2.4 | DOM rendering |

---

## Referências

- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useReducer](https://react.dev/reference/react/useReducer)

---

**Versão**: 2.0
**Última Atualização**: 2026-04-17
**Autor**: AI Agent