# Playground Walkthrough

A description of the interactive playground layout, panels, and features.

**To run the playground:**
```bash
cd playground && npm install && npm run dev
# Open http://localhost:3000
```

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
│  Guardrail Decision Engine · Playground   [3P · 2A/11S] [☀] [?] docs│
├─────────────────────────────────────────────────────────────────────┤
│ SCENARIOS BAR                                                        │
│  Scenarios: [1 Healthcare] [2 Finance] [3 Dev Copilot] [4 Indust] [Reset]│
├──────────────┬──────────────────────────────┬───────────────────────┤
│              │                              │                       │
│  PRIMITIVES  │    DECISION ENGINE           │   RESULT              │
│              │                              │                       │
│  P1 Risk     │  [Rules][Patterns][Comp]     │  [Welcome state]      │
│  ▓▓░░░░      │  [States][Flow]              │  or                   │
│              │                              │  [Rendered components]│
│  P2 Conf     │  ┌──────────────────────┐    │                       │
│  [low   ▾]   │  │ R01 ✓ Policy block   │    │  WarningBanner        │
│              │  │ R02 ✓ UR + Critical  │    │  ConfidenceBadge      │
│  P3 Capab    │  │ R03 ✗ Unresolvable   │    │  RefusalCard          │
│  [capable ▾] │  │ R07 ✓ LC + d-supp    │    │  PermissionGate       │
│              │  │ …                    │    │  EscalationCard       │
│  ...P10      │  └──────────────────────┘    │  RecoveryPrompt       │
│              │                              │                       │
├──────────────┴──────────────────────────────┴───────────────────────┤
│ AUDIT TRAIL                                  [12 events] [Clear]    │
│  ENGINE_EVALUATED  ·  SCENARIO_LOADED  ·  PERMISSION_GRANTED  ·  … │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Panel Descriptions

### Header
Shows the current pattern count, rule activation summary (A=activated, S=skipped), theme toggle, keyboard help, and docs link.

### Scenarios Bar
Five scenario buttons (Healthcare, Finance, Developer Copilot, Industrial AI, Customer Support) plus Reset. Each button shows the industry color dot and keyboard number (1–5). Pressing Reset returns all primitives to defaults and shows the Welcome state.

### Primitives Panel (Left)
Controls for all 10 decision primitives:
- Integer primitives (P1, P7, P8, P10): range sliders with numeric label
- Enum primitives (P2, P3, P4, P5, P6, P9): dropdown selects with all valid values

Changing any primitive clears the active scenario and dismisses the Welcome state.

### Decision Engine Panel (Center)
Five tabs:

| Tab | Content |
|---|---|
| **Rules** | All selection rules with status (activated ✓ / skipped ✗ / not evaluated —), reason, and activated patterns |
| **Patterns** | Resolved pattern list after composition, with severity indicators |
| **Composition** | Applied composition constraints, raw vs. resolved pattern counts |
| **States** | P2 Confidence state machine with current state highlighted, transitions, and prohibitions |
| **Flow** | 5-step pipeline visualization + composition layer diagram |

Use `[` and `]` keyboard shortcuts to cycle tabs.

### Result Panel (Right)
Renders the actual guardrail components in activation order. Each component:
- Shows its variant-specific UI
- Has interactive buttons (grant, deny, acknowledge, escalate) that emit audit events
- Reflects the current primitive values in its display

The Welcome state appears on first load and after Reset. Click a scenario or change a primitive to dismiss it.

### Audit Trail (Bottom)
Chronological event log (most recent first). Events include:
- `ENGINE_EVALUATED` — emitted on every primitive change
- `SCENARIO_LOADED` — emitted when a scenario is selected
- `PERMISSION_GRANTED` / `PERMISSION_DENIED` — from PermissionGate interactions
- `ESCALATION_ACKNOWLEDGED` — from EscalationCard interactions
- Component interaction events from other guardrail components

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `1`–`5` | Load scenario 1–5 |
| `[` | Previous engine tab |
| `]` | Next engine tab |
| `D` | Toggle dark/light mode |
| `R` | Reset to defaults |
| `?` | Show/hide keyboard help |
| `Esc` | Close keyboard help overlay |

---

## Screenshot Capture Guide

### Healthcare scenario (recommended first screenshot)

1. Open `http://localhost:3000`
2. Press `1` to load Healthcare
3. Click the **Rules** tab — shows R07 (LC + Decision-Support) activated
4. Expected components: `ConfidenceBadge` (LC disclosure), `RefusalCard` (constrained-completion)
5. Capture at 1440×900 with dark mode

### Finance scenario (policy block + early termination)

1. Press `2` to load Finance
2. Note: R01 activated, all subsequent rules show "not evaluated"
3. Expected components: `WarningBanner` (policy), `EscalationCard` (emergency)
4. Click the **States** tab to show the unresolvable state machine

### Industrial AI (emergency escalation)

1. Press `4` to load Industrial AI
2. Expected: R02 early termination
3. Expected components: `EscalationCard` (emergency, critical severity)
4. Capture the Audit Trail showing ENGINE_EVALUATED with emergency-escalation pattern
