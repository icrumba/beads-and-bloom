# Phase 3: Cart & Checkout - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 03-cart-checkout
**Areas discussed:** Cart behavior, Checkout flow, Custom color selection, Order confirmation, Gift message
**Mode:** --auto (all decisions auto-selected using recommended defaults)

---

## Cart Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Slide-out drawer | Reuses Sheet component, keeps user on page | ✓ |
| Dedicated cart page | Full page at /cart | |
| Mini cart dropdown | Small dropdown from header icon | |

**User's choice:** [auto] Slide-out drawer (recommended — consistent with mobile nav pattern)

## Checkout Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Single page + Stripe Embedded | All fields on one page, Stripe handles payment | ✓ |
| Multi-step wizard | Step 1: info, Step 2: shipping, Step 3: payment | |
| Stripe-hosted checkout | Redirect to stripe.com | |

**User's choice:** [auto] Single page + Stripe Embedded (recommended — per tech stack decision, keeps trust)

## Custom Color Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Clickable swatches on PDP | Select before adding to cart | ✓ |
| Color picker in cart | Select after adding to cart | |
| Text field for custom colors | Free-text color request | |

**User's choice:** [auto] Clickable swatches on product detail page (recommended)

## Order Confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Confirmation page + email | Both visual and email confirmation | ✓ |
| Email only | No confirmation page, redirect to homepage | |

**User's choice:** [auto] Confirmation page + email (recommended)

## Gift Message

| Option | Description | Selected |
|--------|-------------|----------|
| Text field in cart drawer | Before checkout, 150 char limit | ✓ |
| Text field on checkout page | During checkout form | |
| Separate gift options page | Dedicated gift customization | |

**User's choice:** [auto] Text field in cart drawer (recommended — simple, low friction)

## Claude's Discretion

- Loading states during checkout
- Error handling UX patterns
- Cart empty state messaging
- Stripe webhook retry handling

## Deferred Ideas

None
