# PRD: Fluxo de Testes BDD com Relatórios Visuais para Validação Humana

**Status:** Rascunho
**Autor:** Time de Engenharia
**Data:** [YYYY-MM-DD]
**Versão:** 1.0

## 1. Problema / Oportunidade

Atualmente, os testes de aceitação (E2E) da aplicação Next.js são executados, mas seus resultados são puramente binários (passou/falhou) e exibidos apenas no console ou em logs de CI. Não existe um artefato visual consolidado que permita que Product Owners, Designers ou QA realizem uma **validação humana da experiência visual** após cada execução.

Isso gera:
- Necessidade de executar localmente para "ver como ficou".
- Dificuldade em rastrear regressões visuais.
- Baixa transparência para stakeholders não técnicos sobre o estado atual das features.

**Oportunidade:** Integrar um framework BDD (Cucumber + Playwright) que gere automaticamente um relatório HTML contendo **capturas de tela** de cada cenário executado, permitindo validação visual offline e colaborativa.

## 2. Público-Alvo Impactado

- **Desenvolvedores:** Terão um fluxo padronizado para escrever e depurar testes de aceitação.
- **QA / Testers:** Poderão validar cenários executados sem precisar rodar o ambiente local.
- **Product Owners / Designers:** Receberão relatórios auto-contidos com evidências visuais do comportamento implementado.
- **DevOps / CI:** O pipeline terá uma etapa de validação visual documentada.

## 3. Resultado Esperado (Alto Nível)

- Ao executar `npm run test:e2e`, todos os cenários descritos em Gherkin são validados contra uma instância da aplicação.
- Um arquivo `index.html` é gerado no diretório `reports/cucumber/`.
- O relatório HTML lista cada cenário e, ao expandi-lo, exibe **a screenshot da tela final** (e/ou de passos críticos) para inspeção visual.
- Qualquer pessoa pode abrir esse arquivo HTML (offline) e verificar se a interface corresponde ao esperado.

## 4. Critérios de Sucesso Preliminares

- [ ] **CS01:** É possível escrever um cenário em Gherkin (`.feature`) e executá-lo com sucesso usando Playwright.
- [ ] **CS02:** Após a execução de qualquer cenário (sucesso ou falha), uma screenshot da página é capturada e anexada ao resultado do teste.
- [ ] **CS03:** O comando de geração de relatório produz um HTML único que contém todas as imagens embutidas (Base64), sem links quebrados.
- [ ] **CS04:** O relatório pode ser aberto em qualquer navegador moderno sem necessidade de servidor web ou internet.
- [ ] **CS05:** O pipeline de CI falha se um cenário BDD falhar, e o relatório HTML é publicado como artefato da build.

## 5. Análise Inicial (a ser preenchida após análise)

### Viabilidade Técnica
- [x] Viável com arquitetura atual? **Sim**, a aplicação Next.js expõe uma URL local (`localhost:3000`) para testes.
- [x] Módulos/Serviços afetados? Nenhum código de produção é alterado. Adiciona dependências de desenvolvimento (`@cucumber/cucumber`, `@playwright/test`, `multiple-cucumber-html-reporter`).
- [x] Débitos técnicos bloqueantes? Nenhum.

### Impacto Estimado
- [ ] Breaking changes? Não.
- [ ] Migração necessária? Não, adiciona nova suíte de testes sem remover as existentes.
- [x] Novas dependências? Sim, listadas na seção de viabilidade.

## 6. Urgência

- [ ] Crítica - Bloqueia funcionalidade essencial
- [x] **Alta - Alto impacto no negócio** (melhora significativamente a confiança nas entregas e a comunicação com stakeholders)
- [ ] Média - Melhoria incremental
- [ ] Baixa - Nice to have

## 7. Referências

- **PRB.md:** `prd-fluxo-bdd-relatorios-visuais.md` (proposta original que motivou este PRD)
- **Documentação do Cucumber.js:** https://github.com/cucumber/cucumber-js
- **Playwright Screenshots:** https://playwright.dev/docs/screenshots
- **multiple-cucumber-html-reporter:** https://github.com/wswebcreation/multiple-cucumber-html-reporter
- **Template base:** `prd-template.md` (utilizado para estruturar este documento)