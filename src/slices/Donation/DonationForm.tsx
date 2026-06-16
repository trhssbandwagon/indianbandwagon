'use client'
import { useEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ApplePay,
  CreditCard,
  GooglePay,
  PaymentForm,
} from 'react-square-web-payments-sdk'
import { processDonation } from '@/app/actions/donate'
import { toast } from 'sonner'

type PendingDonation = {
  token: string
  amountCents: number
  amountDollars: string
  name: string
  email: string
}

async function recoverPendingDonation(): Promise<{ amount: string } | null> {
  const raw = sessionStorage.getItem('donation_pending')
  if (!raw) return null
  sessionStorage.removeItem('donation_pending')
  try {
    const { token, amountCents, amountDollars, name, email } = JSON.parse(raw) as PendingDonation
    const result = await processDonation(token, amountCents, name, email)
    // Square rejects a reused nonce with a detail about the source — treat as prior success
    if (result.success || (!result.success && /already|source/i.test(result.error ?? ''))) {
      return { amount: amountDollars }
    }
    toast.error(result.error ?? 'Payment could not be completed. Please try again.')
  } catch {
    toast.error('Something went wrong. Please try again.')
  }
  return null
}

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [donated, setDonated] = useState(false)
  const [successAmount, setSuccessAmount] = useState('')
  const [showCardForm, setShowCardForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function recover() {
      // Layer 2: retry a payment whose token was stored before a tab-kill
      const recovered = await recoverPendingDonation()
      if (recovered) {
        setSuccessAmount(recovered.amount)
        setDonated(true)
        return
      }
      // Layer 1: success was confirmed in a prior session that navigated away
      const stored = sessionStorage.getItem('donation_success')
      if (stored) {
        sessionStorage.removeItem('donation_success')
        setSuccessAmount(stored)
        setDonated(true)
      }
    }
    recover()
  }, [])

  const amountCents =
    selectedAmount === 'custom'
      ? Math.round(parseFloat(customAmount || '0') * 100)
      : parseInt(selectedAmount) * 100

  const amountDollars = (amountCents / 100).toFixed(2)

  const handleAmountChange = (v: string) => {
    if (!v) return
    setSelectedAmount(v)
  }

  const handleChangeAmount = () => {
    setConfirmed(false)
    setShowCardForm(false)
    setName('')
    setEmail('')
  }

  const handleDonateAgain = () => {
    setDonated(false)
    setSuccessAmount('')
    setSelectedAmount('10')
    setCustomAmount('')
    setConfirmed(false)
    setShowCardForm(false)
    setName('')
    setEmail('')
  }

  if (donated) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <p className="text-5xl">✓</p>
          <p className="text-2xl font-bold">Thank you for your donation!</p>
          {successAmount && (
            <p className="text-muted-foreground">
              Your ${successAmount} donation has been received.
            </p>
          )}
          <Button variant="outline" onClick={handleDonateAgain}>
            Donate again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col gap-4 pt-6">
        {!confirmed ? (
          <>
            <p className="text-center text-4xl font-bold tracking-tight">
              ${amountDollars}
            </p>

            <ToggleGroup
              type="single"
              variant="outline"
              value={selectedAmount}
              onValueChange={handleAmountChange}
            >
              <ToggleGroupItem value="5">$5</ToggleGroupItem>
              <ToggleGroupItem value="10">$10</ToggleGroupItem>
              <ToggleGroupItem value="25">$25</ToggleGroupItem>
              <ToggleGroupItem value="50">$50</ToggleGroupItem>
              <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
            </ToggleGroup>

            {selectedAmount === 'custom' && (
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="pl-7 md:text-base lg:text-lg dark:text-emerald-300"
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={amountCents < 100}
              onClick={() => setConfirmed(true)}
            >
              Donate ${amountDollars}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={handleChangeAmount}
              >
                ← Change amount
              </button>
              <p className="text-2xl font-bold">${amountDollars}</p>
            </div>

            <PaymentForm
              applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              createPaymentRequest={() => ({
                countryCode: 'US',
                currencyCode: 'USD',
                total: {
                  amount: amountDollars,
                  label: 'Donation',
                },
                requestBillingContact: true,
              })}
              cardTokenizeResponseReceived={async token => {
                try {
                  if (amountCents < 100) return toast.error('Minimum donation is $1.00.')
                  if (token.status !== 'OK') return toast.error('Tokenization failed.')

                  const billing = token.details?.billing
                  const resolvedName =
                    name.trim() ||
                    [billing?.givenName, billing?.familyName].filter(Boolean).join(' ')
                  const resolvedEmail = email.trim() || billing?.email || ''

                  if (!resolvedName) return toast.error('Please enter your name.')
                  if (!resolvedEmail.includes('@'))
                    return toast.error('Please enter a valid email.')

                  sessionStorage.setItem(
                    'donation_pending',
                    JSON.stringify({ token: token.token, amountCents, amountDollars, name: resolvedName, email: resolvedEmail }),
                  )

                  const result = await processDonation(
                    token.token,
                    amountCents,
                    resolvedName,
                    resolvedEmail,
                  )
                  sessionStorage.removeItem('donation_pending')

                  if (result.success) {
                    sessionStorage.setItem('donation_success', amountDollars)
                    setSuccessAmount(amountDollars)
                    setDonated(true)
                  } else {
                    toast.error(result.error)
                  }
                } catch {
                  sessionStorage.removeItem('donation_pending')
                  toast.error('Something went wrong. Please try again.')
                }
              }}
            >
              <div className="flex flex-col gap-2">
                <ApplePay />
                <GooglePay />
              </div>

              {showCardForm ? (
                <div className="mt-3 flex flex-col gap-3">
                  <Input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    className="md:text-base lg:text-lg dark:text-emerald-300"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="md:text-base lg:text-lg dark:text-emerald-300"
                  />
                  <CreditCard
                    buttonProps={{
                      css: {
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        '&:hover': {
                          opacity: 0.9,
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase text-muted-foreground">or</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCardForm(true)}
                  >
                    Pay with Credit Card
                  </Button>
                </div>
              )}
            </PaymentForm>
          </>
        )}
      </CardContent>
    </Card>
  )
}
