---
phase: 03
slug: cart-checkout
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-28
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build verification (no test framework in Phase 3 — build pass is primary gate) |
| **Config file** | projects/briefs/beads-and-bloom-website/next.config.ts |
| **Quick run command** | `cd projects/briefs/beads-and-bloom-website && node node_modules/next/dist/bin/next build 2>&1 \| tail -5` |
| **Full suite command** | `cd projects/briefs/beads-and-bloom-website && node node_modules/next/dist/bin/next build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run quick build check
- **After every plan wave:** Run full build
- **Before `/gsd:verify-work`:** Full build must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | STORE-03, STORE-09 | build + grep | build + grep useCartStore | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | STORE-03, STORE-11 | build + grep | build + grep CartDrawer | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | STORE-04 | build + grep | build + grep createCheckoutSession | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | STORE-04, STORE-12 | build + grep | build + grep EmbeddedCheckout | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 3 | STORE-05 | build + grep | build + grep OrderConfirmationEmail | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 3 | STORE-04, STORE-05 | build + grep | build + grep stripe.webhooks.constructEvent | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed — build verification is the primary automated gate for this phase.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cart slide-out drawer opens on Add to Cart | STORE-03 | UI interaction | Tap Add to Cart on product page, verify drawer opens from right |
| Custom color selection before add to cart | STORE-09 | UI interaction | On customizable product, tap colors, verify selection persists in cart |
| Stripe Embedded Checkout renders and accepts payment | STORE-04 | External service | Use Stripe test card 4242424242424242, complete payment |
| Confirmation email arrives | STORE-05 | External service | Check Resend dashboard or inbox after test purchase |
| Gift message appears on confirmation | STORE-11 | UI flow | Add gift message in cart, verify it shows on confirmation page |
| Thank-you note mention on confirmation | STORE-12 | UI content | Verify confirmation page mentions handwritten thank-you note |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-28
