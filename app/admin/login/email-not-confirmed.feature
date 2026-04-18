@e2e
@critical
@integration-test="tests/e2e/login-email-not-confirmed.spec.ts"
Funcionalidade: Login com Email Não Confirmado

  Como um usuário que criou uma conta mas não confirmou o email
  Eu quero ver uma mensagem clara e uma opção de reenvio
  Para que eu possa completar meu cadastro

  Cenário: Usuário tenta login sem confirmar email
    Dado que o usuário criou uma conta com "ana@restaurante.com"
    Mas não confirmou o email de confirmação
    Quando tenta fazer login com "ana@restaurante.com" e senha correta
    Então o sistema deve exibir mensagem "Você ainda não confirmou seu email. Clique no link enviado para ana@restaurante.com ou solicite um novo email de confirmação."
    E deve oferecer botão "Reenviar email de confirmação"

  Cenário: Usuário solicita reenvio de email de confirmação
    Dado que o usuário está na tela de erro "email não confirmado"
    Quando clica em "Reenviar email de confirmação"
    Então o sistema deve reenviar o email de confirmação para "ana@restaurante.com"
    E deve exibir toast de sucesso com "Email de confirmação reenviado!"
    E o botão deve ser desabilitado temporariamente para evitar spam

  Cenário: Usuário tenta reenviar email múltiplas vezes
    Dado que o usuário está na tela de erro "email não confirmado"
    Quando clica em "Reenviar email de confirmação" 3 vezes rapidamente
    Então o sistema deve reenviar apenas 1 email
    E deve exibir toast de erro de rate limiting se aplicável

  Cenário: Erro de credenciais inválidas
    Dado que o usuário tentou fazer login com "usuario@email.com"
    Mas errou a senha
    Quando o Supabase retorna erro "invalid_credentials"
    Então o sistema deve exibir mensagem "Email ou senha incorretos"
    E não deve oferecer botão de reenvio de email

  Cenário: Prevenção de enumeração de emails
    Dado que o usuário tentou fazer login com "naoexiste@email.com"
    E esta conta não existe no sistema
    Quando o Supabase retorna erro "invalid_credentials"
    Então o sistema deve exibir a mesma mensagem "Email ou senha incorretos"
    E não deve revelar se o email existe ou não no sistema
