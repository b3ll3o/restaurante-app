# PRD: 006 - Data Security Protection

**ID:** 006-2026-04-17-data-security
**Status:** draft
**Phase:** prompt
**Autor:** AI Agent
**Data:** 2026-04-17
**Última Revisão:** 2026-04-17

---

## 0. Objetivos de Negócio

- **Objetivo 1:** Proteger dados sensíveis de clientes (nome, WhatsApp, pedidos)
- **Objetivo 2:** Garantir conformidade com LGPD para dados de brasileiros
- **Objetivo 3:** Evitar exposição de dados sensíveis em logs, erros e respostas de API

---

## 1. Problema

### 1.1 Descrição do Problema

Dados sensíveis de clientes (nome, WhatsApp, histórico de pedidos) estão expostos em:
- Respostas de API sem filtragem adequada
- Logs de erro que expõem dados de REQUEST/RESPONSE
- Console do navegador exibindo dados sensíveis
- URLs contendo parâmetros sensíveis (ex: `?whatsapp=5511999999999`)

### 1.2 Contexto

**Dados sensíveis identificados:**

| Dado | Sensibilidade | Risco |
|------|--------------|--------|
| `customer_whatsapp` | Alta | Exposição de telefone pessoal |
| `customer_name` | Média | Identificação pessoal |
| `payment_method` | Média | Dados financeiros parciais |
| `order_items` | Média | Histórico de consumo |

**Pontos de exposição:**

1. **API `/api/orders`** - Response inclui todos os dados do pedido
2. **Console logs** - Dados de customers sendo logados
3. **URL params** - WhatsApp aparecendo em URLs
4. **Supabase RLS** - Policies podem não estar corretamente configuradas

### 1.3 Evidências

- [Evidência 1: API não filtra campos sensíveis antes de retornar]
- [Evidência 2: `lib/utils.ts` ou handlers têm console.log com dados de request]
- [Evidência 3: URLs com query params sensíveis não são masked]

---

## 2. Oportunidade

### 2.1 Oportunidade Identificada

Implementar camada de proteção de dados sensíveis:
1. Sanitização de logs (remover dados sensíveis)
2. Filtragem de responses de API
3. Mascaramento de dados em URLs
4. Configuração estrita de RLS no Supabase

### 2.2 Benefícios Esperados

| Benefício | Antes | Depois |
|-----------|-------|--------|
| Conformidade LGPD | Não compliance | Parcialmente compliant |
| Exposição de dados | WhatsApp exposto | WhatsApp mascarado |
| Logs seguros | Dados em plaintext | Dados sanitizados |
| RLS | Policies básicas | Policies restritivas |

---

## 3. Personas e Stakeholders

### 3.1 Personas Primárias

- **Cliente Final (Customer):** Dados de WhatsApp e nome protegidos
  - **Necessidades:** Privacidade de seus dados pessoais
  - **Dores:** Telefone exposto em URLs e logs

- **Dono de Restaurante (Owner):** Dados de clientes seguros
  - **Necessidades:** Não acumular dados sensíveis desnecessários
  - **Dores:** Responsabilidade legal por dados de clientes

### 3.2 Stakeholders Impactados

| Stakeholder | Impacto | Comunicação |
|-------------|---------|-------------|
| Dev Team | Padrões de segurança a seguir | Training de LGPD |
| clientes | Dados mais protegidos | Transparência |

---

## 4. Resultado Esperado

### 4.1 Descrição do Resultado

1. **Sanitização de Logs**
   - Criar `lib/sanitize.ts` com funções para mascarar dados sensíveis
   - Todos os `console.log` devem usar sanitização
   - Logs não devem conter: WhatsApp, nomes completos, dados de pagamento

2. **Filtragem de API Responses**
   - API `/api/orders` filtra campos sensíveis antes de retornar
   - Response não expõe `customer_whatsapp` diretamente (apenas para owner)

3. **Mascaramento de URLs**
   - WhatsApp em URLs deve ser mascarado: `5511999999999` → `****9999`
   - Query params sensíveis não aparecem em logs

4. **RLS Revisão**
   - Verificar policies de `orders` e `order_items`
   - Garantir que customers só veem seus próprios pedidos

### 4.2 Critérios de Aceitação

- [ ] **CA-01:** `lib/sanitize.ts` criado com funções `maskWhatsApp`, `maskName`, `sanitizeLog`
- [ ] **CA-02:** Logs de `/api/orders` não contêm dados sensíveis
- [ ] **CA-03:** Response da API filtra campos conforme necessidade
- [ ] **CA-04:** URLs com WhatsApp mostram número mascarado
- [ ] **CA-05:** RLS policies verificadas e corrigidas
- [ ] **CA-06:** Build passa (npm run build)
- [ ] **CA-07:** Lint passa sem novos errors
- [ ] **CA-08:** Testes passam

### 4.3 fora do Escopo

**NÃO está Included:**
- Criptografia de dados em repouso (Supabase já faz)
- Sistema de consentimento LGPD completo
- Auditoria de acesso a dados
- Portabilidade de dados (LGPD art. 18)

**Explicitamente fora:**
- Mudanças no schema do banco
- Alteração de autenticação

---

## 5. Alternativas Consideradas

### 5.1 Alternativa A: Não fazer (manter como está)

**Descrição:** Continuar sem proteção adicional de dados.

**Prós:**
- Nenhum desenvolvimento necessário

**Contras:**
- Não compliance com LGPD
- Risco de exposição de dados
- Responsabilidade legal

**Por que foi descartada:** Risco legal e de reputação alto.

### 5.2 Alternativa B: Usar biblioteca de sanitização (ex: node-sanitize)

**Descrição:** Instalar biblioteca third-party para sanitização.

**Prós:**
- Implementação rápida
- Biblioteca já testada

**Contras:**
- Nova dependência
- Overhead de bundle

**Por que foi descartada:** Solução customizada é simples demais para justificar dependência.

### 5.3 Alternativa Escolhida

**Justificativa:** Implementar `lib/sanitize.ts` customizado. Funções simples de mascaramento não justificam dependência externa.

---

## 6. Trade-offs

### 6.1 Trade-offs Conhecidos

| Trade-off | Sem Sanitização | Com Sanitização | Decisão |
|-----------|-----------------|-----------------|---------|
| Performance | Melhor | Mínimo overhead | Sanitização |
| Complexidade | Menor | Mínima | Sanitização |
| Segurança | Risco alto | Mitigado | Sanitização |

### 6.2 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Sanitização incompleta | Média | Alto | Code review + testes |
| Breaking API response | Baixa | Médio | Manter compatibilidade |

---

## 7. Análise Técnica

### 7.1 Viabilidade Técnica

- [x] Viável com arquitetura atual? **Sim** - apenas criar utilitário e usar
- [x] Módulos/Serviços afetados? **`lib/sanitize.ts`, API routes**
- [x] Débitos técnicos bloqueantes? **Nenhum**

### 7.2 Impacto Técnico

- [ ] Breaking changes? **Possível** - se API response mudar formato
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

### 7.3 Módulos Afetados

| Módulo | Impacto | Mudanças Necessárias |
|--------|--------|---------------------|
| `lib/sanitize.ts` | Alto | Criar módulo novo |
| `app/api/orders/route.ts` | Médio | Usar sanitização em logs |
| `app/menu/[slug]/page.tsx` | Médio | Mascarar WhatsApp em URLs |

---

## 8. Estimativas

### 8.1 Effort

| Tamanho | XS | S | M | L | XL |
|---------|----|----|----|----|----|
| Estimativa | | 4h | | | |

### 8.2 Prioridade

| Critério | Valor | Peso | Score |
|----------|-------|------|-------|
| Value (1-10) | 9 | 0.3 | 2.7 |
| Urgency (1-10) | 8 | 0.25 | 2.0 |
| Confidence (0.5-1) | 1.0 | 0.2 | 0.2 |
| Effort (1-10) | 2 | 0.25 | 0.5 |
| **TOTAL** | | | **5.4** |

---

## 9. Requirements Interview

### 9.1 Perguntas e Respostas

#### Q1: Qual nível de mascaramento é aceito?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** WhatsApp: mostrar últimos 4 dígitos (****9999). Nome: primeira letra + asteriscos (M****).

#### Q2: O owner do restaurante deve ver WhatsApp completo dos clientes?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Sim, para poder entrar em contato. O mascaramento é para logs, URLs públicas e exposição externa.

#### Q3: Dados de pagamento (PIX) precisam de proteção especial?
- **Tipo:** clarification
- **Data:** 2026-04-17
- **Resposta:** Não expor chave PIX em logs. Método (PIX/Dinheiro) pode aparecer, mas não dados da chave.

### 9.2 Resumo do Interview

- WhatsApp: mascarar em logs/URLs, owner vê completo
- Nome: mascarar em logs públicos
- PIX: não logar chave, apenas método

---

## 10. Arquitetura Proposta

### 10.1 Estrutura de `lib/sanitize.ts`

```typescript
/**
 * Sanitização de dados sensíveis para logs e exposição
 */

// Mascarar WhatsApp: 5511999999999 → ****9999
export function maskWhatsApp(whatsapp: string): string {
  if (!whatsapp || whatsapp.length < 4) return '****';
  return '****' + whatsapp.slice(-4);
}

// Mascarar nome: Maria Silva → M****
export function maskName(name: string): string {
  if (!name || name.length < 2) return '****';
  return name[0] + '****';
}

// Sanitizar objeto para log (remove campos sensíveis)
export function sanitizeForLog<T extends Record<string, unknown>>(
  obj: T,
  fieldsToRemove: string[] = ['whatsapp', 'customer_whatsapp', 'password']
): Partial<T> {
  const sanitized = { ...obj };
  fieldsToRemove.forEach(field => delete sanitized[field]);
  return sanitized;
}

// Sanitizar URL (remove query params sensíveis)
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = ['whatsapp', 'phone', 'tel'];
    sensitiveParams.forEach(param => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch {
    return url;
  }
}
```

### 10.2 Usage Examples

```typescript
// Em API route
console.log('Order created:', sanitizeForLog(order));

// Em WhatsApp link
const maskedWhatsApp = maskWhatsApp(customerWhatsapp);
const whatsappUrl = `https://wa.me/${customerWhatsapp}`; // Owner vê completo
// URL pública não deve conter WhatsApp como query param
```

---

## 11. Regras de Segurança (Seção Proposta)

Adicionar nova seção em `menulink-rules.md`:

```markdown
## X. Regras de Segurança de Dados

### X.1 Dados Sensíveis

| Dado | Classificação | Proteção |
|------|---------------|----------|
| customer_whatsapp | Sensível | Mascarar em logs/URLs |
| customer_name | Pessoal | Mascarar em logs públicos |
| payment_key (PIX) | Crítico | Nunca logar |

### X.2 Sanitização

- TODO console.log deve usar sanitizeForLog()
- URLs públicas não devem conter query params com dados sensíveis
- Dados de customers nunca devem aparecer em stack traces

### X.3 RLS Policies

- Orders: customers veem apenas seus próprios pedidos
- Order_items: isolado por order_id
- Restaurants: owners veem apenas seu restaurante
```

---

## 12. Prompt Original

> crie um prd para protegermos os dados sensiveis de nossos usuarios

---

## 13. Rastreabilidade

| Campo | Valor |
|-------|-------|
| Change ID | data-security |
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