'use server'
import { z } from 'zod'

const donationSchema = z.object({
  sourceId: z.string().min(1),
  amountCents: z.number().int().min(100).max(1_000_000),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
})

export async function processDonation(
  sourceId: string,
  amountCents: number,
  name: string,
  email: string,
  phone?: string,
): Promise<{ success: true; paymentId: string; receiptUrl: string } | { success: false; error: string }> {
  const parsed = donationSchema.safeParse({ sourceId, amountCents, name, email, phone })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const digits = phone?.replace(/\D/g, '') ?? ''
  const e164Phone =
    digits.length === 10
      ? `+1${digits}`
      : digits.length === 11 && digits.startsWith('1')
        ? `+${digits}`
        : ''

  try {
    const squareUrl =
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? 'https://connect.squareup.com/v2/payments'
        : 'https://connect.squareupsandbox.com/v2/payments'
    const res = await fetch(squareUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2025-01-23',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        reference_id: `DONATION-WEBSITE-${Date.now()}`,
        amount_money: { amount: amountCents, currency: 'USD' },
        note: `Website Donation from ${name} (${email})`,
        buyer_email_address: email,
        ...(e164Phone ? { buyer_phone_number: e164Phone } : {}),
        metadata: {
          type: 'donation',
          source: 'website',
        },
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.errors?.[0]?.detail ?? 'Payment failed' }
    }
    return { success: true, paymentId: data.payment.id, receiptUrl: data.payment.receipt_url ?? '' }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
