@integration-test="tests/integration/login.test.ts"
Funcionalidade: Autenticação de Administrador

Cenário: Admin faz login com credenciais válidas
Dado que o admin está na página de login
Quando preenche "admin@restaurante.com" no campo email
E preenche "senha123" no campo senha
E clica em "Entrar"
Então deve redirecionar para o dashboard
E deve exibir mensagem de boas-vindas

Cenário: Admin faz login com credenciais inválidas
Dado que o admin está na página de login
Quando preenche "admin@restaurante.com" no campo email
E preenche "senhaerrada" no campo senha
E clica em "Entrar"
Então deve permanecer na página de login
E deve exibir mensagem de erro "Email ou senha incorretos"

Cenário: Admin tenta login com email inválido
Dado que o admin está na página de login
Quando preenche "email-invalido" no campo email
E preenche "senha123" no campo senha
E clica em "Entrar"
Então deve permanecer na página de login
E deve exibir mensagem de erro "Email inválido"

Cenário: Admin tenta login com campos vazios
Dado que o admin está na página de login
Quando deixa o campo email vazio
E deixa o campo senha vazio
E clica em "Entrar"
Então deve permanecer na página de login
E deve exibir mensagens de erro nos campos obrigatórios