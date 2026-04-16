Esta **`proposal.md`** segue rigorosamente o fluxo **Spec-Driven Design (SDD)** para implementar o modelo de **Parceiro de Soluções** discutido anteriormente. O foco é tratar a especificação como a "fonte da verdade", garantindo que a IA implemente a lógica de transição entre automação e atendimento humano sem as ambiguidades do "vibe coding".

---

# Proposta Técnica: Gateway de Automação para Restaurantes (Cloud API)

## 1. Contexto e Domínio (DDD)
**Domínio:** Intermediação de atendimento para o setor de Food Service.
**Linguagem Ubíqua:**
*   **WABA (WhatsApp Business Account):** Conta de WhatsApp de propriedade do restaurante.
*   **Shared Account Model:** Modelo onde o restaurante concede acesso ao aplicativo do desenvolvedor.
*   **Bot Handover:** Processo de pausar o chatbot para permitir intervenção humana manual.
*   **Janela de Serviço:** Período de 24h após a última mensagem do cliente para trocas gratuitas.

## 2. Especificação Funcional (SDD - Phase 1: Specify)
O sistema deve gerenciar múltiplos identificadores de telefone (`WHATSAPP_PHONE_NUMBER_ID`) e tokens permanentes de sistema (`WHATSAPP_TOKEN`) para diferentes restaurantes.

### Regras de Negócio Core:
1.  **Monitoramento Ativo:** O webhook deve processar payloads JSON de entrada em tempo real para identificar a intenção do cliente.
2.  **Estado da Conversa:** Cada chat deve possuir um estado persistente (ex: `BOT_ACTIVE` ou `HUMAN_ONLY`) no banco de dados.
3.  **Toggle de Automação:** O restaurante deve poder enviar um comando ou clicar em um botão no painel administrativo para alterar o estado do chat para `HUMAN_ONLY`.
4.  **Prioridade de Resposta:** Se o estado for `BOT_ACTIVE`, o sistema processa a lógica de IA. Se for `HUMAN_ONLY`, o sistema apenas notifica o painel administrativo e ignora a resposta automática.

## 3. Cenários de Comportamento (BDD)
Estes cenários guiam a implementação do comportamento esperado através da sintaxe **Gherkin**.

**Funcionalidade: Gestão de Intervenção Humana**
*   **Cenário: Atendimento automático ativado**
    *   **Dado** que o estado da conversa com o `wa_id` está definido como `BOT_ACTIVE`.
    *   **Quando** o webhook recebe uma mensagem de texto do cliente.
    *   **Então** o sistema deve processar a intenção e enviar uma resposta automática usando a Cloud API.

*   **Cenário: Restaurante assume a conversa (Handover)**
    *   **Dado** que o restaurante alterou o status para `HUMAN_ONLY` via painel.
    *   **Quando** o cliente envia uma nova mensagem.
    *   **Então** o sistema deve salvar a mensagem no histórico e notificar o restaurante.
    *   **E** não deve disparar nenhuma lógica de resposta automática do bot.

## 4. Plano de Implementação Técnica (SDD - Phase 2: Plan)
Definição das restrições para a IA geradora de código.

*   **Infraestrutura:** Uso obrigatório da **WhatsApp Cloud API** hospedada pela Meta para garantir throughput de 500 msg/seg.
*   **Segurança:** Utilizar tokens de **System User** permanentes gerados no Business Manager para evitar expiração em 24h.
*   **Webhook Resilience:** O servidor deve retornar HTTP 200 OK imediatamente após o recebimento do payload para evitar reenvios agressivos da Meta.
*   **Gerenciamento de Estado:** Persistir o par `{phone_number_id: state}` em um cache (ex: Redis) para decisões de roteamento rápidas de milissegundos.

## 5. Critérios de Aceitação e Validação (ATDD)
A funcionalidade será considerada concluída apenas se atender a estes testes:
1.  O sistema identifica corretamente qual restaurante deve receber a mensagem baseando-se no `business_phone` do payload.
2.  A transição de estado entre bot e humano ocorre em menos de 1 segundo após o comando do restaurante.
3.  O sistema deve diferenciar mensagens interativas (`button_reply`) de mensagens de texto puro para roteamento correto.
4.  O código deve suportar a recepção de variáveis de ambiente dinâmicas por restaurante para escala.

---

### Próximo Passo para a IA:
Use este arquivo para gerar o **`unit_tests_checklist.md`** (fase de TDD) e os **`step_definitions`** baseados no Gherkin acima.