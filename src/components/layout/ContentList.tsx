import React from 'react'
import { createClient } from '@/prismicio'
import {
  ImageField,
  RichTextField,
  SelectField,
  asText,
} from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import Link from 'next/link'
import Pagination from '@/components/layout/Pagination'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import Heading from '../typography/Heading'
import { BookOpen } from 'lucide-react'

interface ContentItem {
  id: string
  url: string | null | undefined
  data: {
    featured_image: ImageField
    title: RichTextField
    excerpt: RichTextField
  }
}

type ContentListProps = {
  contentType: SelectField
  page: number | undefined
  display: number | undefined
  ctaText?: string
  fallbackItemImage: ImageField
}

const ContentList = async ({
  ctaText = 'Read More',
  display = 5,
  fallbackItemImage,
  page = 1,
}: ContentListProps): Promise<React.JSX.Element> => {
  const client = createClient()
  const prismicData = await client.getByType('post', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
    page,
    pageSize: display,
  })

  const results = prismicData.results as unknown as ContentItem[]

  return (
    <>
      {results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-40" />
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Check back soon — new content is on the way.</p>
        </div>
      )}
      <ul>
        {results.length > 0 &&
          results.map(item => {
            return (
              <li
                key={item.id}
                className="group grid border-t border-t-secondary py-10 lg:grid-cols-5"
              >
                <div className="flex items-center justify-center transition duration-300 ease-in-out lg:col-span-2 lg:-mr-4 group-hover:lg:translate-x-2">
                  <Link href={item.url || '#'}>
                    <PrismicNextImage
                      field={
                        item.data.featured_image.url
                          ? item.data.featured_image
                          : fallbackItemImage
                      }
                      className="rounded-lg"
                    />
                  </Link>
                </div>
                <Card className="bg-background/80 backdrop-blur transition duration-300 ease-in-out lg:col-span-3 lg:-ml-4 group-hover:lg:-translate-x-2">
                  <CardHeader>
                    <PrismicRichText
                      field={item.data.title}
                      components={{
                        heading1: ({
                          children,
                        }: {
                          children: React.ReactNode
                        }) => (
                          <Heading as="h2" size="3xl">
                            {children}
                          </Heading>
                        ),
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    <PrismicRichText field={item.data.excerpt} />
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link
                        href={item.url || '#'}
                        aria-label={
                          asText(item.data.title) || 'View the content'
                        }
                      >
                        {ctaText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            )
          })}
      </ul>
      {prismicData.total_pages > 1 && (
        <Pagination
          hasNextPage={prismicData.next_page !== null}
          hasPrevPage={prismicData.prev_page !== null}
          totalPages={prismicData.total_pages}
        />
      )}
    </>
  )
}

export default ContentList
