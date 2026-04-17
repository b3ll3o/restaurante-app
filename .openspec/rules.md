# Regras da Aplicação - MenuLink

## Regra 1: Qualidade sobre Velocidade (CRÍTICA)

**Sempre priorize qualidade sobre velocidade.**

- É melhor demorar mais para fazer a revisão correta do que fazer rápido e errado
- Revise sempre que achar necessário antes de executar
- Não pule etapas de verificação
- Uma change só está concluída quando for arquivada
- Só inicie uma nova change após todas as anteriores estarem arquivadas

## Regra 2: Padronização de Archives

- Manter um padrão de organização para archives: `YYYY-MM-DD-{change-name}/`
- Usar hífen, não barra: `2026-04-17-quality-workflow-evolution/`
- Não misturar padrões de organização

## Regra 3: Paralelização

- Priorizar paralelização de tarefas independentes
- Tarefas dependentes devem ser executadas em sequência

## Regra 4: Revisão Obrigatória

- Revisar com @oracle antes de executar mudanças significativas
- Revisar antes de arquivar qualquer change
- Verificar consistência da documentação periodicamente

## Regra 5: Change Concluída Somente Quando Arquivada

- Uma change só está concluída quando for arquivada em `.openspec/changes/archive/YYYY-MM-DD-{change-name}/`
- Não considerar change como finalizada enquanto não estiver arquivada

## Regra 6: Ordem de Execução

- Só iniciar nova change após todas as anteriores estarem arquivadas
- Mudanças paralelas devem ser sequencializadas quando houver dependência

---

## Nota sobre Localização de Configurações

**~/.config/opencode é apenas para configurações COMPARTILHADAS entre aplicações.**

- Regras específicas do MenuLink devem ficar em `.openspec/rules.md`
- Configurações compartilhadas (patterns, templates) podem ficar em `~/.config/opencode/`
- Esta separação garante que cada projeto tenha suas regras autocontidas