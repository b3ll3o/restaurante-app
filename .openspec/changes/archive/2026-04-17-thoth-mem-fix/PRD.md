# PRD: thoth_mem Error Fix

**Status:** Rascunho
**Autor:** AI Agent
**Data:** 2026-04-17

---

## 1. Problema / Oportunidade

O MCP `thoth_mem` está com erro de inicialização, causando `ProviderModelNotFoundError` quando tenta executar tasks via agente. Isso impede a execução de changes via SDD com persistência em thoth-mem.

### Sintomas Observados

1. **`configLoaded: false`** - A configuração não está sendo carregada corretamente nos logs de token-tracker
2. **`ProviderModelNotFoundError`** - Erro ao tentar usar `task` agents através do thoth_mem
3. **Agents não executam** - Tentativas de usar `task` ou `background_task` falham com erro de provider

### Logs Relevantes

```json
{"type":"init","directory":"/home/leo/projetos/restaurante","configLoaded":false,"_ts":1776453218832}
```

---

## 2. Público-Alvo Impactado

- Desenvolvedores usando o fluxo SDD do MenuLink
- Execução de tasks que requerem persistência thoth-mem

---

## 3. Resultado Esperado (Alto Nível)

thoth_mem funcionando corretamente para:
- Persistir artefatos SDD em memória
- Recuperar artefatos via 3-layer recall protocol
- Permitir execução de task agents sem erros

---

## 4. Critérios de Sucesso Preliminares

- [ ] Erro `ProviderModelNotFoundError` eliminado
- [ ] `configLoaded` passando para `true` nos logs
- [ ] Task agents executando com sucesso via thoth_mem
- [ ] 3-layer recall protocol funcionando

---

## 5. Análise Inicial

### Viabilidade Técnica

**Evidências Coletadas:**

| Componente | Status | Observação |
|------------|--------|------------|
| `~/.config/opencode/` | ✅ | Existe e tem estrutura válida |
| `node_modules/@opencode-ai/plugin` | ✅ | Instalado v1.4.9 |
| `skills/` directory | ✅ | Skills SDD presentes |
| `opencode.json` | ⚠️ | Configurado mas `configLoaded: false` |
| thoth_mem tools | ❌ | Não expostas/funcionando |

### Hipóteses (a verificar)

1. **Configuração incompleta** - `opencode.json` pode estar faltando configurações necessárias para thoth_mem
2. **Plugin não registrado** - O plugin thoth_mem pode não estar registrado como MCP server
3. **API Key missing** - thoth_mem pode requerer autenticação
4. **Versão incompatível** - Conflito entre versões de plugins

### Análise de Arquitetura

```
opencode
├── opencode.json          # Config do workspace
├── skills/                # Skills SDD
│   └── _shared/
│       ├── thoth-mem-convention.md
│       └── persistence-contract.md
└── node_modules/
    └── @opencode-ai/
        ├── plugin/        # Plugin principal
        └── sdk/           # SDK
```

---

## 6. Urgência

- [ ] Crítica
- [x] Alta
- [ ] Média
- [ ] Baixa

---

## 7. Análise (Resposta do Tech Lead)

### Root Cause Identificada

**Problema**: O `thoth_mem` faz parte do plugin `@opencode-ai/plugin` v1.4.9, mas as tools `thoth_mem_mem_*` não estão sendo expostas/registradas corretamente no ambiente.

**Evidências**:
1. `configLoaded: false` nos logs indica que a configuração do plugin não está sendo carregada
2. `ProviderModelNotFoundError` ocorre quando tentamos usar `task` ou `background_task` agents
3. As tools `thoth_mem_mem_*` são expostas pelo plugin mas não estão acessíveis

**Arquitetura do thoth_mem**:
```
opencode (CLI)
├── plugins: ["oh-my-opencode-lite", "opencode-plugin-openspec"]
├── skills/ (em ~/.config/opencode/skills/)
│   └── _shared/
│       ├── thoth-mem-convention.md
│       └── persistence-contract.md
└── node_modules/
    └── @opencode-ai/
        ├── plugin/ (exposes thoth_mem tools)
        └── sdk/
```

**Hipótese**: O plugin `opencode-plugin-openspec` é o que expõe as tools thoth_mem. Preciso verificar se está instalado e configurado.

### Viabilidade

- Viável: [x] Sim
- Módulos afetados: `~/.config/opencode/`, `opencode.json`
- Impacto estimado: thoth_mem não funciona, mas o sistema pode operar em modo `openspec` sem memória persistente

### Solução Proposta

**Opção 1 (Recomendada)**: Usar modo `openspec` apenas, sem thoth_mem
- Configurar `opencode.json` para usar apenas `openspec` mode
- Não requer configuração adicional de MCP

**Opção 2**: Configurar thoth_mem corretamente
- Verificar se `opencode-plugin-openspec` está instalado
- Adicionar configuração MCP correta ao `opencode.json`
- Configurar API key se necessário

### Urgência
- [ ] Crítica
- [x] Alta (agentes não funcionam)
- [ ] Média
- [ ] Baixa

---

## 8. Plano de Investigação

### Fase 1: Diagnóstico

- [ ] Verificar se há documentação oficial do thoth_mem
- [ ] Examinar estrutura do plugin @opencode-ai/plugin
- [ ] Identificar como thoth_mem é inicializado
- [ ] Verificar se há API key ou token necessário

### Fase 2: Solução

- [ ] Se config missing: adicionar configuração correta ao opencode.json
- [ ] Se plugin não registrado: registrar thoth_mem como MCP server
- [ ] Se API key missing: obter e configurar credenciais
- [ ] Se versão incompatível: atualizar dependências

### Fase 3: Verificação

- [ ] Testar thoth_mem_mem_save
- [ ] Testar thoth_mem_mem_search
- [ ] Testar execução de task agent
- [ ] Verificar configLoaded = true

---

## 9. Referências

- `.openspec/skills/_shared/thoth-mem-convention.md`
- `.openspec/skills/_shared/persistence-contract.md`
- `~/.config/opencode/opencode.json`
- `~/.config/opencode/node_modules/@opencode-ai/plugin/`
