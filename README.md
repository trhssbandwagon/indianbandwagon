# Indian Bandwagon

Website for the Indian Bandwagon — the student band program at TRHS. Built with Next.js, Prismic CMS, Square payments, and Resend email.

## Tech Stack

- **Framework**: Next.js 16 / React 19
- **CMS**: [Prismic](https://prismic.io)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Payments**: Square Web Payments SDK
- **Email**: Resend
- **Bot protection**: reCAPTCHA Enterprise
- **Events**: Google Calendar v3 API
- **Analytics**: GA4, Microsoft Clarity, Facebook Pixel
- **Runtime**: Bun

## Prerequisites

- [Bun](https://bun.sh) installed
- Access to the Prismic repository
- Accounts / credentials for: Square, Resend, Google Cloud (reCAPTCHA Enterprise + Calendar API)

## Setup

```bash
bun install
cp .env.local.example .env.local   # then fill in values (see below)
bun dev
```

`bun dev` runs Next.js and the Prismic type builder concurrently. The type builder keeps `src/prismicio-types.d.ts` in sync with your Prismic schema while you develop.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` | Facebook Pixel ID |
| `NEXT_PUBLIC_VERCEL_ENV` | Set to `production` to activate analytics and Square live payments |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA Enterprise site key |
| `RECAPTCHA_PROJECT_ID` | Google Cloud project ID for reCAPTCHA Enterprise |
| `RECAPTCHA_API_KEY` | Google Cloud API key for reCAPTCHA Enterprise REST API |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_EMAIL_TO` | Comma-separated recipient addresses for contact form submissions |
| `NEXT_PUBLIC_SQUARE_APP_ID` | Square application ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Square location ID |
| `SQUARE_ACCESS_TOKEN` | Square server-side access token |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID for the Events section |
| `GOOGLE_CALENDAR_API_KEY` | Google Cloud API key for Calendar v3 API |

Square automatically uses the sandbox API when `NEXT_PUBLIC_VERCEL_ENV` is not `production`.

## Commands

```bash
bun dev       # Start dev server + Prismic type builder
bun build     # Production build
bun lint      # ESLint
bun format    # Prettier (writes in place)
```

## Content Management

All content is managed in [Prismic](https://prismic.io). The Slice Machine UI runs alongside `bun dev` — use it to create and modify content slices. After changing a slice model, Prismic regenerates the TypeScript types automatically.

Prismic webhooks trigger ISR via the `/api/revalidate` endpoint, so published content updates propagate to the live site without a redeploy.

## Deployment

Deploy to [Vercel](https://vercel.com). Set all environment variables above in the Vercel project settings. Set `NEXT_PUBLIC_VERCEL_ENV=production` on the production environment only — this gates live Square payments and analytics.

Configure a Prismic webhook pointing to `https://<your-domain>/api/revalidate` (POST) to enable on-demand revalidation when content is published.
