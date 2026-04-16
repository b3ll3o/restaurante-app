@integration-test="tests/integration/dashboard.test.ts"
Funcionalidade: Dashboard do Administrador

Cenário: Admin acessa dashboard
Dado que o admin está autenticado
Quando acessa a página do dashboard
Então deve exibir as métricas do dia
E deve exibir atalhos rápidos

Cenário: Admin visualiza métricas de pedidos
Dado que o admin está no dashboard
Então deve exibir quantidade de pedidos hoje
E deve exibir quantidade de pedidos pendentes
E deve exibir receita do dia

Cenário: Admin acessa dashboard sem estar autenticado
Dado que o admin não está autenticado
Quando acessa a página do dashboard
Então deve redirecionar para a página de login