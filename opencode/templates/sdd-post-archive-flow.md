# SDD + Post-Archive Integration

Workflow completo do SDD integrado com a revisão obrigatória pós-arquivamento.

```mermaid
flowchart TD
    %% Estados principais do SDD
    A[("📝 Propose")] --> B[("📋 Spec")]
    B --> C[("🎨 Design")]
    C --> D[("✅ Tasks")]
    D --> E{"🔍 Plan Review Gate"}
    
    %% Decisão do Review
    E -->|"APPROVE ✅"| F[("⚙️ Execute")]
    E -->|"REJECT ❌"| G[("🔄 Voltar para fase bloqueada")]
    G -->|/^Propose/| A
    G -->|/^Spec/| B
    G -->|/^Design/| C
    G -->|/^Tasks/| D
    
    %% Pós-execução SDD
    F --> H[("🧪 Verify")]
    H --> I[("📦 Archive")]
    
    %% Post-Archive Review
    I --> J[("🔍 Post-Archive Review")]
    J --> K{"✅ Tudo OK?"}
    K -->|"SIM ✅"| L[("✨ Nova Change")]
    K -->|"NÃO ❌"| M[("📝 Criar New Change")]
    
    %% Nova change volta ao início
    L --> A
    M --> A
    
    %% Estilos
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#2196F3,color:#fff
    style F fill:#FF9800,color:#fff
    style G fill:#f44336,color:#fff
    style H fill:#9C27B0,color:#fff
    style I fill:#00BCD4,color:#fff
    style J fill:#FF5722,color:#fff
    style L fill:#4CAF50,color:#fff
    style M fill:#4CAF50,color:#fff
    
    %% Decisão estilo
    style E fill:#FFC107,color:#000
    style K fill:#FFC107,color:#000
```

**Integração Post-Archive**: Após o arquivamento, o fluxo entra na fase de `Post-Archive Review` que executa verificações finais. Se tudo estiver OK, inicia-se uma nova change. Se houver problema, cria-se uma nova change para correção.
