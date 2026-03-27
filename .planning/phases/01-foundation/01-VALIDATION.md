---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Next.js 15 integration) |
| **Config file** | projects/briefs/beads-and-bloom-website/vitest.config.ts |
| **Quick run command** | `cd projects/briefs/beads-and-bloom-website && npx vitest run` |
| **Full suite command** | `cd projects/briefs/beads-and-bloom-website && npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd projects/briefs/beads-and-bloom-website && npx vitest run`
- **After every plan wave:** Run `cd projects/briefs/beads-and-bloom-website && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | Infrastructure | build | `cd projects/briefs/beads-and-bloom-website && npm run dev` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | Schema | migration | `cd projects/briefs/beads-and-bloom-website && npx drizzle-kit push` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | Seed | script | `cd projects/briefs/beads-and-bloom-website && npx tsx src/db/seed.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test framework installed (vitest)
- [ ] Next.js dev server starts without errors
- [ ] Database connection established to Neon Postgres

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Neon dashboard shows tables | Schema migration | Requires external service | Log into Neon console, verify tables exist |
| Cloudinary image URLs resolve | Seed data | Requires HTTP request to external CDN | Open seed product image URLs in browser |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
