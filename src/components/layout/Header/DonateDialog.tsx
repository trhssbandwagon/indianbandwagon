'use client'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ApplePay,
  CreditCard,
  GooglePay,
  PaymentForm,
} from 'react-square-web-payments-sdk'
import { processDonation } from '@/app/actions/donate'
import { toast } from 'sonner'

type DonateDialogProps = {
  buttonClassName?: string
}

export function DonateDialog({ buttonClassName }: DonateDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

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

  useEffect(() => {
    const stored = sessionStorage.getItem('donation_success')
    if (stored) {
      sessionStorage.removeItem('donation_success')
      toast.success(`Thank you! Your $${stored} donation has been received.`)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setCustomAmount('')
      setConfirmed(false)
      setShowCardForm(false)
      setName('')
      setEmail('')
    }
  }, [open])

  return (
    <>
      <Button onClick={() => setOpen(true)} className={buttonClassName}>
        Donate
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>

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
                  if (amountCents < 100) return toast.error('Minimum donation is $1.00.')
                  if (token.status !== 'OK') return toast.error('Tokenization failed.')

                  // Wallet payments supply billing contact — use as fallback for form fields
                  const billing = token.details?.billing
                  const resolvedName =
                    name.trim() ||
                    [billing?.givenName, billing?.familyName].filter(Boolean).join(' ')
                  const resolvedEmail = email.trim() || billing?.email || ''

                  if (!resolvedName) return toast.error('Please enter your name.')
                  if (!resolvedEmail.includes('@')) return toast.error('Please enter a valid email.')

                  const result = await processDonation(
                    token.token,
                    amountCents,
                    resolvedName,
                    resolvedEmail,
                  )
                  if (result.success) {
                    sessionStorage.setItem('donation_success', amountDollars)
                    setOpen(false)
                  } else {
                    toast.error(result.error)
                  }
                }}
              >
                {/* Wallet buttons — each auto-hides on unsupported devices */}
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
                      <span className="text-xs text-muted-foreground uppercase">
                        or
                      </span>
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
        </DialogContent>
      </Dialog>
    </>
  )
}
