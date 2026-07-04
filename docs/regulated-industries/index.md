# Regulated Industries Index

This section provides domain-specific guidance for industries where compliance requirements, liability considerations, or sector-specific standards constrain or modify how guardrail patterns must behave.

General pattern specifications define the baseline. Regulated industries guidance defines the delta: what must change, what must be added, and what is prohibited in each domain.

---

## Why Regulated Industries Need Separate Guidance

Standard guardrail patterns are designed for the broadest enterprise use case. In regulated industries:

- **Disclosure requirements** may be legally mandated, not optional design choices
- **Refusal triggers** may be defined by regulation, not product policy
- **Audit trails** may require specific data fields, retention periods, or access controls
- **Escalation paths** may have defined SLAs with legal consequence for breach
- **Uncertainty communication** may be constrained by professional liability standards
- **User language** may need to meet reading level, accessibility, or translation requirements defined by law

These are not edge cases. They are the primary design context for large categories of enterprise AI deployment.

---

## Planned Domain Sections

### Healthcare

| Document | Status | File |
|---|---|---|
| AI in clinical decision support — pattern constraints | 🔲 Planned | `docs/regulated-industries/healthcare/clinical-decision-support.md` |
| Patient-facing AI communication standards | 🔲 Planned | `docs/regulated-industries/healthcare/patient-communication.md` |
| Uncertainty disclosure in diagnostic AI | 🔲 Planned | `docs/regulated-industries/healthcare/diagnostic-uncertainty.md` |
| Escalation requirements for high-risk clinical contexts | 🔲 Planned | `docs/regulated-industries/healthcare/high-risk-escalation.md` |
| PHI handling and refusal pattern interactions | 🔲 Planned | `docs/regulated-industries/healthcare/phi-refusal-patterns.md` |

**Key regulatory context:** FDA guidance on clinical decision support software, HIPAA privacy rule, EU AI Act risk classification for medical AI. _(TODO: verify specific regulatory references)_

---

### Financial Services

| Document | Status | File |
|---|---|---|
| Advice disclaimer patterns for AI-assisted financial guidance | 🔲 Planned | `docs/regulated-industries/financial-services/advice-disclaimers.md` |
| Risk disclosure patterns for investment and lending contexts | 🔲 Planned | `docs/regulated-industries/financial-services/risk-disclosures.md` |
| Explanation requirements for automated credit and underwriting decisions | 🔲 Planned | `docs/regulated-industries/financial-services/automated-decision-explanations.md` |
| Fraud detection escalation paths | 🔲 Planned | `docs/regulated-industries/financial-services/fraud-escalation.md` |
| Consumer protection constraints on refusal communication | 🔲 Planned | `docs/regulated-industries/financial-services/refusal-consumer-protection.md` |

**Key regulatory context:** Equal Credit Opportunity Act adverse action notice requirements, MiFID II suitability requirements, CFPB guidance on explainability for automated decisions. _(TODO: verify specific regulatory references)_

---

### Legal

| Document | Status | File |
|---|---|---|
| Privilege and confidentiality constraints on explanation patterns | 🔲 Planned | `docs/regulated-industries/legal/privilege-confidentiality.md` |
| AI-assisted legal research uncertainty disclosure | 🔲 Planned | `docs/regulated-industries/legal/research-uncertainty.md` |
| Document AI and accuracy warning requirements | 🔲 Planned | `docs/regulated-industries/legal/document-ai-warnings.md` |
| UPL (unauthorized practice of law) refusal pattern | 🔲 Planned | `docs/regulated-industries/legal/upl-refusal-pattern.md` |

**Key regulatory context:** State bar AI guidance, ABA formal opinions on AI use in practice, EU AI Act requirements for legal AI. _(TODO: verify specific regulatory references)_

---

### Government and Public Sector

| Document | Status | File |
|---|---|---|
| Algorithmic transparency requirements for public-facing AI | 🔲 Planned | `docs/regulated-industries/government/algorithmic-transparency.md` |
| Human oversight requirements for AI-assisted government decisions | 🔲 Planned | `docs/regulated-industries/government/human-oversight.md` |
| Accessibility requirements for guardrail pattern components | 🔲 Planned | `docs/regulated-industries/government/accessibility.md` |
| Public records and audit requirements | 🔲 Planned | `docs/regulated-industries/government/public-records-audit.md` |

**Key regulatory context:** Section 508 accessibility requirements, EU AI Act public authority requirements, executive orders on responsible AI in government. _(TODO: verify specific regulatory references)_

---

### Critical Infrastructure

| Document | Status | File |
|---|---|---|
| Fail-safe escalation patterns for safety-critical AI | 🔲 Planned | `docs/regulated-industries/critical-infrastructure/fail-safe-escalation.md` |
| Human-in-the-loop requirements for autonomous operations | 🔲 Planned | `docs/regulated-industries/critical-infrastructure/human-in-loop.md` |
| Uncertainty handling in safety-critical AI outputs | 🔲 Planned | `docs/regulated-industries/critical-infrastructure/safety-critical-uncertainty.md` |

**Key regulatory context:** NIST AI Risk Management Framework, sector-specific CISA guidance. _(TODO: verify specific regulatory references)_

---

## Cross-Domain Patterns

Certain pattern constraints appear across multiple regulated industries. These will be documented as cross-domain references:

| Constraint | Applies to |
|---|---|
| Mandatory explanation of adverse AI decisions | Finance, healthcare, government |
| Mandatory human review before irreversible AI action | Healthcare (clinical), critical infrastructure |
| Accessibility requirements for all pattern components | Government, public-sector healthcare |
| Audit trail retention minimums | Finance, healthcare, government |
| Jurisdiction-specific uncertainty language | Finance, legal, healthcare |

---

## Phase Status

- **Phase 1:** Index scaffold with domain sections and planned documents
- **Phase 6:** Full domain-specific guidance for all five industry sections

_Total planned regulated industries documents: ~23_
