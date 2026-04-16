# MenuLink - Regras de Qualidade e Paradigmas

## Fonte da Verdade

Este documento define as regras de qualidade obrigatórias para o projeto MenuLink, incluindo métricas, paradigmas e práticas de desenvolvimento.

---

## 1. Regras de Qualidade Obrigatórias

### 1.1 Idioma Padrão
- **Idioma padrão do projeto**: Português Brasileiro (pt-BR)
- **Documentação**: Todas as documentações devem ser em pt-BR
- **Código**: Comentários e mensagens em pt-BR
- **Interface**: Textos da UI em pt-BR
- **Exceções**: Nomes técnicos (funções, variáveis, APIs) podem ser em inglês

### 1.2 Cobertura de Testes
- **Mínimo 80%** de cobertura de testes unitários (linhas, branches, functions)
- **100%** dos fluxos críticos devem ter testes E2E
- **Máximo possível** de testes automatizados em todos os níveis

### 1.2 Métricas de Cobertura
```bash
# Comando para verificar cobertura
npm run test:coverage

# Thresholds mínimos
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%
```

### 1.3 Gate de Qualidade
- Builds falham se cobertura < 80%
- PRs não são mergeados sem testes correspondentes
- Novas funcionalidades exigem testes antes do código

---

## 2. Paradigmas de Desenvolvimento

### 2.1 TDD (Test-Driven Development)
1. **RED**: Escrever teste que falha
2. **GREEN**: Escrever código mínimo para passar
3. **REFACTOR**: Melhorar código mantendo testes verdes

### 2.2 BDD (Behavior-Driven Development)
- Especificações em formato Gherkin (Given-When-Then)
- Testes derivados de cenários de negócio
- Linguagem ubíqua compartilhada entre devs e stakeholders

### 2.3 ATDD (Acceptance Test-Driven Development)
- Testes de aceitação escritos antes da implementação
- Validação de requisitos funcionais
- Critérios de aceitação claros e mensuráveis

### 2.4 DDD (Domain-Driven Design)
- Modelo de domínio rico com entidades, value objects e aggregates
- Bounded contexts claramente definidos
- Linguagem ubíqua documentada e seguida

### 2.5 SDD (Specification-Driven Development)
- Especificações são fonte da verdade
- Código deriva das especificações
- Verificação contínua entre código e specs

---

## 3. Arquitetura Multi-Tenant

### 3.1 Princípios
- Cada restaurante é um tenant distinto
- Todos os tenants compartilham o mesmo banco de dados
- Isolamento de dados por `restaurant_id`
- Escalabilidade horizontal

### 3.2 Implementação
```sql
-- Todas as tabelas devem incluir restaurant_id
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

-- Índices para performance multi-tenant
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
```

### 3.3 Regras de Acesso
- APIs devem validar `restaurant_id` do usuário autenticado
- Nenhum tenant pode acessar dados de outro tenant
- Queries sempre filtradas por `restaurant_id`

---

## 4. Estrutura de Testes

### 4.1 Níveis de Teste
```
tests/
├── unit/           # Testes unitários (80%+ cobertura)
│   ├── domain/     # Lógica de domínio
│   ├── utils/      # Funções utilitárias
│   └── services/   # Serviços de negócio
├── integration/    # Testes de integração
│   ├── api/        # API routes
│   └── database/   # Integração com banco
└── e2e/           # Testes end-to-end
    ├── admin/      # Fluxos admin
    ├── public/     # Fluxos públicos
    └── checkout/   # Fluxo de checkout
```

### 4.2 Ferramentas
- **Vitest**: Testes unitários e integração
- **Testing Library**: Testes de componentes React
- **Playwright**: Testes E2E
- **MSW**: Mock de APIs externas

### 4.3 Scripts de Teste
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --run tests/unit",
    "test:integration": "vitest --run tests/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --run --coverage",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui"
  }
}
```

---

## 5. Fluxo de Desenvolvimento

### 5.1 Para Novas Funcionalidades
1. Atualizar especificação em `.openspec/specs/`
2. Escrever testes de aceitação (ATDD)
3. Escrever testes unitários que falham (TDD)
4. Implementar código mínimo para passar testes
5. Refatorar mantendo testes verdes
6. Verificar cobertura (≥80%)
7. Criar testes E2E para fluxos críticos

### 5.2 Para Correções de Bugs
1. Reproduzir bug com teste que falha
2. Corrigir bug
3. Verificar que teste passa
4. Adicionar testes para casos edge relacionados

### 5.3 Para Refatorações
1. Garantir suite de testes completa
2. Executar todos os testes
3. Refatorar incrementalmente
4. Verificar que todos os testes passam

---

## 6. Monitoramento de Qualidade

### 6.1 Métricas Monitoradas
- Cobertura de testes (semanal)
- Tempo de execução dos testes
- Taxa de falhas
- Complexidade ciclomática
- Dívida técnica

### 6.2 Relatórios
```bash
# Gerar relatório de cobertura
npm run test:coverage -- --coverageReporters=html

# Gerar relatório de complexidade
npx eslint --format json --output-file eslint-report.json
```

### 6.3 Gates Automatizados
- GitHub Actions valida cobertura
- PR checks falham se testes quebram
- Deploy bloqueado se qualidade abaixo do threshold

---

## 7. Exceções e Flexibilidade

### 7.1 Exceções Permitidas
- Cobertura < 80% apenas para código gerado automaticamente
- Testes E2E podem ser omitidos para componentes UI simples
- Complexidade alta justificada por requisitos de negócio

### 7.2 Processo de Exceção
1. Documentar justificativa técnica
2. Obter aprovação do tech lead
3. Criar plano para atingir métricas
4. Revisar periodicamente

---

## 8. Responsabilidades

### 8.1 Desenvolvedores
- Escrever testes para todo código novo
- Manter cobertura ≥80%
- Seguir paradigmas TDD/BDD/ATDD/DDD/SDD
- Validar multi-tenancy

### 8.2 Tech Lead
- Revisar métricas de qualidade
- Aprovar exceções
- Garantir aderência aos paradigmas
- Monitorar dívida técnica

### 8.3 Product Owner
- Fornecer cenários BDD
- Validar testes de aceitação
- Priorizar qualidade junto a features

---

## 9. Referências

1. `menulink-specification.md` - Requisitos de negócio
2. `menulink-technical-plan.md` - Arquitetura técnica
3. `menulink-unit-tests-checklist.md` - Checklist de testes
4. `menulink-acceptance-tests.feature` - Cenários BDD

---

## 10. Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-15 | AI Agent | Versão inicial com regras de qualidade |

---

**NOTA**: Estas regras são obrigatórias para todo o desenvolvimento no projeto MenuLink. Qualquer violação deve ser justificada e aprovada seguindo o processo de exceção.