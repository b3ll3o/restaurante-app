# Proposta: Fluxo de Desenvolvimento Guiado por IA com OpenCode

## Problema

O desenvolvimento de software enfrenta gargalos de produtividade na transição de ideia para código executável. Tarefas repetitivas de scaffolding, configuração e escrita de boilerplate consomem tempo significativo. Além disso, a qualidade e consistência do código variam conforme a experiência do desenvolvedor, dificultando a padronização e rastreabilidade.

## Solução Proposta

Implementar um pipeline de desenvolvimento assistido por IA utilizando o ecossistema OpenCode com agentes especializados (PM, Arquiteto, Desenvolvedor, Revisor). O PRD.md será a entrada central que disparará a execução orquestrada dos agentes, gerando automaticamente:

1. Backlog de histórias de usuário (formato XP + critérios INVEST)
2. Especificações técnicas (arquitetura, banco, APIs)
3. Testes automatizados (unitários, integração)
4. Código-fonte da funcionalidade
5. Documentação correspondente

## Intent

Estabelecer um fluxo de desenvolvimento onde agentes de IA especializados automatizem o ciclo completo desde a elicitação de requisitos (PRD) até a implementação validada, garantindo consistência com os padrões do projeto e rastreabilidade completa.

## Scope

### In (Incluído)
- Pipeline PRD → histórias → especificação → implementação com agentes IA
- Configuração de plugins OpenCode (`create-opencode-workflow`, `opencode-plus`, `OpenAgentsControl`)
- Estrutura de agentes (PM, Arquiteto, Dev, Revisor)
- Integração com arquivos de contexto (`OPENCODE.md`, `AGENTS.md`)
- Geração de histórias XP com validação INVEST
- Critérios de aceitação Given-When-Then
- Ciclo TDD (Red-Green-Refactor) nos agentes
- Revisão e validação contínua pelo Agente Revisor

### Out (Excluído)
- Implementação de novos módulos de negócio do MenuLink
- Alterações no schema do banco de dados
- Modificação de APIs existentes
- Implementação de funcionalidades de restaurante/cardápio/pedidos

## Approach

1. **Instalar plugins OpenCode**: `create-opencode-workflow`, `opencode-plus`
2. **Configurar OpenAgentsControl**: Ensinar padrões de código do projeto (TypeScript strict, Zod, Drizzle, shadcn/ui)
3. **Criar estrutura de agentes**: PM, Arquiteto, Dev, Revisor com skills especializadas
4. **Integrar com .openspec/**: pipeline SDD existente com fluxo PRD → proposal → spec → design → tasks
5. **Validar fluxo**: Executar ciclo completo com uma funcionalidade teste

### Arquitetura do Fluxo

```
PRD.md → Agente PM → Backlog Histórias (INVEST)
                          ↓
                   Agente Arquiteto → Spec + Tasks
                          ↓
                   Agente Dev → TDD (Red-Green-Refactor)
                          ↓
                   Agente Revisor → Validar + Aprovar
```

## Affected Areas

| Área | Impacto | Descrição |
|------|---------|-----------|
| `.openspec/` | Alto | Novo workflow integrado ao SDD existente |
| `AGENTS.md` | Alto | Configuração de agentes especializados |
| `OPENCODE.md` | Alto | Context file para agentes |
| `docs/` | Médio | Guias de uso do fluxo IA |
| `package.json` | Médio | Novos plugins e dependências |

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Curva de aprendizado elevada | Alta | Médio | Documentação clara e exemplos práticos |
| Dependência de plugins externos | Média | Alto | Definir fallback manual e lock de versões |
| Código gerado fora dos padrões | Média | Alto | OpenAgentsControl com validação rigorosa |
| Agentes entrando em loop | Baixa | Médio | Timeout e limite de iterations |
| Incompatibilidade com Next.js 16 | Baixa | Alto | Testar antes em ambiente隔离 |

## Rollback Plan

1. **Remover plugins**: `npm uninstall create-opencode-workflow opencode-plus`
2. **Reverter AGENTS.md**: Restaurar versão anterior do git
3. **Remover OPENCODE.md**: Deletar arquivo de contexto IA
4. **Limpar docs/**: Remover documentação do fluxo IA
5. **Resultado**: Sistema retorna ao fluxo SDD manual

## Success Criteria

- [ ] SC-1: Comando `/prd start` inicia o pipeline de agentes
- [ ] SC-2: Agentes geram histórias XP válidas (formato + INVEST)
- [ ] SC-3: Critérios de aceitação em formato Given-When-Then
- [ ] SC-4: Agente Dev executa ciclo TDD completo
- [ ] SC-5: Agente Revisor valida código gerado
- [ ] SC-6: Código gerado segue padrões do projeto (via OpenAgentsControl)
- [ ] SC-7: 100% dos fluxos críticos documentados com BDD
- [ ] SC-8: Cobertura de testes ≥80% para código gerado

## Alternativas Consideradas

| Alternativa | Por que foi descartada |
|-------------|------------------------|
| Uso de agentes genéricos (ChatGPT, Claude) | Falta de contexto do projeto e histórico de interações |
| Implementação de agentes custom do zero | Tempo elevado de desenvolvimento e manutenção |
| Workflow inteiramente manual (SDD apenas) | Não resolve o problema de produtividade |

## Dependências Externas

| Plugin | Versão | Propósito |
|--------|--------|-----------|
| `create-opencode-workflow` | latest | Pipeline base de agentes |
| `opencode-plus` | latest | Sistema TDD com agentes |
| `opencode` | latest | Plataforma de execução |

## Urgência

- [ ] Crítica
- [x] **Alta** - Aceleração drástica do ciclo de desenvolvimento
- [ ] Média
- [ ] Baixa

## Status Proposta

**Status**: Rascunho  
**Revisão Necessária**: Tech Lead / Oracle  
**Próximo Passo**: Análise de viabilidade técnica + spec.md

---

**Proposta criada em**: 2026-04-17  
**Autor**: AI Agent  
**Baseado em**: PRD.md "Implementação de Fluxo de Desenvolvimento Guiado por IA com OpenCode"