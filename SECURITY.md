# Security Policy

## Supported Versions

This is a documentation-first design system. There is no runtime server, authentication layer, or user data processing in the main repository.

| Component | Security relevance |
|---|---|
| Documentation (`docs/`, `patterns/`, `components/`) | Markdown only — no executable code |
| Reference implementations (`reference/react/`, `reference/nextjs/`) | Example code — not for production use without review |
| Interactive playground (`playground/`) | Client-side only, no backend, no user data transmitted |
| JSON schemas (`reference/json/`) | Validation schemas — no executable code |
| YAML configurations (`reference/yaml/`) | Configuration templates — no secrets |

---

## Reporting a Vulnerability

If you discover a security issue in any component of this repository — including the playground application, reference implementations, or JSON schemas — please report it privately rather than opening a public issue.

**How to report:**

1. Open a [GitHub Security Advisory](https://github.com/your-org/ai-guardrails-explanations-design-system/security/advisories/new) on this repository.
2. Provide: a description of the vulnerability, steps to reproduce, and potential impact.
3. You will receive an acknowledgment within 48 hours.

Do not include sensitive information (tokens, credentials, production URLs) in your report.

---

## Scope

### In scope

- Vulnerabilities in the playground Next.js application (`playground/`)
- Cross-site scripting (XSS) risks in reference React components
- Dependency vulnerabilities in `playground/package.json`
- Documentation content that could mislead implementers into security-unsafe patterns (e.g., incorrect ARIA guidance that breaks access control)

### Out of scope

- Vulnerabilities in markdown content itself
- Issues in downstream products that use this design system as a reference
- Dependency vulnerabilities in documentation tooling not included in this repository

---

## Security Considerations for Implementers

This design system defines guardrail patterns for AI products. Several patterns have direct security implications:

**Permission gates**
The `passive dismissal = denial` invariant is a security requirement. Any implementation where passive dismissal grants access or leaves access ambiguous is a security vulnerability.

**Audit records**
Audit records must be immutable. A log that can be modified after the fact is not an audit log. Use append-only storage.

**Policy configuration**
YAML configuration files (`reference/yaml/`) are templates, not production-ready configurations. Review all thresholds and policy rules before deploying.

**Auto-grant**
Auto-grant is never permitted by this design system. Any implementation that automatically grants a permission gate — on timeout, on passive dismissal, or on default — violates the system's security model.

**tenantId isolation**
In multi-tenant deployments, policy rules and audit records must be scoped by `tenantId`. Cross-tenant policy leakage is a security vulnerability.

---

## Dependency Security

The playground uses three production dependencies:

- `next` — check [Next.js security advisories](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- `react` — check [React security advisories](https://github.com/facebook/react/security)
- `react-dom` — bundled with React

Run `npm audit` in `playground/` to check for known vulnerabilities before deploying.

---

## Disclosure Policy

We follow responsible disclosure. Security issues will be:

1. Acknowledged within 48 hours
2. Assessed within 7 days
3. Fixed within 30 days (or an interim mitigation provided)
4. Disclosed publicly after the fix is available

We will credit reporters in the release notes unless anonymity is requested.
