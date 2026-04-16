@integration-test="tests/integration/signup.test.ts"
Funcionalidade: Cadastro de Administrador

Cenário: Admin cria conta com dados válidos
Dado que o admin está na página de cadastro
Quando preenche "João Silva" no campo nome
E preenche "joao@restaurante.com" no campo email
E preenche "senha123" no campo senha
E preenche "senha123" no campo confirmação
E clica em "Criar Conta"
Então deve redirecionar para o dashboard
E a conta deve ser criada no sistema

Cenário: Admin tenta criar conta com email já existente
Dado que existe conta com email "joao@restaurante.com"
E o admin está na página de cadastro
Quando preenche "João Silva" no campo nome
E preenche "joao@restaurante.com" no campo email
E preenche "senha123" no campo senha
E preenche "senha123" no campo confirmação
E clica em "Criar Conta"
Então deve permanecer na página de cadastro
E deve exibir mensagem de erro "Este email já está em uso"

Cenário: Admin tenta criar conta com senhas diferentes
Dado que o admin está na página de cadastro
Quando preenche "João Silva" no campo nome
E preenche "joao@restaurante.com" no campo email
E preenche "senha123" no campo senha
E preenche "senha456" no campo confirmação
E clica em "Criar Conta"
Então deve permanecer na página de cadastro
E deve exibir mensagem de erro "As senhas não coincidem"