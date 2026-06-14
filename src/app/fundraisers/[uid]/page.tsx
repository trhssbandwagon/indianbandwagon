import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { asText } from '@prismicio/client'
import Heading from '@/components/typography/Heading'
import { Graph } from 'schema-dts'

export const revalidate = 3600

type Params = { uid: string }
type SearchParams = {
  [key: string]: string | string[] | undefined
}

export default async function Page(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const client = createClient()
  const searchParams = await props.searchParams
  const params = await props.params
  const page = await client
    .getByUID('fundraiser', params.uid, {})
    .catch(() => notFound())
  const settings = await client.getSingle('settings')
  const pageNumber = { page: searchParams.page }

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
        organizer: {
          '@type': 'Organization',
          name: settings.data.site_title || 'Fill In Site Title in CMS',
        },
        image: page.data.meta_image.url || undefined,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Heading
        as="h1"
        size="6xl"
        className="mx-auto my-8 max-w-(--breakpoint-lg) px-2 md:px-6 lg:my-12 lg:text-center"
      >
        {asText(page.data.title)}
      </Heading>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={pageNumber}
      />
    </>
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

  return {
    title: `${asText(page.data.title) || page.data.meta_title} • ${
      settings.data.site_title
    }`,
    description:
      page.data.meta_description || settings.data.site_meta_description,
    robots: {
      index: false,
      follow: false,
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
