# Status: Extrair Serviço WhatsApp

## Change ID

`whatsapp-service`

## Data de Início

2026-04-16

## Status Atual

⏳ Aguardando implementação

## Artefatos

| Artefato | Status |
|----------|--------|
| proposal.md | ✅ Criado |
| spec.md | ✅ Criado |
| design.md | ✅ Criado |
| tasks.md | ✅ Criado |
| status.md | ✅ Criado (este) |

## Arquivos a Modificar

- `lib/whatsapp.ts` (a criar)
- `app/api/orders/route.ts`

## Dependências

- Nenhuma

## Notas

- Esta change é necessária para alinhar com a arquitetura definida em `.openspec/AGENTS.md`
- O serviço atual inline em `route.ts` será extraído

## Próximos Passos

1. Aprovar spec e design
2. Executar tarefas de implementação
3. Verificar que lint e build passam
4. Testar manualmente