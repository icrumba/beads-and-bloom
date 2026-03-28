---
phase: 2
slug: storefront-brand
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Next.js integration) |
| **Config file** | projects/briefs/beads-and-bloom-website/vitest.config.ts |
| **Quick run command** | `cd projects/briefs/beads-and-bloom-website && npx vitest run` |
| **Full suite command** | `cd projects/briefs/beads-and-bloom-website && npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick run command
- **After every plan wave:** Run full suite command + visual check in browser
- **Before `/gsd:verify-work`:** Full suite must be green + all pages render on mobile
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | STORE-01 | build+render | `cd projects/briefs/beads-and-bloom-website && npm run build` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | STORE-02 | build+render | `npm run build` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | BRAND-01,02,03,04 | build+render | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] shadcn components installed (card, badge, tabs, sheet, separator, skeleton)
- [ ] Plus Jakarta Sans font configured
- [ ] Brand color CSS variables set in globals.css
- [ ] Build passes with no errors

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Product grid is mobile-responsive | STORE-01 | Requires visual check at different breakpoints | Open localhost:3000, resize to 375px, verify 2-column grid |
| Product photos display correctly | STORE-02 | Requires Cloudinary URLs and visual check | Navigate to product detail, verify carousel swipes |
| Charity counter animates | BRAND-02 | Requires visual check of animation | Load homepage, verify number counts up |
| About page photo layout alternates | BRAND-01 | Requires visual check | Navigate to /about, verify alternating sections |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
