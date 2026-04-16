# Design: Validação de WhatsApp e Mensagens de Erro

## Fonte da Verdade

Este documento detalha as decisões arquiteturais para a implementação da validação de WhatsApp.

---

## 1. Validação de WhatsApp

### 1.1 Algoritmo de Validação

```typescript
function validateWhatsApp(whatsapp: string): boolean {
  // Remove todos os caracteres não numéricos
  const cleaned = whatsapp.replace(/\D/g, '');

  // Aceita 10 a 13 dígitos:
  // 10 dígitos: DDD + número (sem DDI)
  // 11 dígitos: DDD + número + 9 adicional (celular padrão)
  // 12 dígitos: DDI 55 + DDD + número
  // 13 dígitos: DDI 55 + DDD + número + 9 (celular com DDI)
  return cleaned.length >= 10 && cleaned.length <= 13;
}
```

### 1.2 Localização

A validação está no componente `app/menu/[slug]/page.tsx` (cardápio público), pois:
- É onde o checkout acontece
- Requer interação imediata com o usuário
- Validação server-side adicional existe/não existe na API (a ser verificado)

### 1.3 Estados de Erro

| Estado | Descrição |
|--------|-----------|
| `whatsappError` | Mensagem de erro a exibir |

### 1.4 Comportamentos

- Erro é setado quando validação falha
- Erro é limpo quando usuário digita (onChange)
- Erro é limpo ao navegar entre etapas (cart ↔ checkout)

---

## 2. Feedback Visual

### 2.1 Borda Vermelha

```tsx
<Input
  className={whatsappError ? "border-red-500 focus:border-red-500" : ""}
/>
```

### 2.2 Mensagem de Erro

```tsx
{whatsappError && (
  <p className="text-xs text-red-500 mt-1">{whatsappError}</p>
)}
```

---

## 3. Supabase Client Warning

### 3.1 Implementação

```typescript
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[MenuLink] Variáveis de ambiente do Supabase não configuradas. " +
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias."
    );
  }

  return createBrowserClient(supabaseUrl || "", supabaseKey || "");
}
```

### 3.2 Localização

`lib/supabase/client.ts` - Cliente Supabase para browser.

---

## 4. Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `app/menu/[slug]/page.tsx` | Adicionado estado `whatsappError`, função `validateWhatsApp()`, validação no `handlePlaceOrder`, feedback visual no Input |
| `lib/supabase/client.ts` | Adicionada verificação de variáveis de ambiente |

---

## 5. Tradeoffs

| Decisão | Tradeoff |
|---------|----------|
| Validação client-side | Melhora UX mas pode ser burlada |
| Console.error para Supabase | Visível no console, não na UI |

---

## 6. Testes Necessários

- Unitários: `validateWhatsApp()` com casos válidos e inválidos
- Integração: Fluxo de checkout com WhatsApp inválido
- E2E: Checkout completo

---

## Status

Design