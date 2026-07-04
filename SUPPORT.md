# Support

How to get help with the AI Guardrails & Explanations Design System.

---

## Documentation

The fastest path to an answer is the documentation:

- [docs/getting-started.md](docs/getting-started.md) — role-based entry point
- [docs/faq.md](docs/faq.md) — answers to 25+ common questions
- [docs/troubleshooting.md](docs/troubleshooting.md) — common implementation issues with step-by-step fixes
- [docs/glossary.md](docs/glossary.md) — canonical definitions for all terms

---

## GitHub Issues

For bugs, documentation errors, and implementation questions, open a [GitHub Issue](https://github.com/your-org/ai-guardrails-explanations-design-system/issues).

**Use the appropriate template:**
- [Bug report](https://github.com/your-org/ai-guardrails-explanations-design-system/issues/new?template=bug_report.md) — for errors in the playground or reference implementations
- [Feature request](https://github.com/your-org/ai-guardrails-explanations-design-system/issues/new?template=feature_request.md) — for proposed improvements

**Before opening an issue:**

1. Search existing issues — your question may already be answered.
2. Read [docs/troubleshooting.md](docs/troubleshooting.md) — many common issues are covered there.
3. Check [docs/faq.md](docs/faq.md) for conceptual questions.

---

## GitHub Discussions

For broader questions about applying the design system — how to choose between patterns, how to configure for your industry, architectural questions — use [GitHub Discussions](https://github.com/your-org/ai-guardrails-explanations-design-system/discussions).

Discussions are the right venue for:
- "Which pattern should I use for X?"
- "How does the engine handle Y?"
- "I'm implementing this in [framework] — what should I know?"
- Sharing your implementation for community feedback

---

## Response Expectations

This is an open-source project maintained by contributors. There are no guaranteed response SLAs.

| Channel | Typical response |
|---|---|
| Issues (bug + docs errors) | Best effort, 1–2 weeks |
| Issues (feature requests) | Reviewed in roadmap planning cycles |
| Discussions | Community-driven, no SLA |
| Security vulnerabilities | 48 hours (see [SECURITY.md](SECURITY.md)) |

---

## Support Lifecycle

| Version | Support status | Notes |
|---|---|---|
| `v1.0.x` (current) | Active support | Receives patch fixes |
| Pre-release drafts | No support | Experimental only |

**Active support** means:
- Security vulnerabilities are addressed (see [SECURITY.md](SECURITY.md))
- Critical specification errors are corrected
- Broken CI is fixed

**Active support does not include:**
- New feature development
- Framework-specific integration help
- Compliance review or certification

---

## Deprecation Policy

Deprecations are announced in `CHANGELOG.md` with a minimum notice period of one major version.

- A pattern or feature deprecated in v1.x will be removed no earlier than v2.0.0
- Deprecation notices include the reason and recommended migration path
- No pattern specifications, schema fields, or taxonomy terms are deprecated in v1.0.0

---

## Out of Scope

This project does not provide:

- Implementation consulting or paid support
- Framework-specific integrations beyond the provided React/Next.js reference implementations
- Compliance certification or legal advice

For enterprise support needs, see the enterprise playbooks in [docs/enterprise-playbooks/](docs/enterprise-playbooks/) for guidance on engaging domain-specific expertise.
