import React from 'react'
import { createClient } from '@/prismicio'
import { ImageField, RichTextField, asText } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import Link from 'next/link'
import Pagination from '@/components/layout/Pagination'
import { format, parseISO, isAfter, isBefore } from 'date-fns'

interface FundraiserItem {
  id: string
  uid: string
  url: string | null | undefined
  data: {
    featured_image: ImageField
    title: RichTextField
    excerpt: RichTextField
    start_date: string | null
    end_date: string | null
  }
}

type FundraiserListProps = {
  page: number | undefined
  display: number | undefined
  ctaText?: string
  fallbackItemImage: ImageField
}

function getStatus(startDate: string | null, endDate: string | null) {
  if (!startDate) return null
  const today = new Date()
  const start = parseISO(startDate)
  if (isAfter(start, today)) return 'Upcoming'
  if (!endDate || !isBefore(parseISO(endDate), today)) return 'Active'
  return null
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate) return null
  const start = format(parseISO(startDate), 'MMM d, yyyy')
  if (!endDate) return start
  const end = format(parseISO(endDate), 'MMM d, yyyy')
  return `${start} – ${end}`
}

const FundraiserList = async ({
  ctaText = 'Learn More',
  display = 6,
  fallbackItemImage,
  page = 1,
}: FundraiserListProps): Promise<React.JSX.Element> => {
  const client = createClient()
  const prismicData = await client.getByType('fundraiser', {
    orderings: {
      field: 'my.fundraiser.start_date',
      direction: 'asc',
    },
    page,
    pageSize: display,
  })

  const results = prismicData.results as unknown as FundraiserItem[]

  return (
    <>
      {results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <CalendarDays className="h-10 w-10 opacity-40" />
          <p className="text-lg font-medium">No active fundraisers right now</p>
          <p className="text-sm">
            Check back soon — new opportunities are added regularly.
          </p>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.length > 0 &&
          results.map(item => {
            const href = item.url || `/fundraisers/${item.uid}`
            const status = getStatus(item.data.start_date, item.data.end_date)
            const dateRange = formatDateRange(
              item.data.start_date,
              item.data.end_date,
            )
            const image = item.data.featured_image.url
              ? item.data.featured_image
              : fallbackItemImage

            return (
              <li key={item.id} className="flex">
                <Card className="flex w-full flex-col overflow-hidden">
                  <Link href={href} tabIndex={-1} aria-hidden>
                    <div className="aspect-video w-full overflow-hidden">
                      <PrismicNextImage
                        field={image}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardHeader className="gap-2">
                    {status && (
                      <Badge
                        variant={status === 'Active' ? 'default' : 'secondary'}
                        className="w-fit"
                      >
                        {status}
                      </Badge>
                    )}
                    <CardTitle>
                      <Link href={href} className="hover:underline">
                        {asText(item.data.title)}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <PrismicRichText field={item.data.excerpt} />
                    {dateRange && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {dateRange}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link
                        href={href}
                        aria-label={
                          asText(item.data.title) || 'View this fundraiser'
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

export default FundraiserList
