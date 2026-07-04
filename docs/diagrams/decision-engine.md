# Decision Engine Diagrams

Mermaid diagrams for the Guardrail Decision Engine.

Source: `docs/decision-flows/`

---

## 1. Engine Overview — Four Sublayers

```mermaid
graph TB
    subgraph Input["Input"]
        P["P1–P10 Primitive Values"]
    end

    subgraph Selection["3a — Pattern Selection"]
        R01["R01 Policy Block\n(terminates if active)"]
        R02["R02 Unresolvable + Critical\n(terminates if active)"]
        R03["R03 Unresolvable + Lower Risk"]
        R04["R04 Permission Block High Risk"]
        R05["R05 CE at Risk≥3"]
        R06["R06 Insufficient Information"]
        R07["R07 LC + Decision-Support"]
        R08["R08 LC + Action-Execution"]
        R09["R09 Stale Context"]
        R10["R10 Moderate Confidence"]
        R11["R11 High Confidence"]
        R12["R12 Source Reliability"]
        R13["R13 Business Impact"]
        R14["R14 Unauthorized + Low Risk"]
    end

    subgraph Precedence["3b — Precedence Engine"]
        PR["Resolve conflicts:\nblocking supersedes inline\npolicy supersedes safe\nemergency supersedes role"]
    end

    subgraph Composition["3c — Composition Engine"]
        CO["Enforce mutual exclusion:\nmax 1 warning\nmax 1 refusal\nmax 1 recovery"]
    end

    subgraph Output["Output"]
        OUT["patterns[]\ncomponents[]\nprimarySelections\nauditSeed"]
    end

    P --> R01
    R01 -->|"conditions NOT met"| R02
    R02 -->|"conditions NOT met"| R03
    R03 --> R04
    R04 --> R05
    R05 --> R06
    R06 --> R07
    R07 --> R08
    R08 --> R09
    R09 --> R10
    R10 --> R11
    R11 --> R12
    R12 --> R13
    R13 --> R14
    R01 -->|"terminates"| Precedence
    R02 -->|"terminates"| Precedence
    R14 --> Precedence
    Precedence --> Composition
    Composition --> Output

    style Selection fill:#1e1e2e,color:#cdd6f4,stroke:#89b4fa
    style Precedence fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style Composition fill:#1e1e2e,color:#cdd6f4,stroke:#f9e2af
    style Input fill:#181825,color:#cdd6f4,stroke:#45475a
    style Output fill:#181825,color:#cdd6f4,stroke:#45475a
```

---

## 2. Selection Rule Conditions — Key Rules

```mermaid
graph LR
    subgraph R01["R01 — Policy Block (terminates)"]
        direction LR
        C01{"P5 = tenant\nor deployment?"}
        C01 -->|Yes| A01["policy-refusal\n+ redirect-recovery\n+ emergency-escalation if P1=4"]
        C01 -->|No| S01[SKIP]
    end

    subgraph R04["R04 — Permission Block"]
        direction LR
        C04{"P4 = unauthorized\nAND P1 ≥ 3?"}
        C04 -->|Yes| A04["blocking-warning\n+ role-escalation"]
        C04 -->|No| S04[SKIP]
    end

    subgraph R07["R07 — LC + Decision-Support"]
        direction LR
        C07{"P2 = low AND\nP6 = decision-support\nAND P3 ≠ incapable?"}
        C07 -->|Yes| A07["constrained-completion\n+ confidence-disclosure\n+ limitation-disclosure\n+ source-citation"]
        C07 -->|No| S07[SKIP]
    end

    subgraph R08["R08 — LC + Action-Execution"]
        direction LR
        C08{"P2 = low AND\nP6 ≠ decision-support?"}
        C08 -->|Yes| A08["safe-refusal\n+ confidence-disclosure\n+ alternative-suggestion"]
        C08 -->|No| S08[SKIP]
    end

    style R01 fill:#1e1e2e,color:#cdd6f4,stroke:#f38ba8
    style R04 fill:#1e1e2e,color:#cdd6f4,stroke:#fab387
    style R07 fill:#1e1e2e,color:#cdd6f4,stroke:#a6e3a1
    style R08 fill:#1e1e2e,color:#cdd6f4,stroke:#f9e2af
```

---

## 3. Precedence Order (Default)

```mermaid
graph TB
    EE["🚨 emergency-escalation\n(Critical — self-authorizing)"]
    PR["🚫 policy-refusal\n(Blocking — supersedes all refusal)"]
    BW["⛔ blocking-warning\n(Blocking — supersedes inline + ambient)"]
    RE["👤 role-escalation\n(Caution)"]
    SR["⛔ safe-refusal\n(Caution)"]
    PG["🔐 permission-gate\n(Blocking)"]
    CD["📊 confidence-disclosure\n(Advisory)"]
    CC["📋 constrained-completion\n(Advisory)"]
    IW["⚠ inline-warning\n(Advisory)"]
    AW["· ambient-warning\n(Informational)"]
    RP["↩ recovery-prompt\n(Advisory)"]
    SC["📄 source-citation\n(Informational)"]

    EE --> PR --> BW --> RE --> SR --> PG --> CD --> CC --> IW --> AW --> RP --> SC

    style EE fill:#450a0a,color:#fef2f2,stroke:#991b1b
    style PR fill:#fdf2f8,color:#831843,stroke:#fbcfe8
    style BW fill:#fdf2f8,color:#831843,stroke:#fbcfe8
    style EE fill:#450a0a,color:#fef2f2
```

---

## 4. Composition Constraints

```mermaid
graph LR
    subgraph RawPatterns["Raw Pattern Set (after selection)"]
        BW2["blocking-warning"]
        IW2["inline-warning"]
        AW2["ambient-warning"]
        PR2["policy-refusal"]
        SR2["safe-refusal"]
        EE2["emergency-escalation"]
        RE2["role-escalation"]
        REC["redirect-recovery"]
    end

    subgraph Constraints["Composition Constraints"]
        C1["Max 1 warning → keep blocking-warning"]
        C2["Max 1 refusal → keep policy-refusal"]
        C3["emergency supersedes role"]
    end

    subgraph Resolved["Resolved Pattern Set"]
        BW3["✓ blocking-warning"]
        PR3["✓ policy-refusal"]
        EE3["✓ emergency-escalation"]
        REC3["✓ redirect-recovery"]
        IW3["✗ inline-warning (removed)"]
        AW3["✗ ambient-warning (removed)"]
        SR3["✗ safe-refusal (removed)"]
        RE3["✗ role-escalation (removed)"]
    end

    RawPatterns --> Constraints --> Resolved
```
