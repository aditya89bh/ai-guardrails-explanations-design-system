# Pattern Lifecycle Diagrams

Mermaid diagrams for pattern activation, component rendering, and audit lifecycle.

---

## 1. Pattern Lifecycle — Overview

```mermaid
graph LR
    A["User Request\n+ AI Output"] --> B["Primitive\nEvaluation\nP1–P10"]
    B --> C["Engine:\nRule Selection\n14 rules"]
    C --> D["Engine:\nPrecedence\nResolution"]
    D --> E["Engine:\nComposition\nConstraints"]
    E --> F["Pattern\nActivation\nList"]
    F --> G["Component\nSequence\n(ordered)"]
    G --> H["UI Rendering\n+ Focus Mgmt\n+ ARIA"]
    H --> I["User\nInteraction\ngrant/deny/ack"]
    I --> J["Audit\nRecord\n+ auditId"]
    J --> K{"Recovery\nNeeded?"}
    K -->|Yes| L["Recovery\nFlow"]
    K -->|No| M["Interaction\nComplete"]
    L --> M

    style A fill:#1e1e2e,color:#cdd6f4,stroke:#6c7086
    style J fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style M fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
```

---

## 2. Warning Pattern Lifecycle

```mermaid
graph TB
    subgraph Trigger["Trigger Conditions"]
        T1["P4 = unauthorized\n+ P1 ≥ 3"] --> BW["blocking-warning"]
        T2["P4 = unauthorized\n+ P1 < 3"] --> IW["inline-warning"]
        T3["P2 = stale\nOR P9 = stale"] --> AW["ambient-warning"]
        T4["P5 = deployment\nor tenant"] --> PW["policy-warning"]
    end

    subgraph Rendering["Component Rendering"]
        BW --> R_BW["role=alertdialog\naria-live=assertive\nFocus trapped"]
        IW --> R_IW["role=status\naria-live=polite\nInline position"]
        AW --> R_AW["role=status\naria-live=polite\nPersistent indicator"]
        PW --> R_PW["role=alertdialog\naria-live=assertive\nPolicy rule cited"]
    end

    subgraph UserAction["User Actions"]
        R_BW -->|"Acknowledge"| AU_BW["Audit: WARNING_ACKNOWLEDGED"]
        R_IW -->|"Dismiss"| AU_IW["Audit: WARNING_DISMISSED"]
        R_AW -->|"(persistent)"| AU_AW["Audit: WARNING_RENDERED"]
        R_PW -->|"Acknowledge"| AU_PW["Audit: POLICY_WARNING_ACKNOWLEDGED"]
    end

    subgraph Composition["Composition Rule"]
        C1["Only 1 warning pattern\nmay render\nsimultaneously"]
        BW -->|"supersedes"| IW2["✗ inline-warning (suppressed)"]
        BW -->|"supersedes"| AW2["✗ ambient-warning (suppressed)"]
    end
```

---

## 3. Refusal Pattern Selection

```mermaid
graph TD
    Start["Refusal needed?"] --> P5{"P5 = tenant\nor deployment?"}
    P5 -->|Yes| PolicyR["policy-refusal\n(terminates all other selection)"]
    P5 -->|No| P2{"P2 Confidence\nState?"}
    
    P2 -->|"unresolvable"| P1U{"P1 Risk?"}
    P1U -->|"= 4 Critical"| EmergR["emergency-escalation\n+ abandon-recovery\n(no refusal component)"]
    P1U -->|"< 4"| SafeR["safe-refusal\n+ redirect-recovery"]
    
    P2 -->|"conflicting\nAND P1 ≥ 3"| SafeR2["safe-refusal\n+ reasoning-trace\n+ source-citation"]
    P2 -->|"conflicting\nAND P1 < 3"| Advisory["(advisory disclosure only)"]
    
    P2 -->|"insufficient"| ClarR["clarification-request\n+ partial-completion"]
    
    P2 -->|"low\nAND P6 = action-execution"| SafeR3["safe-refusal\n+ alternatives"]
    P2 -->|"low\nAND P6 = decision-support"| ConstrR["constrained-completion\n+ confidence-disclosure"]
    
    P3{"P3 = incapable?"} -->|Yes| SafeR4["safe-refusal\n(capability boundary)"]
    P2 -->|other| P3

    style PolicyR fill:#fdf2f8,color:#831843
    style EmergR fill:#450a0a,color:#fef2f2
    style SafeR fill:#fff7ed,color:#9a3412
    style SafeR2 fill:#fff7ed,color:#9a3412
    style SafeR3 fill:#fff7ed,color:#9a3412
    style ConstrR fill:#fffbeb,color:#92400e
    style ClarR fill:#fffbeb,color:#92400e
```

---

## 4. Audit Record Structure

```mermaid
graph LR
    subgraph AuditRecord["Audit Record"]
        A1["auditId\n(UUID — propagated)"]
        A2["timestamp\n(ISO 8601)"]
        A3["eventType\n(canonical)"]
        A4["primitiveSnapshot\nP1–P10 at eval time"]
        A5["activatedPatterns\n(list)"]
        A6["componentRendered\n(PascalCase ID)"]
        A7["userAction\ngrant/deny/ack/esc"]
        A8["policyRef\n(if applicable)"]
        A9["severity\n(5-level enum)"]
        A10["tenantId\n(multi-tenant)"]
    end

    EvalEvent["ENGINE_EVALUATED"] --> A1
    EvalEvent --> A4
    EvalEvent --> A5

    RenderEvent["COMPONENT_RENDERED"] --> A1
    RenderEvent --> A6
    RenderEvent --> A9

    UserEvent["USER_ACTION"] --> A1
    UserEvent --> A7
    UserEvent --> A3

    subgraph Compliance["Compliance Requirements"]
        R1["All blocking + critical events → required"]
        R2["Permission grants + denials → required"]
        R3["Escalations → required"]
        R4["Healthcare: all events → required\n7-year retention"]
        R5["Finance: all events → required\n7-year retention (SOX)"]
    end
```
