# Clearhold

AI co-pilot for held PayPal payments — especially international ones.

When money lands in PayPal and gets stuck in review, Clearhold helps recipients clear it faster and helps senders pay with documentation that reduces holds in the first place.

## Features

### Unstick funds (recipients)
- Paste a hold notice or case text
- Get a likely cause + risk level
- Receive a tailored document checklist
- Copy a ready-to-send PayPal support reply
- Get an invoice / award outline for your source-of-funds pack

### Send safely (senders)
- Create a PayPal invoice package with an explicit purpose
- Send a payout with a clear payment note
- Check payout status
- Label payment type before money moves

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Vercel AI SDK for structured hold diagnosis
- PayPal REST APIs: OAuth, Invoicing, Payouts, status

**Free AI options**

1. **Google AI Studio (recommended, no card):** set `GOOGLE_GENERATIVE_AI_API_KEY` from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. **Vercel AI Gateway free models:** work at $0, but Vercel requires a card on the team first

Without either, diagnosis uses a built-in demo engine. PayPal invoice/payout stays in demo until you add sandbox credentials.

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment (optional)

Copy `.env.example` to `.env.local`:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=
GOOGLE_MODEL=gemini-2.0-flash

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

## Project structure

```
src/
  app/
    page.tsx              # Landing
    resolve/              # Recipient hold-resolution flow
    send/                 # Sender invoice + payout flow
    api/diagnose/         # AI / demo diagnosis
    api/paypal/           # Invoice, payout, status
  components/             # UI for resolve + send flows
  lib/ai/                 # Diagnosis engine
  lib/paypal/             # PayPal client + demo fallbacks
```

## License

MIT
