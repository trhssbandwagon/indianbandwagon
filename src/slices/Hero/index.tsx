import Heading from '@/components/typography/Heading'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Content, ImageField, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'
import { formatEventDateTime } from '@/lib/utils'

/**
 * Component for "Hero" Slices.
 */

type HeroSliceContext = {
  event?: {
    startDate: string | null
    endDate: string | null
    format: 'in_person' | 'virtual' | 'hybrid'
    venueName: string | null
    city: string | null
    state: string | null
  }
  logo?: ImageField
}

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice, HeroSliceContext>

const Hero = ({ slice, context }: HeroProps): React.JSX.Element => {
  if (slice.variation === 'eventHero') {
    const event = context?.event
    const logo = isFilled.image(slice.primary.logo_override)
      ? slice.primary.logo_override
      : context?.logo
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="dark:text-primary-foreground-dark relative flex items-center px-4 py-8 text-primary-foreground md:px-12 md:py-16"
      >
        {isFilled.image(slice.primary.image) && (
          <PrismicNextImage
            field={slice.primary.image}
            fallbackAlt=""
            fill
            sizes="100vw"
            className="z-[-2] object-cover"
            loading="eager"
            fetchPriority="high"
          />
        )}
        <div className="dark:bg-primary-dark/80 mx-auto my-8 flex w-(--breakpoint-sm) flex-col items-center justify-center rounded-lg bg-primary/80 p-6 text-center backdrop-blur md:w-(--breakpoint-md) lg:w-(--breakpoint-lg) lg:p-12 xl:w-(--breakpoint-xl)">
          {isFilled.image(logo) && (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-background p-2 shadow-sm md:h-48 md:w-48">
              <PrismicNextImage
                field={logo}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          )}
          {isFilled.keyText(slice.primary.eyebrow) && (
            <p
              className="dark:text-primary-foreground-dark text-2xl font-medium text-primary-foreground md:text-4xl"
              style={{ fontFamily: 'var(--font-flourish)' }}
            >
              {slice.primary.eyebrow}
            </p>
          )}
          {isFilled.richText(slice.primary.heading) && (
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <Heading
                    as="h1"
                    size="7xl"
                    className="dark:text-primary-foreground-dark text-primary-foreground"
                  >
                    {children}
                  </Heading>
                ),
              }}
            />
          )}
          {event?.startDate && (
            <p className="dark:text-primary-foreground-dark mt-3 text-sm text-primary-foreground md:text-lg">
              {formatEventDateTime(event.startDate)}
            </p>
          )}
          {event && (
            <p className="dark:text-primary-foreground-dark/80 text-sm text-primary-foreground/80 md:text-base">
              {event.format === 'virtual'
                ? 'Virtual event'
                : [
                    event.venueName,
                    event.city && event.state
                      ? `${event.city}, ${event.state}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
            </p>
          )}
          {slice.primary.button_link.length > 0 && (
            <div className="flex justify-center gap-6">
              {slice.primary.button_link.map((item, index) => {
                const variant = item.variant || 'default'
                const isDefault = variant === 'default'
                return (
                  <Button
                    key={slice.id + slice.slice_type + index}
                    variant={isDefault ? undefined : variant}
                    size="lg"
                    className="mt-4 lg:mt-8"
                    style={
                      isDefault
                        ? {
                            backgroundColor: 'var(--primary-foreground)',
                            color: 'var(--primary)',
                          }
                        : undefined
                    }
                    asChild
                  >
                    <PrismicNextLink field={item}>
                      {item.text || 'Add a Button Label'}
                    </PrismicNextLink>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </section>
    )
  }
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        'relative flex items-center px-4 py-8 text-primary-foreground md:px-12 md:py-16 lg:py-6',
        {
          'bg-primary': slice.variation === 'default',
          'lg:h-[calc(100vh-64px)] lg:min-h-187.5':
            slice.variation === 'withImage',
        },
      )}
    >
      {slice.variation !== 'default' && isFilled.image(slice.primary.image) && (
        <PrismicNextImage
          field={slice.primary.image}
          fallbackAlt=""
          fill
          sizes="100vw"
          className="z-[-2] object-cover"
          loading="eager"
          fetchPriority="high"
        />
      )}
      <div
        className={cn(
          'mx-auto my-8 flex w-(--breakpoint-sm) flex-col items-center justify-center rounded-lg p-6 backdrop-blur md:w-(--breakpoint-md) lg:w-(--breakpoint-lg) lg:p-12 xl:w-(--breakpoint-xl)',
          {
            'bg-primary/80 dark:bg-red-950/80': slice.variation !== 'default',
          },
        )}
      >
        {isFilled.richText(slice.primary.heading) && (
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <Heading
                  as="h2"
                  size="6xl"
                  className="text-primary-foreground dark:text-primary-foreground"
                >
                  {children}
                </Heading>
              ),
            }}
          />
        )}
        {isFilled.richText(slice.primary.description) && (
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => (
                <p className="my-3 max-w-prose text-sm text-primary-foreground md:text-lg lg:text-xl">
                  {children}
                </p>
              ),
            }}
          />
        )}
        {slice.primary.button_link.length > 0 && (
          <div className="flex justify-center gap-6">
            {slice.primary.button_link.map((item, index) => {
              return (
                <Button
                  key={slice.id + slice.slice_type + index}
                  variant={item.variant || 'default'}
                  size="lg"
                  className={cn('mt-4 lg:mt-8', {
                    'bg-primary': item.variant === 'outline',
                    'text-primary-foreground': item.variant === 'link',
                  })}
                  asChild
                >
                  <PrismicNextLink field={item}>
                    {item.text || 'Add a Button Label'}
                  </PrismicNextLink>
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
