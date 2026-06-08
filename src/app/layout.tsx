import type { Metadata } from 'next'
import './globals.css'
import { createClient, repositoryName } from '@/prismicio'
import Header from '@/components/layout/Header/Header'
import { cn } from '@/lib/utils'
import Footer from '@/components/layout/Footer/Footer'
import { PrismicPreview } from '@prismicio/next'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import { Graph, NonprofitType, Organization, PostalAddress } from 'schema-dts'
import PrivacyToast from '@/components/PrivacyToast'
import { Toaster } from '@/components/ui/sonner'
import Analytics from '@/components/Analytics'

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient()
  const settings = await client.getSingle('settings')
  return {
    metadataBase: new URL(`https://${settings.data.domain || `example.com`}`),
    title: settings.data.site_title || "Nick's Towing",
    description:
      settings.data.site_meta_description || `Eco-friendly auto towing.`,
    openGraph: {
      images: [settings.data.site_meta_image.url || ''],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const client = createClient()
  const settings = await client.getSingle('settings')
  const url = settings.data.domain || 'example.com'

  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
  const fbId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

  const status = settings.data.nonprofit_status as NonprofitType

  const organizationSchema: Organization = {
    '@type': 'Organization',
    '@id': `https://${url}/#organization`,
    url: `https://${url}`,
  }
  const organizationAddress: PostalAddress = {
    '@type': 'PostalAddress',
    '@id': `https://${url}/#legal_address`,
  }
  const operationalAddress: PostalAddress = {
    '@type': 'PostalAddress',
    '@id': `https://${url}/#address`,
  }

  // Safely inject properties only if they actually exist

  if (settings.data.country) {
    organizationAddress.addressCountry = settings.data.country
    operationalAddress.addressCountry = settings.data.country
  }
  if (settings.data.legal_po_box)
    organizationAddress.postOfficeBoxNumber = settings.data.legal_po_box
  if (settings.data.locality) {
    organizationAddress.addressLocality = settings.data.locality
    operationalAddress.addressLocality = settings.data.locality
  }
  if (settings.data.school_street_address)
    operationalAddress.streetAddress = settings.data.school_street_address
  if (settings.data.school_postal_code)
    operationalAddress.postalCode = settings.data.school_postal_code
  if (settings.data.legal_postal_code)
    organizationAddress.postalCode = settings.data.legal_postal_code
  if (settings.data.legal_name)
    organizationSchema.legalName = settings.data.legal_name
  if (settings.data.email) organizationSchema.email = settings.data.email
  if (settings.data.founding_date)
    organizationSchema.foundingDate = settings.data.founding_date
  if (settings.data.tax_id) organizationSchema.taxID = settings.data.tax_id
  if (status)
    organizationSchema.nonprofitStatus =
      `https://schema.org/${status}` as NonprofitType
  organizationSchema.legalAddress = organizationAddress
  organizationSchema.address = operationalAddress

  // Properly format the logo as an ImageObject
  if (settings.data.logo?.url) {
    organizationSchema.logo = {
      '@type': 'ImageObject',
      url: settings.data.logo.url,
      caption: `${settings.data.legal_name || 'Organization'} Logo`,
    }
  }

  const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema],
  }

  return (
    <html lang="en" suppressHydrationWarning className={cn('scroll-smooth')}>
      <head>
        <link rel="preconnect" href="https://images.prismic.io" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col justify-between bg-background font-sans antialiased',
        )}
      >
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <PrivacyToast message={settings.data.privacy_toast_message} />
          <Toaster richColors closeButton />
        </ThemeProvider>
        <PrismicPreview repositoryName={repositoryName} />
        {isProd && <Analytics gaId={gaId} clarityId={clarityId} fbId={fbId} />}
      </body>
    </html>
  )
}
