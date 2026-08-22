import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SliceZone } from '@prismicio/react'

import { createClient } from '@/prismicio'
import { components } from '@/slices'
import { asText, isFilled } from '@prismicio/client'
import Heading from '@/components/typography/Heading'
import { Graph } from 'schema-dts'
import { Breadcrumbs } from '../../components/layout/Breadcrumbs'
import Section from '@/components/layout/Section'
import Script from 'next/script'

type Params = { path: string[] }
type SearchParams = {
  [key: string]: string | string[] | undefined
}

export default async function Page(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { path } = params
  // 1. Reconstruct the UID from the path array (the last item is the current page)
  // If no path exists, we are on the homepage
  const uid = path[path.length - 1]
  const client = createClient()
  const page = await client
    .getByUID('page', uid, {
      fetchLinks: ['page.title'],
    })
    .catch(() => notFound())
  const settings = await client.getSingle('settings')
  const pageNumber = { page: searchParams.page }

  const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://${settings.data.domain || `example.com`}/#${page.uid}`,
        about: page.data.meta_description || undefined,
        author: {
          '@type': 'Organization',
          name: settings.data.site_title || 'Fill In Site Title in CMS',
        },
        copyrightHolder: {
          '@type': 'Organization',
          name: settings.data.site_title || 'Fill In Site Title in CMS',
        },
        datePublished: page.first_publication_date,
        dateModified: page.last_publication_date,
        image:
          page.data.meta_image.url ||
          settings.data.site_meta_image.url ||
          undefined,
      },
    ],
  }

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {page.data.slices[0]?.slice_type !== 'hero' && (
        <Heading
          as="h1"
          size="6xl"
          className="mx-auto my-8 max-w-(--breakpoint-lg) scroll-mt-12 px-2 md:px-6 lg:my-12 lg:text-center"
        >
          {asText(page.data.title)}
        </Heading>
      )}
      <Section width="md">
        <Breadcrumbs currentPage={page} path={path} />
      </Section>
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
  const params = await props.params
  const { path } = params
  // 1. Reconstruct the UID from the path array (the last item is the current page)
  // If no path exists, we are on the homepage
  const uid = path && path.length > 0 ? path[path.length - 1] : 'home'
  const isHome = uid === 'home'
  const client = createClient()
  const page = await client
    .getByUID(isHome ? 'homepage' : 'page', uid, {
      fetchLinks: ['page.title', 'page.parent'],
    })
    .catch(() => notFound())
  const settings = await client.getSingle('settings')

  return {
    title: `${asText(page.data.title) || page.data.meta_title} • ${
      settings.data.site_title
    }`,
    description:
      page.data.meta_description || settings.data.site_meta_description,
    openGraph: {
      images: [
        page.data.meta_image.url || settings.data.site_meta_image.url || '',
      ],
      description:
        page.data.meta_description || settings.data.site_meta_description || '',
    },
    alternates: {
      canonical: `https://${settings.data.domain || `example.com`}${page.url}`,
    },
  }
}
export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType('page')

  return pages.map(page => {
    // page.url will now natively output perfectly nested paths like ['privacy-policy', 'events']
    const segments = page.url?.split('/').filter(Boolean) || []

    return {
      path: segments,
    }
  })
}
