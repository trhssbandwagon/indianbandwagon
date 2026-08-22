import Section from '@/components/layout/Section'
import Heading from '@/components/typography/Heading'
import { Button } from '@/components/ui/button'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Content, isFilled, LinkField } from '@prismicio/client'
import { PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

type EventDetailsSliceContext = {
  event?: {
    format: 'in_person' | 'virtual' | 'hybrid'
    venueName: string | null
    streetAddress: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    virtualLink: LinkField | null
  }
}

export type EventDetailsProps = SliceComponentProps<
  Content.EventDetailsSlice,
  EventDetailsSliceContext
>

function buildMapsUrl(parts: (string | null)[]) {
  const address = parts.filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

const EventDetails = ({
  slice,
  context,
}: EventDetailsProps): React.JSX.Element => {
  const event = context?.event
  const heading = isFilled.keyText(slice.primary.heading)
    ? slice.primary.heading
    : 'Location'

  const showPhysical = event && event.format !== 'virtual' && event.venueName
  const showVirtual =
    event && event.format !== 'in_person' && isFilled.link(event.virtualLink)

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-(--breakpoint-lg) px-4 py-10 text-center md:px-6 md:py-14"
    >
      <Heading
        as="h2"
        size="6xl"
        className="text-primary lg:text-center dark:text-primary-dark"
      >
        {heading}
      </Heading>

      {showPhysical && (
        <div className="mt-4">
          <p className="text-3xl font-medium text-foreground">
            {event.venueName}
          </p>
          <p className="text-muted-foreground">
            {[
              event.streetAddress,
              event.city && event.state
                ? `${event.city}, ${event.state}`
                : null,
              event.zipCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a
              href={buildMapsUrl([
                event.venueName,
                event.streetAddress,
                event.city,
                event.state,
                event.zipCode,
              ])}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          </Button>
        </div>
      )}

      {showVirtual && (
        <div className="mt-4">
          <Button
            asChild
            style={{
              backgroundColor: 'var(--primary-foreground)',
              color: 'var(--primary)',
            }}
          >
            <PrismicNextLink field={event.virtualLink}>
              Join Online
            </PrismicNextLink>
          </Button>
        </div>
      )}

      {isFilled.richText(slice.primary.contact_prompt) && (
        <div className="mt-8 text-sm text-muted-foreground">
          <PrismicRichText
            field={slice.primary.contact_prompt}
            components={{
              paragraph: ({ children }) => <p>{children}</p>,
              hyperlink: ({ children, node }) => (
                <PrismicNextLink
                  field={node.data}
                  className="text-primary underline dark:text-primary-dark"
                >
                  {children}
                </PrismicNextLink>
              ),
            }}
          />
        </div>
      )}
    </Section>
  )
}

export default EventDetails
