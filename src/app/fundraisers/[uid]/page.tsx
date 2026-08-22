import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SliceZone } from '@prismicio/react'
import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { asLink, asText, isFilled } from '@prismicio/client'
import Heading from '@/components/typography/Heading'
import { Graph, Place, VirtualLocation } from 'schema-dts'
import { resolveRingColor } from '@/lib/utils'
import { ThemeDocumentData } from '../../../../prismicio-types'
export const revalidate = 3600
import { FLOURISH_FONT_CSS_VAR, DEFAULT_FLOURISH_FONT } from '@/lib/fonts'
import Script from 'next/script'

type Params = { uid: string }
type SearchParams = {
  [key: string]: string | string[] | undefined
}

// Matches --background in globals.css (light mode, oklch(1 0 0))
const PAGE_BACKGROUND = '#ffffff'

export default async function Page(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const client = createClient()
  const searchParams = await props.searchParams
  const params = await props.params
  const page = await client
    .getByUID('fundraiser', params.uid)
    .catch(() => notFound())
  const settings = await client.getSingle('settings')
  const isIndexable = page.data.allow_indexing === true
  const expiresAt = page.data.end ? `${page.data.end}T23:59:59-00:00` : null
  const pageNumber = { page: searchParams.page }

  const themeDoc = isFilled.contentRelationship(page.data.custom_theme)
    ? page.data.custom_theme
    : null
  const themeData = themeDoc?.data as ThemeDocumentData | undefined

  const themeStyle = themeData
    ? ({
        '--primary': themeData.primary_color,
        '--primary-dark':
          themeData.primary_color_dark ?? themeData.primary_color,
        '--primary-foreground': themeData.primary_foreground_color,
        '--primary-foreground-dark':
          themeData.primary_foreground_color_dark ??
          themeData.primary_foreground_color,
        '--secondary': themeData.secondary_color,
        '--secondary-dark':
          themeData.secondary_color_dark ?? themeData.secondary_color,
        '--secondary-foreground': themeData.secondary_foreground_color,
        '--secondary-foreground-dark':
          themeData.secondary_foreground_color_dark ??
          themeData.secondary_foreground_color,
        '--accent': themeData.accent_color,
        '--accent-dark': themeData.accent_color_dark ?? themeData.accent_color,
        '--accent-foreground': themeData.accent_foreground_color,
        '--accent-foreground-dark':
          themeData.accent_foreground_color_dark ??
          themeData.accent_foreground_color,
        '--font-flourish':
          FLOURISH_FONT_CSS_VAR[
            themeData.flourish_font ?? DEFAULT_FLOURISH_FONT
          ] ?? FLOURISH_FONT_CSS_VAR[DEFAULT_FLOURISH_FONT],
        '--ring': resolveRingColor({
          primaryColor: themeData.primary_color ?? PAGE_BACKGROUND,
          backgroundColor: PAGE_BACKGROUND,
          ringOverride: themeData.ring_color,
        }),
      } as React.CSSProperties)
    : undefined

  const attendanceMode =
    page.data.event_format === 'virtual'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : page.data.event_format === 'hybrid'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode'

  const physicalLocation =
    page.data.event_format !== 'virtual' && page.data.venue_name
      ? {
          '@type': 'Place' as const,
          name: page.data.venue_name,
          address: {
            '@type': 'PostalAddress' as const,
            streetAddress: page.data.street_address || undefined,
            addressLocality: page.data.city || undefined,
            addressRegion: page.data.state || undefined,
            postalCode: page.data.zip_code || undefined,
          },
        }
      : null

  const virtualLocation =
    page.data.event_format !== 'in_person' &&
    isFilled.link(page.data.virtual_link)
      ? {
          '@type': 'VirtualLocation' as const,
          url: asLink(page.data.virtual_link) ?? undefined,
        }
      : null

  const location: (Place | VirtualLocation)[] = [
    ...(physicalLocation ? [physicalLocation] : []),
    ...(virtualLocation ? [virtualLocation] : []),
  ]
  const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `https://${settings.data.domain || `example.com`}/#site`,
        name: settings.data.site_title || '',
        url: `https://${settings.data.domain || `example.com`}/`,
      },
      {
        '@type': 'Event',
        '@id': `https://${settings.data.domain || `example.com`}/fundraisers/${params.uid}/#fundraiser`,
        name: asText(page.data.title),
        description:
          asText(page.data.excerpt) || page.data.meta_description || undefined,
        url: `https://${settings.data.domain || `example.com`}/fundraisers/${params.uid}`,
        startDate: page.data.start || undefined,
        endDate: page.data.end || undefined,
        eventAttendanceMode: attendanceMode,
        location: location.length > 0 ? location : undefined,
        organizer: {
          '@type': 'Organization',
          name: settings.data.site_title || 'Fill In Site Title in CMS',
        },
        image: page.data.meta_image.url || undefined,
      },
    ],
  }

  const sliceContext = {
    page: searchParams.page,
    event: {
      startDate: page.data.start,
      endDate: page.data.end,
      format: page.data.event_format,
      venueName: page.data.venue_name,
      city: page.data.city,
      state: page.data.state,
      zipCode: page.data.zip_code,
      virtualLink: page.data.virtual_link,
    },
    logo: settings.data.logo,
  }
  return (
    <div className="theme-scope" style={themeStyle}>
      {isIndexable && expiresAt && (
        <meta name="robots" content={`unavailable_after: ${expiresAt}`} />
      )}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {page.data.slices[0]?.slice_type !== 'hero' && (
        <Heading
          as="h1"
          size="6xl"
          className="mx-auto my-8 max-w-(--breakpoint-lg) px-2 md:px-6 lg:my-12 lg:text-center"
        >
          {asText(page.data.title)}
        </Heading>
      )}
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={sliceContext}
      />
    </div>
  )
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const client = createClient()
  const params = await props.params
  const page = await client
    .getByUID('fundraiser', params.uid)
    .catch(() => notFound())
  const settings = await client.getSingle('settings')
  const isIndexable = page.data.allow_indexing === true
  return {
    title: `${asText(page.data.title) || page.data.meta_title} • ${
      settings.data.site_title
    }`,
    description:
      page.data.meta_description || settings.data.site_meta_description,
    robots: {
      index: isIndexable,
      follow: isIndexable,
    },
    openGraph: {
      images: [
        page.data.meta_image.url || settings.data.site_meta_image.url || '',
      ],
    },
    alternates: {
      canonical: `https://${settings.data.domain || `example.com`}/fundraisers/${params.uid}`,
    },
  }
}

export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType('fundraiser')
  return pages.map(page => {
    return { uid: page.uid }
  })
}
