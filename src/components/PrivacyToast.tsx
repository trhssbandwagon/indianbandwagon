'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { KeyTextField } from '@prismicio/client'

interface PrivacyToastProps {
  message?: KeyTextField
}

export default function PrivacyToast({ message }: PrivacyToastProps) {
  const router = useRouter()

  // Helper to send events to GA4
  const trackPrivacyEvent = (
    action: 'view_policy' | 'dismiss' | 'manual_close',
  ) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'privacy_notice_interaction', {
        event_category: 'engagement',
        event_label: action,
      })
    }
  }

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('has-seen-privacy-notice')

    if (!hasSeenNotice) {
      const timer = setTimeout(() => {
        toast('Privacy & Analytics', {
          description: message
            ? message
            : 'We use GA4 and Meta Pixel to improve this site. Check out our privacy page to learn more.',
          duration: Infinity,
          onDismiss: () => {
            if (!localStorage.getItem('has-seen-privacy-notice')) {
              trackPrivacyEvent('manual_close')
              localStorage.setItem('has-seen-privacy-notice', 'true')
            }
          },
          action: {
            label: 'View Policy',
            onClick: () => {
              trackPrivacyEvent('view_policy')
              localStorage.setItem('has-seen-privacy-notice', 'true')
              router.push('/privacy') // TODO: This should be editable via the CMS
            },
          },
          cancel: {
            label: 'Dismiss',
            onClick: () => {
              trackPrivacyEvent('dismiss')
              localStorage.setItem('has-seen-privacy-notice', 'true')
            },
          },
          icon: <ShieldCheck className="h-4 w-4 text-primary" />,
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [router, message])

  return null
}
