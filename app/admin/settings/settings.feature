@integration-test="tests/integration/settings.test.ts"
Funcionalidade: Configurações do Restaurante

Cenário: Admin acessa página de configurações e vê dados atuais
Dado que o admin está autenticado no painel
Quando acessa a página "/admin/settings"
Então o sistema deve exibir o nome do restaurante cadastrado
E deve exibir o WhatsApp configurado
E deve exibir o slug do cardápio público

Cenário: Admin edita nome do restaurante com sucesso
Dado que o admin está na página de configurações
Quando preenche "Novo Restaurante" no campo nome
E clica em "Salvar Alterações"
Então o sistema deve salvar a alteração
E deve exibir mensagem de sucesso

Cenário: Admin edita WhatsApp com formato válido
Dado que o admin está na página de configurações
Quando preenche "+55 11 99999-8888" no campo WhatsApp
E clica em "Salvar Alterações"
Então o sistema deve salvar a alteração
E deve exibir mensagem de sucesso

Cenário: Admin tenta editar com nome vazio
Dado que o admin está na página de configurações
Quando limpa o campo nome
E clica em "Salvar Alterações"
Então o sistema deve exibir mensagem de erro "Nome é obrigatório"
E não deve salvar a alteração

Cenário: Admin tenta editar com WhatsApp inválido
Dado que o admin está na página de configurações
Quando preenche "123" no campo WhatsApp
E clica em "Salvar Alterações"
Então o sistema deve exibir mensagem de erro "WhatsApp inválido"
E não deve salvar a alteração

Cenário: Admin copia link do cardápio público
Dado que o admin está na página de configurações
Quando clica no botão "Copiar Link"
Então o sistema deve copiar a URL "/menu/{slug}" para a área de transferência
E deve exibir mensagem "Link copiado!"

Cenário: Link do cardápio contém o slug correto
Dado que o restaurante tem slug "meu-restaurante"
Quando o admin acessa a página de configurações
Então o link exibido deve ser "/menu/meu-restaurante"