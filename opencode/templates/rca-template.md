# RCA Template - Root Cause Analysis

**Idioma**: Português Brasileiro (pt-BR)  
**Versão**: 1.1  
**Última Atualização**: 2026-04-17

---

## 1. Descrição do Erro

**ID do Erro**: (preenchido pelo sistema ou agente)

**Resumo**:
[Breve descrição do erro em uma linha]

**Detalhes**:
[Descrição completa do erro, incluindo:
- O que estava acontecendo quando o erro ocorreu
- Qual era o comportamento esperado
- Qual foi o comportamento observado
- Any relevant logs or error messages]

**Ambiente**:
- [ ] Development
- [ ] Staging
- [ ] Production

---

## 2. Impacto

### Impacto nos Usuários

| Métrica | Valor |
|---------|-------|
| Usuários afetados | [número ou "desconhecido"] |
| Tempo de impacto | [duração] |
| Experiência do usuário | [descrição] |

### Impacto Funcional

| Funcionalidade | Status | Severidade |
|----------------|--------|------------|
| [funcionalidade 1] | [Funcionando/Não funcionando] | [Alta/Média/Baixa] |
| [funcionalidade 2] | [Funcionando/Não funcionando] | [Alta/Média/Baixa] |

### Impacto em Receita (se aplicável)

- **Perda estimada**: [valor ou "N/A"]
- **Tempo de recuperação**: [duração]

---

## 3. Linha do Tempo

| Timestamp | Responsável | Ação | Resultado |
|-----------|-------------|------|-----------|
| YYYY-MM-DD HH:MM | [nome] | [ação tomada] | [resultado] |
| YYYY-MM-DD HH:MM | [nome] | [ação tomada] | [resultado] |
| YYYY-MM-DD HH:MM | [nome] | [ação tomada] | [resultado] |

---

## 4. Causa Imediata

[Descrição da causa imediata que levou ao erro. Esta é a resposta à pergunta: "O que especificamente causou o erro neste momento?"]

**Exemplo**:
> O servidor de API retornou timeout devido a conexão esgotada com o banco de dados.

---

## 5. Causa Raiz (5 Porquês)

A técnica dos 5 Porquês envolve perguntar "por quê?" sucesivamente para chegar à causa raiz.

### Porquês

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Por que o erro ocorreu? | [resposta] |
| 2 | Por que isso aconteceu? | [resposta] |
| 3 | Por que isso foi permitido? | [resposta] |
| 4 | Por que não foi detectado antes? | [resposta] |
| 5 | Por que o sistema permite isso? | [resposta] |

### Causa Raiz Final

[A causa raiz consolidada após a análise dos 5 porquês]

**Exemplo**:
> O connection pool do banco de dados estava configurado com max_connections=10, mas a aplicação estava tentando usar mais de 15 conexões simultâneas durante horários de pico.

---

## 6. Categoria da Causa Raiz

**Categoria Primária**: [selecionar uma]

| Código | Categoria | Descrição |
|--------|-----------|-----------|
| CODE | Código | Erro em código fonte (bug, lógica incorreta, etc.) |
| CONFIG | Configuração | Erro em configurações (variáveis de ambiente, settings, etc.) |
| INFRA | Infraestrutura | Erro em infraestrutura (servidores, rede, cloud, etc.) |
| PROC | Processo | Erro em processos (falta de processo, processo inadequado, etc.) |
| DSGN | Design | Erro em design/arquitetura (decisão arquitetural incorreta, etc.) |
| TEST | Testes | Falha em cobertura de testes (testes insuficientes, ausentes, etc.) |
| DOCS | Documentação | Erro ou falta em documentação (docs desatualizadas, ausentes, etc.) |

**Categoria Selecionada**: [CODE/CONFIG/INFRA/PROC/DSGN/TEST/DOCS]

**Justificativa**:
[Explicação breve de por que esta categoria foi selecionada]

---

## 7. Testes Criados

### Testes Unitários

| Teste | Arquivo | Descrição | Status |
|-------|---------|-----------|--------|
| [nome do teste] | [caminho] | [descrição] | [✓ criado/✗ pendente] |
| [nome do teste] | [caminho] | [descrição] | [✓ criado/✗ pendente] |
| [nome do teste] | [caminho] | [descrição] | [✓ criado/✗ pendente] |

### Testes de Integração

| Teste | Arquivo | Descrição | Status |
|-------|---------|-----------|--------|
| [nome do teste] | [caminho] | [descrição] | [✓ criado/✗ pendente] |
| [nome do teste] | [caminho] | [descrição] | [✓ criado/✗ pendente] |

### Testes BDD (E2E)

| Cenário | Arquivo .feature | Step Definitions | Status |
|---------|-------------------|-------------------|--------|
| [cenário] | [caminho] | [caminho] | [✓ criado/✗ pendente] |

### Evidência de Execução

```
[Output dos testes mostrando que falham antes do fix e passam depois]
```

---

## 8. Correção Aplicada

### Código Antes (Se Aplicável)

```typescript
// [Trecho de código antes da correção]
```

### Código Depois

```typescript
// [Trecho de código após a correção]
```

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| [caminho] | [descrição da mudança] |

### Comando de Deploy

```bash
# [comando ou procedimento para aplicar a correção]
```

---

## 9. Lições Aprendidas

### O que deu certo?

| Prática | Reason |
|---------|--------|
| [prática] | [razão] |

### O que poderia ser melhor?

| Área | Melhoria Proposta |
|------|-------------------|
| [área] | [melhoria] |

### Insights

1. [insight 1]
2. [insight 2]
3. [insight 3]

---

## 10. Ações Preventivas

### Ações Imediatas

| Ação | Responsável | Prazo | Status |
|------|-------------|-------|--------|
| [ação] | [nome] | [data] | [FEITO/EM PROGRESSO/PENDENTE] |

### Ações de Longo Prazo

| Ação | Responsável | Prazo | Status |
|------|-------------|-------|--------|
| [ação] | [nome] | [data] | [FEITO/EM PROGRESSO/PENDENTE] |

### Monitoramento

| Métrica | Dashboard | Alerta |
|---------|-----------|--------|
| [métrica] | [link] | [configuração] |

---

## Metadados

| Campo | Valor |
|-------|-------|
| **RCA ID** | RCA-YYYY-MM-DD-NNN |
| **PRD ID** | PRD-YYY (se aplicável, para bugs que requerem PRD) |
| **Erro Reportado em** | YYYY-MM-DD HH:MM |
| **RCA Criado em** | YYYY-MM-DD HH:MM |
| **Autor** | [nome] |
| **Revisor** | [nome] |
| **Severidade** | [Critical/High/Medium/Low] |
| **Status** | [open/in_analysis/fixed/closed] |
| **Pipeline** | [SDD/BugFix/None] |

---

## Assinaturas

| Papel | Nome | Data |
|-------|------|------|
| Autor | | |
| Revisor | | |
| Tech Lead | | |

---

## Checklist de Compliance

**Este RCA está completo e válido para arquivamento:**

- [ ] Todas as 10 seções estão preenchidas
- [ ] Seção 5 (5 Porquês) tem no mínimo 3 níveis de profundidade
- [ ] Seção 6 (Categoria) está preenchida com justificativa
- [ ] Seção 7 (Testes) tem pelo menos 1 teste criado
- [ ] Seção 8 (Correção) tem código antes/depois
- [ ] Seção 10 (Ações) tem pelo menos 1 ação preventiva
- [ ] Metadados estão preenchidos (ID, Data, Status)
- [ ] **Se PRD de correção**: PRD ID está referenciado

### Para PRDs de Correção (Bug Fix)

- [ ] RCA ID referenciado no PRD
- [ ] PRD criado em `opencode/openspec/backlog/prds/`
- [ ] Após correção: RCA.status = "Completed"
- [ ] Após correção: PRD movido para `opencode/openspec/backlog/archive/`

---

**Nota**: Este template deve ser preenchido COMPLETAMENTE para todo erro reportado. RCA incompleto não é considerado válido e deve ser devolvido para complementação.