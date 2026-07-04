## Summary

<!-- Describe what this pull request does in 1–3 sentences. -->

## Type of change

- [ ] Documentation improvement (existing file)
- [ ] New documentation file
- [ ] Pattern specification (new or updated)
- [ ] Component specification (new or updated)
- [ ] Playground change
- [ ] CI or tooling change
- [ ] JSON schema change
- [ ] YAML configuration change
- [ ] Fix (broken link, typo, incorrect content)

## Checklist

### All contributions

- [ ] Commit messages follow the prefix convention (`docs:`, `pattern:`, `component:`, `chore:`, `fix:`, etc.)
- [ ] All terms match the canonical vocabulary in [docs/glossary.md](docs/glossary.md)
- [ ] No invented citations or unverified references (mark uncertain references as `TODO: verify`)
- [ ] Internal links are correct and not broken

### Pattern changes

- [ ] Uses the 8-section pattern specification template
- [ ] Trigger conditions are unambiguous and implementable
- [ ] Antipatterns section is complete
- [ ] Referenced in the appropriate index file

### Component changes

- [ ] References the correct pattern specification
- [ ] Includes ARIA role and aria-live guidance
- [ ] Addresses keyboard interaction model

### Playground changes

- [ ] No new guardrail concepts introduced
- [ ] `npm run build` passes in `playground/`
- [ ] Existing 5 scenarios produce unchanged output (if engine was modified)

### Schema changes

- [ ] No existing fields removed (breaking change)
- [ ] New fields documented in `reference/README.md`
- [ ] Example payloads in `reference/examples/` still validate

## Related issues

<!-- Link any related issues: "Closes #123" or "Relates to #456" -->

## Additional notes

<!-- Any context that would help the reviewer understand the change. -->
