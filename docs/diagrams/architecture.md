# Architecture Diagrams

Mermaid diagrams for the overall system architecture.

Rendered automatically on GitHub. For local rendering, use the [Mermaid Live Editor](https://mermaid.live).

---

## 1. System Layers

The six layers of the design system, from inputs to audit output.

```mermaid
graph TB
    subgraph Inputs["Layer 1 — Decision Primitives"]
        P1[P1 Risk]
        P2[P2 Confidence]
        P3[P3 Capability]
        P4[P4 Permission]
        P5[P5 Policy]
        P6[P6 Intent]
        P7[P7 Business Impact]
        P8[P8 Authority]
        P9[P9 Freshness]
        P10[P10 Source Reliability]
    end

    subgraph Taxonomy["Layer 2 — Taxonomy"]
        T1[7 Pattern Categories]
        T2[5 Severity Levels]
        T3[36 Pattern Names]
    end

    subgraph Engine["Layer 3 — Decision Engine"]
        E1[Selection: 14 Rules]
        E2[Precedence Engine]
        E3[Composition Engine]
        E4[State Transitions]
    end

    subgraph Patterns["Layer 4 — Pattern Library"]
        PA[Warning × 6]
        PB[Explanation × 6]
        PC[Permission × 6]
        PD[Uncertainty × 7]
        PE[Refusal × 7]
        PF[Escalation × 5]
        PG[Recovery × 5]
    end

    subgraph Components["Layer 5 — Component Library"]
        CA[WarningBanner]
        CB[ConfidenceBadge]
        CC[PermissionGate]
        CD[RefusalCard]
        CE2[EscalationCard]
        CF[RecoveryPrompt]
    end

    subgraph Audit["Layer 6 — Audit & Compliance"]
        AU1[Immutable Event Log]
        AU2[Policy Attribution]
        AU3[auditId Propagation]
    end

    Inputs --> Engine
    Taxonomy --> Engine
    Engine --> Patterns
    Patterns --> Components
    Components --> Audit

    style Inputs fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style Taxonomy fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style Engine fill:#1e1e2e,color:#cdd6f4,stroke:#313244
    style Patterns fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style Components fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style Audit fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
```

---

## 2. Deployment Architecture

How the guardrail layer integrates into an AI product.

```mermaid
graph LR
    subgraph Product["AI Product"]
        direction TB
        AM[AI Model / Agent System]
        
        subgraph GL["Guardrail Layer"]
            direction TB
            PC2[Policy Config\nreference/yaml/]
            DE[Decision Engine]
            CR[Component Rendering]
            AL[Audit Log]
        end
        
        UI[User Interface]
    end

    AM -->|"P1–P10 primitives"| DE
    PC2 -->|"thresholds + rules"| DE
    DE -->|"pattern list\ncomponent sequence"| CR
    CR -->|"rendered components"| UI
    UI -->|"user action\n(grant/deny/ack)"| AL
    DE -->|"audit seed\nauditId"| AL

    style GL fill:#1e1e2e,color:#cdd6f4,stroke:#89b4fa
    style Product fill:#181825,color:#cdd6f4,stroke:#45475a
```

---

## 3. Reference Implementation Architecture

How the repository artifacts map to a running implementation.

```mermaid
graph TB
    subgraph Specs["Specifications"]
        PS[patterns/\n36 pattern specs]
        CS[components/\ncomponent specs]
        DS[docs/decision-flows/\n6-doc engine]
    end

    subgraph Artifacts["Machine-Readable Artifacts\nreference/"]
        JS[json/\n4 schemas]
        YML[yaml/\n4 configs]
        RX[react/\n6 components]
        EX[examples/\n4 payloads]
    end

    subgraph Runtime["Runtime\nplayground/"]
        ENG[engine/\nevaluator.js]
        COMP[components/\nguardrail/]
        APP[app/\npage.jsx]
    end

    PS --> JS
    CS --> RX
    DS --> ENG
    YML --> ENG
    JS --> ENG
    RX --> COMP
    ENG --> APP
    COMP --> APP

    style Specs fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style Artifacts fill:#1e1e2e,color:#cdd6f4,stroke:#89dceb
    style Runtime fill:#1e1e2e,color:#cdd6f4,stroke:#cba6f7
```

---

## 4. Data Flow — Single Request

Complete data flow for one user request through the system.

```mermaid
sequenceDiagram
    participant User
    participant AI System
    participant Engine as Decision Engine
    participant Components as Component Layer
    participant Audit as Audit Log

    User->>AI System: User request
    AI System->>AI System: Evaluate P1–P10 primitives
    AI System->>Engine: evaluate(primitives)
    Engine->>Engine: Run 14 selection rules
    Engine->>Engine: Apply precedence
    Engine->>Engine: Apply composition constraints
    Engine-->>AI System: patterns[] + components[] + auditId
    AI System->>Components: Render component sequence
    Components-->>User: Display guardrail UI
    User->>Components: User action (grant/deny/ack/escalate)
    Components->>Audit: Write audit event (+ auditId)
    Audit-->>AI System: Confirmation
```
