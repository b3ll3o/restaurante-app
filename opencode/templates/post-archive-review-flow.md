# Post-Archive Review

Workflow de verificação obrigatória após cada change ser arquivada — código, documentação e testes.

```mermaid
flowchart TD
    %% Estado inicial
    A[("🔍 Post-Archive Review")] --> B[("🔨 Código: Build")]
    
    %% Verificações de código
    B -->|"✅ Passa"| C[("📋 Lint")]
    B -->|"❌ Falha"| O[("📝 Criar New Change")]
    C -->|"✅ Passa"| D[("📘 Type Check")]
    C -->|"❌ Falha"| O
    D -->|"✅ Passa"| E[("🧪 Testes: Unit")]
    D -->|"❌ Falha"| O
    
    %% Verificações de testes
    E -->|"✅ Passa"| F[("🔬 Testes: Integration")]
    E -->|"❌ Falha"| O
    F -->|"✅ Passa"| G[("🌐 Testes: E2E")]
    F -->|"❌ Falha"| O
    G -->|"✅ Passa"| H[("📚 Documentação")]
    G -->|"❌ Falha"| O
    
    %% Verificações adicionais
    H -->|"✅ Passa"| I[("📦 Dependências")]
    H -->|"❌ Falha"| O
    I -->|"✅ Passa"| J[("🛤️ Cobertura de Rotas")]
    I -->|"❌ Falha"| O
    J -->|"✅ Passa"| K[("📋 Consolidação de Specs")]
    J -->|"❌ Falha"| O
    
    %% Finalização
    K -->|"✅ Tudo OK"| L[("✨ Nova Change")]
    K -->|"❌ Problema"| O
    L --> M[("🔄 Voltar ao SDD")]
    O --> M
    
    %% Estilos - Verde (OK/Final)
    style L fill:#4CAF50,color:#fff
    style M fill:#4CAF50,color:#fff
    
    %% Estilos - Azul (Processo)
    style B fill:#2196F3,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#2196F3,color:#fff
    style E fill:#2196F3,color:#fff
    style F fill:#2196F3,color:#fff
    style G fill:#2196F3,color:#fff
    style H fill:#2196F3,color:#fff
    style I fill:#2196F3,color:#fff
    style J fill:#2196F3,color:#fff
    style K fill:#2196F3,color:#fff
    
    %% Estilos - Vermelho (Erro)
    style O fill:#f44336,color:#fff
    style A fill:#FF5722,color:#fff
```

## 6 Fases da Verificação

| Fase | Verificação | Ferramentas |
|------|-------------|-------------|
| 1 | **Código** | Build, Lint, Type Check |
| 2 | **Testes Unitários** | Vitest / Jest |
| 3 | **Testes Integration** | Vitest |
| 4 | **Testes E2E** | Playwright |
| 5 | **Documentação** | Docs atualizadas |
| 6 | **Dependências + Rotas + Specs** | Consolidação final |

**Loop**: Se todas as verificações passarem → nova change SDD. Se qualquer falha ocorrer → criar new change para correção.
