'use client'

import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FaPlugCircleCheck,
  FaPlugCircleXmark,
  FaArrowRotateLeft,
} from 'react-icons/fa6'
import { toast } from 'sonner'

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('local-storage-update', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('local-storage-update', callback)
  }
}

const getClientSnapshot = () =>
  localStorage.getItem('cookie-consent') === 'denied'
const getServerSnapshot = () => false

export default function PrivacyManager() {
  const isOptedOut = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )

  const updateConsent = (isDenying: boolean) => {
    if (isDenying) {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      }
      if (typeof window.clarity === 'function') window.clarity('stop')
      if (typeof window.fbq === 'function') window.fbq('consent', 'revoke')

      localStorage.setItem('cookie-consent', 'denied')
      toast.error('Tracking Disabled', {
        description: 'Your privacy preferences have been updated.',
      })
    } else {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
        })
      }
      localStorage.removeItem('cookie-consent')
      toast.success('Tracking Active', {
        description: 'Anonymous analytics are now enabled.',
      })
    }
    window.dispatchEvent(new Event('local-storage-update'))
  }

  return (
    <Card className="mx-auto w-full max-w-xl border-border bg-card text-card-foreground">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">
              Privacy Preferences
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground sm:text-sm">
              Manage how this site uses analytics and marketing tools.
            </CardDescription>
          </div>
          {isOptedOut ? (
            <Badge variant="destructive" className="shrink-0">
              Opted Out
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="shrink-0 border-green-800 font-bold text-green-800 dark:border-green-400 dark:text-green-400"
            >
              Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/50 p-4 transition-colors duration-300">
          <div
            className={`rounded-full p-2 transition-colors duration-500 ${isOptedOut ? 'bg-destructive/10' : 'bg-primary/10'}`}
          >
            {isOptedOut ? (
              <FaPlugCircleXmark className="h-5 w-5 text-destructive" />
            ) : (
              <FaPlugCircleCheck className="h-5 w-5 text-green-800 dark:text-green-400" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-none font-semibold">
              {isOptedOut
                ? 'Data collection is blocked'
                : 'Anonymous analytics are active'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {isOptedOut
                ? 'I am not collecting any behavioral data or marketing signals from your visit.'
                : 'I collect anonymous usage data to understand which content is most helpful.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isOptedOut ? (
            <Button
              onClick={() => updateConsent(false)}
              className="w-full cursor-pointer gap-2 font-semibold"
            >
              <FaArrowRotateLeft className="h-4 w-4" /> Re-enable All Tracking
            </Button>
          ) : (
            <Button
              onClick={() => updateConsent(true)}
              variant="outline"
              className="hover:text-destructive-foreground w-full cursor-pointer gap-2 border-input font-semibold transition-all hover:bg-destructive"
            >
              <FaPlugCircleXmark className="h-4 w-4" /> Opt Out of Tracking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
