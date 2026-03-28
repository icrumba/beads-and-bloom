# Beads & Bloom -- Deployment Guide

Step-by-step guide to deploy the Beads & Bloom e-commerce site to production.

## Prerequisites

- **Node.js** 18+ and npm
- **Vercel account** -- Pro plan ($20/month) required for commercial use ([pricing](https://vercel.com/pricing))
- **Git repository** -- code pushed to GitHub, GitLab, or Bitbucket

You will also create accounts for: Neon, Stripe, Cloudinary, and Resend (all have free tiers).

---

## Step 1: Database Setup (Neon Postgres)

1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project (any region -- US East recommended)
3. Copy the connection string from **Connection Details**
4. Set `DATABASE_URL` in your `.env.local`:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```
6. Seed initial products:
   ```bash
   npx tsx scripts/seed.ts
   ```

**Free tier:** 0.5GB storage, 100 compute-hours/month. More than enough for launch.

---

## Step 2: Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Go to **Developers > API keys**
3. Copy your keys (use **test mode** keys first):
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. **Webhook setup happens after deployment** (Step 6)

**For local development testing:**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhook
# Copy the webhook signing secret it displays
```

**Going live:** When ready for real payments, toggle to live mode in the Stripe dashboard and replace test keys with live keys. You will need to complete Stripe's business verification.

---

## Step 3: Cloudinary Setup

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. From the **Dashboard**, copy your **Cloud Name**:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```
3. Create an **unsigned upload preset** for admin product image uploads:
   - Go to **Settings > Upload > Upload Presets**
   - Click **Add Upload Preset**
   - Set signing mode to **Unsigned**
   - Note the preset name:
     ```
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name
     ```
4. For the seed script (optional), also copy API Key and API Secret from the Dashboard:
   ```
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Free tier:** 25GB storage, 25GB bandwidth/month. Images are automatically optimized (WebP/AVIF) and resized per device.

---

## Step 4: Resend Setup (Email Notifications)

1. Create an account at [resend.com](https://resend.com)
2. Go to **API Keys** and generate a new key:
   ```
   RESEND_API_KEY=re_...
   ```
3. **Verify your sending domain** (required for deliverability):
   - Go to **Domains > Add Domain**
   - Enter your domain (e.g., `beadsandbloom.com`)
   - Add the DNS records Resend provides to your domain registrar:
     - **SPF** -- TXT record for sender authentication
     - **DKIM** -- TXT record for email signing
     - **DMARC** -- TXT record for email policy (optional but recommended)
   - Wait for verification (usually under 5 minutes)
4. Set your sender email and admin notification email:
   ```
   RESEND_FROM_EMAIL=orders@yourdomain.com
   ADMIN_EMAIL=your-personal-email@example.com
   ```

**Free tier:** 100 emails/day (3,000/month). Sufficient for order notifications at launch volume.

**Without domain verification:** Resend allows sending from `onboarding@resend.dev` for testing, but emails may go to spam. Verify your domain before going live.

---

## Step 5: Deploy to Vercel

1. **Import your repository:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Connect your Git provider and select the repository
   - Set the **Root Directory** to `projects/briefs/beads-and-bloom-website`

2. **Set environment variables:**
   - In the Vercel project settings, go to **Settings > Environment Variables**
   - Add every variable from `.env.example` with your production values
   - Use **live** Stripe keys (not test) for production
   - Set `NEXT_PUBLIC_BASE_URL` to your production URL

3. **Deploy:**
   - Click Deploy -- Vercel builds and deploys automatically
   - Note your deployment URL (e.g., `your-project.vercel.app`)

4. **Custom domain (recommended):**
   - Go to **Settings > Domains**
   - Add your custom domain (e.g., `beadsandbloom.com`)
   - Follow the DNS instructions (A record or CNAME)
   - Vercel provisions an SSL certificate automatically

---

## Step 6: Post-Deploy Configuration

### Stripe Webhook

This is critical -- without the webhook, orders will not be recorded after payment.

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add Endpoint**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
5. Click **Add Endpoint**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add it to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
8. **Redeploy** the site so the new variable takes effect:
   - Go to **Deployments** tab in Vercel
   - Click the three dots on the latest deployment > **Redeploy**

### Test the Full Flow

1. Visit your site
2. Add a product to cart
3. Complete checkout using Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)
4. Verify:
   - Order appears in the admin dashboard (`/admin`)
   - Confirmation email is received
   - Stripe dashboard shows the payment

### Admin Access

The admin dashboard is at `/admin`. Log in with the password you set in `ADMIN_PASSWORD`.

---

## Environment Variable Summary

| Variable | Required | Service |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Neon Postgres |
| `STRIPE_SECRET_KEY` | Yes | Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Cloudinary |
| `CLOUDINARY_API_KEY` | Seed only | Cloudinary |
| `CLOUDINARY_API_SECRET` | Seed only | Cloudinary |
| `RESEND_API_KEY` | Yes | Resend |
| `RESEND_FROM_EMAIL` | Yes | Resend |
| `ADMIN_EMAIL` | Yes | Resend |
| `ADMIN_PASSWORD` | Yes | Admin auth |
| `ADMIN_SESSION_SECRET` | Yes | Admin auth |
| `NEXT_PUBLIC_BASE_URL` | Yes | Site config |

---

## Troubleshooting

### Build fails with "DATABASE_URL is not set"
The database URL must be set in Vercel environment variables. Go to Settings > Environment Variables and add it. Make sure it is available to the **Production** environment.

### Stripe webhook not working
- Verify the webhook URL is exactly `https://yourdomain.com/api/webhook`
- Check the signing secret matches what is in Vercel env vars
- In the Stripe dashboard, check the webhook's **Attempts** tab for error details
- After updating env vars in Vercel, you must **redeploy**

### Emails going to spam
- Verify your domain in Resend (SPF + DKIM records)
- Add a DMARC record: `v=DMARC1; p=none; rua=mailto:your@email.com`
- Make sure `RESEND_FROM_EMAIL` uses your verified domain

### Images not loading
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Check the Cloudinary dashboard for the correct cloud name (it is case-sensitive)

### Admin login not working
- Verify `ADMIN_PASSWORD` is set in Vercel environment variables
- Verify `ADMIN_SESSION_SECRET` is set (used to sign session cookies)
- Clear browser cookies and try again

### "Page not found" after deploy
- Verify the **Root Directory** in Vercel is set to `projects/briefs/beads-and-bloom-website`
- Check the build logs for errors

---

## Monthly Costs at Launch

| Service | Cost |
|---------|------|
| Vercel Pro | $20/month |
| Neon Postgres | Free (0.5GB) |
| Stripe | 2.9% + $0.30 per transaction |
| Cloudinary | Free (25GB) |
| Resend | Free (100 emails/day) |
| **Total** | **~$20/month + Stripe fees** |

---

## Going Live Checklist

- [ ] Switch Stripe keys from test to live mode
- [ ] Complete Stripe business verification
- [ ] Verify sending domain in Resend (SPF + DKIM)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Configure custom domain in Vercel
- [ ] Create Stripe webhook with production URL
- [ ] Place a test order with a real card (refund it after)
- [ ] Confirm admin notifications are received
