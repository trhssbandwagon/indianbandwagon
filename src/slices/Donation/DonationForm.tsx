'use client'
import { useState } from 'react'
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

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')
  const [showCardForm, setShowCardForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [paymentFormKey, setPaymentFormKey] = useState(1000)

  const amountCents =
    selectedAmount === 'custom'
      ? Math.round(parseFloat(customAmount || '0') * 100)
      : parseInt(selectedAmount) * 100

  const amountDollars = (amountCents / 100).toFixed(2)

  const handleAmountChange = (v: string) => {
    if (!v) return
    setSelectedAmount(v)
    if (v !== 'custom') {
      setPaymentFormKey(parseInt(v) * 100)
    }
  }

  const handleCustomAmountBlur = () => {
    setPaymentFormKey(Math.round(parseFloat(customAmount || '0') * 100))
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="flex flex-col gap-4 pt-6">
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
              onBlur={handleCustomAmountBlur}
              className="pl-7 md:text-base lg:text-lg dark:text-emerald-300"
            />
          </div>
        )}

        <PaymentForm
          key={paymentFormKey}
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

            const billing = token.details?.billing
            const resolvedName =
              name.trim() ||
              [billing?.givenName, billing?.familyName].filter(Boolean).join(' ')
            const resolvedEmail = email.trim() || billing?.email || ''

            if (!resolvedName) return toast.error('Please enter your name.')
            if (!resolvedEmail.includes('@'))
              return toast.error('Please enter a valid email.')

            const result = await processDonation(
              token.token,
              amountCents,
              resolvedName,
              resolvedEmail,
            )
            if (result.success) {
              toast.success('Thank you for your donation!')
            } else {
              toast.error(result.error)
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
      </CardContent>
    </Card>
  )
}
