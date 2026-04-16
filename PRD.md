Este **PRD (Product Requirements Document)** descreve a implementação de uma estratégia de testes **100% automatizada** para uma aplicação Next.js 16, eliminando a necessidade de verificações manuais e garantindo a confiabilidade de cada deploy.

---

# PRD: Estratégia de Automação de Testes Full-Stack (Next.js 16)

## 1. Visão Geral e Objetivos
O objetivo principal é criar um sistema de defesa multicamadas que valide desde a lógica de negócio isolada até a interface visual final. A automação total visa **acelerar o ciclo de entrega**, reduzir o débito técnico e garantir que novos recursos não quebrem funcionalidades existentes.

## 2. Pilares Tecnológicos
Para alcançar a automação total sem testes manuais, a stack será composta por:
*   **Vitest:** Para testes unitários e de integração devido à sua velocidade (10-20x mais rápido que Jest) e suporte nativo a ESM e TypeScript.
*   **Playwright:** Ferramenta principal para testes **End-to-End (E2E)** e de interface, oferecendo suporte cross-browser superior e arquitetura WebSocket resiliente.
*   **Playwright BDD (Gherkin):** Para transformar requisitos de negócio escritos em linguagem natural em testes executáveis.
*   **Mock Service Worker (MSW):** Para interceptar chamadas de API e RPC tanto no lado do cliente quanto no servidor, garantindo testes determinísticos.
*   **Percy:** Para automação de **regressão visual**, detectando mudanças acidentais de CSS ou layout que testes funcionais ignoram.

## 3. Arquitetura de Testes e Cobertura
A aplicação seguirá a filosofia do **"Testing Trophy"**, priorizando testes de integração que verificam a colaboração entre componentes.

### Metas de Cobertura Aceitáveis:
*   **Lógica de Negócio (Core):** **90% ou mais** de cobertura através de testes unitários e de integração com Vitest.
*   **Fluxos Críticos (E2E):** **100% de cobertura** das jornadas críticas do usuário (ex: login, checkout, criação de tarefas) via Playwright.
*   **Interface Visual:** Cobertura de 100% das páginas principais e componentes complexos para evitar regressões visuais.

## 4. Estratégia por Camadas

### 4.1. Unidade e Integração (Vitest + RTL)
*   **Componentes Síncronos:** Validados com Vitest e React Testing Library, focando no comportamento e não na implementação.
*   **Server Actions e RPC:** Testados tratando o servidor como a fronteira principal, mockando apenas chamadas de banco de dados ou RPC e não a Action em si.

### 4.2. Interface e E2E (Playwright + BDD)
*   **Cenários em Gherkin:** Escritos no formato `Given/When/Then` para servir como documentação viva e especificação técnica.
*   **Page Object Model (POM):** Obrigatório para encapsular seletores e lógica de interação, tornando os testes resistentes a mudanças na UI.
*   **Locators Acessíveis:** Prioridade absoluta para `getByRole`, `getByLabel` e `getByText`, imitando a interação real do usuário.

### 4.3. Regressão Visual (Percy)
*   **Baseline Management:** Comparação automática de screenshots contra uma base aprovada em cada Pull Request.
*   **Estabilização:** Desativação de animações via `reducedMotion: 'reduce'` e uso de máscaras para ocultar dados dinâmicos como IDs ou datas.

## 5. Mocking e Estabilidade
*   **Ambientes Isolados:** Uso de bases de dados separadas para desenvolvimento, integração e E2E para evitar interferências e testes "flaky".
*   **Next.js Experimental Test Mode:** Utilizar `next --experimental-test` para habilitar o proxy de rede que permite ao MSW interceptar fetches no lado do servidor.
*   **fetchLoopback:** Ativar como "escape hatch" para garantir que requisições não mockadas não abortem o teste.

## 6. Integração Contínua (CI/CD)
*   **GitHub Actions:** Pipeline automatizado que executa toda a suíte de testes (lint, unitários, integração, E2E e visual) antes de permitir o merge.
*   **Native Sharding:** Utilizar a capacidade do Playwright de distribuir testes em múltiplos containers paralelos para reduzir o tempo de execução na CI.
*   **Husk/Lint-Staged:** Impedir commits que violem padrões de código ou que quebrem testes unitários rápidos localmente.

## 7. Melhores Práticas de Implementação
*   **Clean Architecture:** Manter a lógica de domínio independente do framework Next.js para facilitar mocks e testes isolados.
*   **Explicit Caching:** Aproveitar a diretiva `'use cache'` do Next.js 16 para tornar o comportamento de dados previsível e fácil de testar.
*   **Evitar IDs e Classes:** Não utilizar seletores CSS ou XPATH amarrados à implementação; focar em atributos que o usuário interage diretamente.