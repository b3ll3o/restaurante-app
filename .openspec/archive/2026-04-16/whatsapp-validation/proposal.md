# Proposta: Validação de WhatsApp e Mensagens de Erro

## Problema

O campo WhatsApp no checkout do cardápio público aceita qualquer valor, incluindo números inválidos. Além disso, quando o Supabase não está configurado, o erro mostrado é técnico e não amigável.

## Solução Proposta

1. Adicionar validação de formato brasileiro para WhatsApp (10-13 dígitos numéricos)
2. Adicionar mensagem de erro inline quando WhatsApp é inválido
3. Adicionar verificação de variáveis de ambiente no Supabase client com warning no console

## Impacto

- [ ] Breaking changes? **Não**
- [ ] Migração necessária? **Não**
- [ ] Novos dependencies? **Não**

## Alternativas Consideradas

1. **Usar biblioteca de validação de telefone** (ex: `libphonenumber-js`) - Adicionaria dependência externa desnecessária para validação simples
2. **Validar apenas no backend** - A validação client-side melhora UX mas não substitui validação server-side

## Urgência

- [ ] Crítica
- [x] Alta
- [ ] Média
- [ ] Baixa

## Status

Proposta