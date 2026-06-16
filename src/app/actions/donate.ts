'use server'
import { z } from 'zod'

const donationSchema = z.object({
  sourceId: z.string().min(1),
  amountCents: z.number().int().min(100).max(1_000_000),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('A valid email is required'),
})

export async function processDonation(
  sourceId: string,
  amountCents: number,
  name: string,
  email: string,
): Promise<{ success: true; paymentId: string } | { success: false; error: string }> {
  const parsed = donationSchema.safeParse({ sourceId, amountCents, name, email })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const res = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2025-01-23',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        amount_money: { amount: amountCents, currency: 'USD' },
        note: `Website Donation from ${name} (${email})`,
        buyer_email_address: email,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.errors?.[0]?.detail ?? 'Payment failed' }
    }
    return { success: true, paymentId: data.payment.id }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
