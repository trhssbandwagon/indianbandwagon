import Section from '@/components/layout/Section'
import Heading from '@/components/typography/Heading'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Content, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice, index }: HeroProps): React.JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn(
        'relative flex items-center px-4 py-8 text-primary-foreground md:px-12 md:py-16 lg:py-6',
        {
          'bg-primary': slice.variation === 'default',
          'lg:h-[calc(100vh-64px)] lg:min-h-187.5':
            slice.variation !== 'contentHeight',
        },
      )}
    >
      {slice.variation !== 'default' && isFilled.image(slice.primary.image) && (
        <PrismicNextImage
          field={slice.primary.image}
          fallbackAlt=""
          fill
          sizes="(min-width: 1340px) 100vw, (min-width: 1040px) calc(69.29vw + 405px), (min-width: 400px) calc(96.61vw + 35px), 488px"
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
                <Heading as="h2" size="6xl" className="text-primary-foreground">
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
