# SDD Pipeline

Workflow completo do Software Design and Delivery (SDD) com portões de qualidade em cada fase de transição.

```mermaid
flowchart TD
    %% Estados principais
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
    
    %% Pós-execução
    F --> H[("🧪 Verify")]
    H --> I[("📦 Archive")]
    I --> J[("✨ Change Consolidade")]
    
    %% Estilos
    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#2196F3,color:#fff
    style F fill:#FF9800,color:#fff
    style G fill:#f44336,color:#fff
    style H fill:#9C27B0,color:#fff
    style I fill:#00BCD4,color:#fff
    style J fill:#4CAF50,color:#fff
    
    %% Decisão estilo
    style E fill:#FFC107,color:#000
```

**Portão de Revisão**: A fase `[Plan Review Gate]` pode aprovar ou rejeitar. Em caso de rejeição, o fluxo retorna para a fase apropriada (`Propose`, `Spec`, `Design` ou `Tasks`) para correções antes de prosseguir.
