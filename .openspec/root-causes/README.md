# Root Causes - MenuLink

## Visão Geral

Este diretório armazena os RCAs (Root Cause Analysis) do projeto MenuLink. Todo erro reportado deve ter seu RCA documentado seguindo o processo de tratamento de erros.

**Idioma**: Português Brasileiro (pt-BR)  
**Processo**: Fluxo de Tratamento de Erros (Seção 10 do menulink-rules.md)

---

## Estrutura de Arquivos

```
root-causes/
├── README.md              # Este arquivo - guia do processo
├── .gitkeep               # Mantém diretório no git
└── RCA-YYYY-MM-DD-NNN.md  # Arquivos RCA individuais
```

---

## Processo RCA (Root Cause Analysis)

### Quando Criar um RCA

**TODO erro reportado deve criar um RCA**. Isso inclui:
- Erros em produção
- Erros em staging
- Bugs descobertos em testes
- Falhas de segurança
- Performance degradations

### Passo a Passo

```
1. Erro Reportado
       │
       ▼
2. Criar RCA usando template (.openspec/templates/rca-template.md)
       │
       ▼
3. Classificar Severidade (Critical/High/Medium/Low)
       │
       ▼
4. Criar testes OBRIGATÓRIOS antes do fix (conforme tabela de severidade)
       │
       ▼
5. Aplicar fix (testes devem passar após)
       │
       ▼
6. Preencher todas as 10 seções do template
       │
       ▼
7. Arquivar em .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
```

---

## Nomenclatura de Arquivos RCA

**Padrão**: `RCA-YYYY-MM-DD-NNN.md`

| Componente | Descrição | Exemplo |
|------------|-----------|---------|
| RCA | Prefixo fixo | RCA |
| YYYY | Ano (4 dígitos) | 2026 |
| MM | Mês (2 dígitos) | 04 |
| DD | Dia (2 dígitos) | 17 |
| NNN | Número sequencial (3 dígitos) | 001 |

**Exemplos**:
- `RCA-2026-04-17-001.md` - Primeiro RCA de 17 de abril de 2026
- `RCA-2026-05-01-002.md` - Segundo RCA de 1 de maio de 2026

**Regra**: O número NNN é resetado a cada dia. Se houver mais de 999 RCAs em um dia, usar NNNN (4 dígitos).

---

## Template RCA

O template oficial está em: `.openspec/templates/rca-template.md`

O template contém 10 seções obrigatórias:
1. Descrição do Erro
2. Impacto
3. Linha do Tempo
4. Causa Imediata
5. Causa Raiz (5 Porquês)
6. Categoria da Causa Raiz
7. Testes Criados
8. Correção Aplicada
9. Lições Aprendidas
10. Ações Preventivas

---

## Tabela de Severidade

| Severidade | Impacto | Unitários | Integração | BDD |
|------------|---------|-----------|------------|-----|
| **Critical** | Sistema indisponível ou perda de dados | 3 | 2 | 1 |
| **High** | Funcionalidade principal comprometida | 2 | 1 | 1 |
| **Medium** | Funcionalidade secundária afetada | 1 | 1 | 0 |
| **Low** | Impacto mínimo, workarounds disponíveis | 1 | 0 | 0 |

### Interpretação

- **Unitários**: Testes em `tests/unit/` cobrindo a lógica afetada
- **Integração**: Testes em `tests/integration/` validando integração com outros módulos
- **BDD**: Cenários em arquivo `.feature` com tag `@integration-test`

### Regra Obrigatória

**Testes devem ser criados ANTES do fix e devem falhar antes da correção**.

---

## Categorias de Causa Raiz

| Código | Categoria | Quando Usar |
|--------|-----------|-------------|
| CODE | Código | Bug em código fonte, lógica incorreta, erro de implementação |
| CONFIG | Configuração | Erro em variáveis de ambiente, settings, configurações |
| INFRA | Infraestrutura | Problemas de servidor, rede, cloud, infraestrutura |
| PROC | Processo | Falta de processo definido, processo inadequado |
| DSGN | Design | Decisão arquitetural incorreta, design de sistema |
| TEST | Testes | Cobertura insuficiente, testes ausentes ou incorretos |
| DOCS | Documentação | Documentação ausente, desatualizada ou incorreta |

---

## Status do RCA

| Status | Significado |
|--------|-------------|
| **open** | RCA recém-criado, análise não iniciada |
| **in_analysis** | Análise em andamento (5 Porquês, investigação) |
| **fixed** | Correção aplicada e verificada |
| **closed** | RCA revisado e arquivado |

---

## Compliance

### Métrica

| Métrica | Target | Atual |
|---------|--------|-------|
| **RCA Coverage** | 100% dos erros reportados devem ter RCA | [calculado] |

### Gate de Qualidade

O RCA **NÃO** é considerado válido se:
- [ ] Template não foi completamente preenchido
- [ ] Seção "5 Porquês" não foi preenchida (mínimo 3 porquês)
- [ ] Testes obrigatórios não foram criados
- [ ] Testes não falham antes do fix (ou isso não foi demonstrado)
- [ ] Ações preventivas estão vazias

---

## Ferramentas e Scripts

### Verificar RCAs Pendentes

```bash
# Listar todos os RCAs
ls -la .openspec/root-causes/RCA-*.md

# Verificar RCAs sem testes
grep -L "tests/unit" .openspec/root-causes/RCA-*.md
```

### Dashboard de RCAs

Em construção - por enquanto usar planilha manual.

---

## Integração com SDD

O fluxo de erro integra-se ao SDD da seguinte forma:

```
Erro Reportado
       │
       ▼
1. RCA criado (.openspec/root-causes/RCA-YYYY-MM-DD-NNN.md)
       │
       ▼
2. PRD implícito (problema identificado) no RCA
       │
       ▼
3. Se mudança significativa → seguir fluxo SDD completo
   - Criar change em .openspec/changes/
   - Seguir: proposal → spec → design → tasks → verification → archive
       │
       ▼
4. Se correção simples → apenas RCA documentado
       │
       ▼
5. Archive do RCA: .openspec/root-causes/RCA-YYYY-MM-DD-NNN.md
```

---

## Referências

- Template RCA: `.openspec/templates/rca-template.md`
- Regras do Projeto: `.openspec/specs/menulink-rules.md` (Seção 10)
- SDD Workflow: `AGENTS.md` (Seção de Fluxo SDD)

---

## Versionamento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-04-17 | AI Agent | Versão inicial |

---

**Última Atualização**: 2026-04-17  
**Autor**: AI Agent