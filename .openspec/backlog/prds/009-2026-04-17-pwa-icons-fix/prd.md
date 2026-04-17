# PRD: 009 - PWA Icons Fix

**ID:** 009-2026-04-17-pwa-icons-fix
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Eliminar erros 404 de ícones PWA
- **Objetivo 2:** Garantir que manifest.json referencia ícones válidos
- **Objetivo 3:** PWA instalável sem warnings de ícones

---

## 1. Problema

### 1.1 Descrição do Problema

Console mostra erros de recursos 404 para ícones PWA:

```
/icon-192.png:1  Failed to load resource: the server responded with a status of 404 ()
(index):1 Error while trying to use the following icon from the Manifest: https://.../icon-192.png (Download error or resource isn't a valid image)
```

### 1.2 Contexto

**Arquivos faltantes:**
| Arquivo | Tamanho | Propósito |
|---------|---------|-----------|
| `icon-192.png` | 192x192 | Ícone PWA (phone) |
| `icon-512.png` | 512x512 | Ícone PWA (tablet/desktop) |

**Arquivo existente:**
- `public/manifest.json` ✅ (existe e referencia os ícones)

### 1.3 Evidências

- [Evidência 1: Console Error 404 para icon-192.png]
- [Evidência 2: Console Error para icon da Manifest]
- [Evidência 3: manifest.json referencia ícones inexistentes]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Gerar ícones PWA corretos:
1. Criar SVG base com logo MenuLink
2. Gerar PNGs nos tamanhos necessários (192x192, 512x512)
3. Atualizar manifest.json se necessário

### 2.2 Benefícios Esperados

| Benefício | Antes | Depois |
|-----------|-------|--------|
| Console errors | 2 (ícones 404) | 0 |
| PWA instalável | Parcial | Completo |
| Ícones válidos | Não | Sim |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Usuário PWA:** Instala app no celular
  - **Necessidades:** Ícone válido para instalação
  - **Dores:** Ícone quebrado na home screen

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto |
|-------------|---------|
| Dev Team | Build limpa de warnings |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Ícones PWA válidos**
   - `public/icon-192.png` (192x192)
   - `public/icon-512.png` (512x512)

2. **Manifest válido**
   - `public/manifest.json` com ícones corretos

3. **Console sem erros**
   - Nenhum 404 para ícones

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** `public/icon-192.png` existe e é 192x192px
- [ ] **CA-02:** `public/icon-512.png` existe e é 512x512px
- [ ] **CA-03:** manifest.json não causa 404
- [ ] **CA-04:** Build passa sem warnings de ícones
- [ ] **CA-05:** PWA pode ser instalado (testar em Chrome DevTools)

### 4.3 fora do Escopo

**NÃO está Included:**
- Gerar ícones em outros formatos (favicon.ico, apple-touch-icon)
- Service Worker customizado
- Offline functionality enhancements

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Gerar ícones via CDN/Script

**Descrição:** Usar script para gerar ícones de um SVG base.

**Prós:**
- Automatizado
- Regenerar quando logo muda

**Contras:**
- Mais complexo
- Requer dependency

**Por que foi descartada:** Overkill para um fix pontual.

### 5.2 Alternativa B: Criar SVG simples

**Descrição:** Criar SVG com logo simples e referenciá-lo no manifest.

**Prós:**
- Simples
- Resolution-independent

**Contras:**
- Browser support limitado para SVG em manifest
- PWA precisa PNG

**Por que foi descartada:** PWA spec requer PNG.

### 5.3 Alternativa Escolhida

**Justificativa:** Criar PNGs simples via canvas/script inline ou usar placeholder. Solução mais direta.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Impacto |
|-----------|---------|
| Ícone placeholder vs real | Aparência |
| Tamanho vs qualidade | Performance |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim**
- [x] Módulos/Serviços afetados? **`public/`**
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não** (opcional: sharp para gerar)

### 7.3 Arquivos a Modificar

| Arquivo | Mudanças |
|---------|----------|
| `public/icon-192.png` | Criar |
| `public/icon-512.png` | Criar |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | 1h | | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 7 | 0.3 | 2.1 |
| Urgency (1-10) | 6 | 0.25 | 1.5 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 1 | 0.25 | 0.25 |
| **TOTAL** | | | **4.05** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Existe logo oficial do MenuLink para usar nos ícones?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Usar placeholder com "M" estilizado ou ícone genérico de restaurante. Implementação simples.

#### Q2: Podemos usar SVG em vez de PNG?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Não - PWA manifest requer PNG para ícones. SVG pode ser usado como favicon.

### 9.2 Resumo do Interview

- Usar placeholder "M" estilizado
- PNG 192x192 e 512x512
- Manter manifest.json existente

---

## 10. Solução Proposta

### 10.1 Opção 1: Script Node.js para Gerar PNGs

Criar script simples que gera PNGs:

```javascript
// scripts/generate-pwa-icons.mjs
import { createCanvas } from 'canvas';

function generateIcon(size, text) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#dc2626'; // theme_color
  ctx.fillRect(0, 0, size, size);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.6}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size/2, size/2);

  return canvas.toBuffer('image/png');
}

// Generate icons
require('fs').writeFileSync('public/icon-192.png', generateIcon(192, 'M'));
require('fs').writeFileSync('public/icon-512.png', generateIcon(512, 'M'));
```

### 10.2 Opção 2: Placeholder com Border-radius (CSS-only visual)

Placeholder PNG simples pode ser criado offline.

### 10.3 Opção 3: Usar `sharp` (se disponível)

```bash
npm install --save-dev sharp
```

```javascript
import sharp from 'sharp';

const svg = `
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#dc2626" rx="24"/>
  <text x="96" y="96" font-size="96" fill="white" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="bold">M</text>
</svg>`;

await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icon-512.png');
```

---

## 11. Arquivos a Criar

| Arquivo | Conteúdo |
|---------|----------|
| `public/icon-192.png` | PNG 192x192 com "M" vermelho |
| `public/icon-512.png` | PNG 512x512 com "M" vermelho |
| `scripts/generate-pwa-icons.mjs` | Script para regenerar ícones (opcional) |

---

## 12. Prompt Original

> crie um prd para corrigir esse erros que estao aparecendo no console. ref: 0~79qoe0z7ble.js:1 Service Worker registrado: https://restaurante-app-git-main-b3ll3os-projects.vercel.app/
/icon-192.png:1  Failed to load resource: the server responded with a status of 404 ()
(index):1 Error while trying to use the following icon from the Manifest: https://restaurante-app-git-main-b3ll3os-projects.vercel.app/icon-192.png (Download error or resource isn't a valid image)

---

## 13. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | pwa-icons-fix |
| Commit | TBD |
| Sprint | 2026-04-Sprint-3 |

---

## 14. Histórico de Fases

| Data | Fase | Status | Notas |
|------|------|--------|-------|
| 2026-04-17 | prompt | done | PRD criado |

---

**Versão:** 1.0
**Última Atualização:** 2026-04-17
**Autor:** AI Agent