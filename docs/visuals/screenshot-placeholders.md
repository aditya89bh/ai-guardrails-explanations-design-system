# Screenshot Placeholders

Documented specification for screenshots and animated content to be captured when the playground is deployed to a stable URL.

Screenshots are intentionally deferred. Capturing from a local development server would produce environment-specific artifacts (OS chrome, local fonts, window dimensions) that could confuse contributors. Screenshots will be captured from the published deployment URL.

---

## Screenshots

### 1. Healthcare Scenario — Constrained Completion

**Filename:** `healthcare-scenario.png`
**Dimensions:** 1440 × 900 (Retina: 2880 × 1800)
**State:**
- Scenario: Healthcare loaded (press `1`)
- Active tab: Rules
- Expected active rules: R07 (LC + Decision-Support)
- Expected components: ConfidenceBadge (LC state), constrained-completion indicator
- Dark mode: on

**What to highlight:**
- R07 rule row with activated status
- LC disclosure in Result panel
- Audit Trail showing ENGINE_EVALUATED

---

### 2. Finance Scenario — AML Policy Block

**Filename:** `finance-policy-block.png`
**Dimensions:** 1440 × 900
**State:**
- Scenario: Finance loaded (press `2`)
- Active tab: Rules
- Expected: R01 activated (early termination), all subsequent rules "not evaluated"
- Expected components: policy-refusal + emergency-escalation
- Dark mode: on

**What to highlight:**
- R01 row with early-termination marker
- "not evaluated" rules shown greyed out
- Critical severity escalation card in Result panel

---

### 3. Developer Copilot — Conflicting Evidence State

**Filename:** `developer-copilot-ce-state.png`
**Dimensions:** 1440 × 900
**State:**
- Scenario: Developer Copilot loaded (press `3`)
- Active tab: States
- P2 = conflicting highlighted in state machine
- Expected components: RefusalCard (safe-refusal), reasoning-trace, source-citation

---

### 4. Industrial AI — Emergency Escalation

**Filename:** `industrial-ai-emergency.png`
**Dimensions:** 1440 × 900
**State:**
- Scenario: Industrial AI loaded (press `4`)
- Active tab: Rules (showing R02 early termination)
- Expected components: EscalationCard (emergency, critical severity)

**What to highlight:**
- R02 early termination
- Critical severity styling on EscalationCard
- Abandon recovery in Result panel

---

### 5. Keyboard Shortcut Overlay

**Filename:** `keyboard-help-overlay.png`
**Dimensions:** 1440 × 900
**State:**
- Any scenario loaded
- Press `?` to open keyboard shortcut overlay
- Dark mode: on

---

### 6. Mobile View — Healthcare Scenario

**Filename:** `mobile-healthcare.png`
**Dimensions:** 390 × 844 (iPhone 14 viewport)
**State:**
- Scenario: Healthcare loaded
- Single-column layout
- Primitives panel visible, scrolled to show P1 and P2

---

### 7. Light Mode — Default State

**Filename:** `light-mode-welcome.png`
**Dimensions:** 1440 × 900
**State:**
- No scenario loaded (Welcome state visible in Result panel)
- Light mode: on (press `D` to toggle)

---

## Animated GIF Specification

**Filename:** `engine-pipeline-demo.gif`
**Duration:** ~15 seconds, loop
**Frames:**

1. (0–2s) Start: default state, all primitives at default
2. (2–4s) Press `1` — Healthcare scenario loads, primitives animate to new values
3. (4–6s) Result panel shows: ConfidenceBadge + constrained-completion message
4. (6–8s) Click Rules tab — rule evaluation list appears, R07 highlighted
5. (8–10s) Click States tab — P2 state machine with "low" state highlighted
6. (10–12s) Press `2` — Finance scenario loads, R01 early termination visible
7. (12–15s) Press `R` — Reset to defaults, Welcome state reappears

**Tool recommendation:** [Kap](https://getkap.co) or [ScreenToGif](https://www.screentogif.com) at 24fps, max 1440×900, optimized to <5MB.
