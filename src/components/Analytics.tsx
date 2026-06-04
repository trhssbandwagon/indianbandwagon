'use client'

import { useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

export default function Analytics({
  gaId,
  clarityId,
  fbId,
}: {
  gaId?: string
  clarityId?: string
  fbId?: string
}) {
  useEffect(() => {
    // Check if the user has already opted out
    const consent = localStorage.getItem('cookie-consent')

    if (consent === 'denied') {
      // 1. Kill GA4 tracking
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
        })
      }
      // 2. Kill Clarity
      if (typeof window.clarity === 'function') {
        window.clarity('stop')
      }
      // 3. Kill Facebook
      if (typeof window.fbq === 'function') {
        window.fbq('consent', 'revoke')
      }
    }
  }, [])

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      )}

      {fbId && (
        <Script id="fb-pixel" type="text/partytown">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            '/proxies/facebook/en_US/fbevents.js');
            fbq('init', '${fbId}');
            fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  )
}
