import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { getPublicEvents } from '@/lib/utils'
import Section from '@/components/layout/Section'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import {
  Carousel as UiCarousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'

/**
 * Props for `Events`.
 */
export type EventsProps = SliceComponentProps<Content.EventsSlice>

/**
 * Component for "Events" Slices (Handles both Carousel and Grid Variations).
 */
const Events = async ({ slice }: EventsProps) => {
  const daysAhead = slice.primary.days_ahead ?? undefined
  const events = await getPublicEvents(daysAhead)

  // Determine if we should render the grid layout based on your Prismic variation ID
  const isGridLayout = slice.variation === 'eventsGrid'

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="xl"
    >
      {/* Shared Heading & Description Block */}
      <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <div className="mx-auto prose lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert">
          {isFilled.richText(slice.primary.heading) && (
            <PrismicRichText field={slice.primary.heading} />
          )}
          {isFilled.richText(slice.primary.description) && (
            <PrismicRichText field={slice.primary.description} />
          )}
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <Card className="border-dashed bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <p className="text-sm text-muted-foreground italic">
              No events scheduled at the moment.
            </p>
          </CardContent>
        </Card>
      ) : isGridLayout ? (
        /* ================= VARIANT B: GRID/LIST LAYOUT ================= */
        <div className="grid w-full gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.map(event => {
            const eventDate = new Date(
              event.start.dateTime || event.start.date || '',
            )
            const mapsUrl = event.location
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
              : null

            return (
              <Card
                key={event.id}
                className="flex h-full flex-col justify-between shadow-sm transition-all hover:border-primary/50"
              >
                <div>
                  <CardHeader className="space-y-1">
                    <div className="text-2xl font-semibold text-primary uppercase dark:text-destructive">
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'America/New_York',
                      })}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg font-bold tracking-tight">
                      {event.summary}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      {eventDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/New_York',
                      })}
                      {event.location && ` • 📍 ${event.location}`}
                    </CardDescription>
                  </CardHeader>

                  {event.description && (
                    <CardContent>
                      <p className="line-clamp-3 rounded-md border border-border/40 bg-muted/20 p-3 text-sm text-muted-foreground dark:text-chart-1">
                        {event.description}
                      </p>
                    </CardContent>
                  )}
                </div>

                <CardFooter className="p-5 pt-0">
                  {mapsUrl ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg text-xs font-medium"
                    >
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions
                      </a>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      size="sm"
                      className="w-full rounded-lg text-xs font-medium opacity-40"
                    >
                      No Location Set
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        /* ================= VARIANT A: DEFAULT CAROUSEL LAYOUT ================= */
        <div className="relative w-full px-4 md:px-14">
          <UiCarousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {events.map(event => {
                const eventDate = new Date(
                  event.start.dateTime || event.start.date || '',
                )
                const mapsUrl = event.location
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
                  : null

                return (
                  <CarouselItem
                    key={event.id}
                    className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="h-full p-1">
                      <Card className="flex h-full flex-col justify-between shadow-sm transition-all hover:border-primary/50">
                        <div>
                          <CardHeader className="space-y-1">
                            <div className="text-2xl font-semibold text-primary uppercase dark:text-destructive">
                              {eventDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <CardTitle className="line-clamp-2 text-lg font-bold tracking-tight">
                              {event.summary}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-muted-foreground">
                              {eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'America/New_York',
                              })}
                              {event.location && ` • 📍 ${event.location}`}
                            </CardDescription>
                          </CardHeader>

                          {event.description && (
                            <CardContent>
                              <p className="line-clamp-3 rounded-md border border-border/40 bg-muted/20 p-3 text-sm text-muted-foreground dark:text-chart-1">
                                {event.description}
                              </p>
                            </CardContent>
                          )}
                        </div>

                        <CardFooter className="p-5 pt-0">
                          {mapsUrl ? (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full rounded-lg text-xs font-medium"
                            >
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Get Directions
                              </a>
                            </Button>
                          ) : (
                            <Button
                              disabled
                              variant="outline"
                              size="sm"
                              className="w-full rounded-lg text-xs font-medium opacity-40"
                            >
                              No Location Set
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <CarouselPrevious className="-left-12 hidden md:inline-flex" />
            <CarouselNext className="-right-12 hidden md:inline-flex" />
          </UiCarousel>
          <p className="py-4 text-center text-xs md:hidden">
            Swipe left to see more events.
          </p>
        </div>
      )}
    </Section>
  )
}

export default Events
