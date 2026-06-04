'use client'
import Section from '@/components/layout/Section'
import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import {
  Carousel as UiCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import { PrismicNextImage } from '@prismicio/next'
import React from 'react'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import MarqueeCard from '@/components/MarqueeCard'
import Heading from '@/components/typography/Heading'
/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): React.JSX.Element => {
  if (slice.variation === 'withDetails') {
    const { heading, items } = slice.primary
    const plugin = React.useRef(
      Autoplay({ delay: 2500, stopOnInteraction: true }),
    )
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="container mx-auto max-w-5xl px-6 py-8 sm:py-10 md:py-12"
      >
        <div className="pb-8">
          <PrismicRichText
            field={heading}
            components={{
              heading2: ({ children }) => (
                <Heading
                  as="h2"
                  size="5xl"
                  className="text-center lg:text-center dark:text-foreground"
                >
                  {children}
                </Heading>
              ),
              heading3: ({ children }) => (
                <Heading
                  as="h3"
                  size="3xl"
                  className="text-center lg:text-center dark:text-foreground"
                >
                  {children}
                </Heading>
              ),
            }}
          />
        </div>

        <UiCarousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <MarqueeCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </UiCarousel>
      </section>
    )
  } else {
    return (
      <Section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="bg-muted"
      >
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center justify-center rounded-lg py-4 lg:py-8">
          <div className="mb-4 lg:mb-8">
            {isFilled.keyText(slice.primary.title) && (
              <Heading as="h2" size="5xl" className="dark:text-foreground">
                {slice.primary.title}
              </Heading>
            )}
          </div>
          <UiCarousel
            opts={{ loop: true }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full max-w-60 md:max-w-screen-sm lg:max-w-(--breakpoint-md)"
          >
            <CarouselContent>
              {slice.items.length > 0 && (
                <>
                  {slice.items.map((item, index) => {
                    return (
                      <CarouselItem
                        key={slice.id + index}
                        className="p-2 md:basis-1/3 lg:basis-1/4"
                      >
                        <div className="">
                          <Card className="p-0">
                            <CardContent className="relative flex aspect-square flex-col items-center justify-center">
                              <PrismicNextImage
                                field={item.image}
                                imgixParams={{ ar: '1:1', fit: 'crop' }}
                                fill
                                sizes="(min-width: 1040px) 178px, (min-width: 780px) 201px, 238px"
                                className="rounded-lg object-cover"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    )
                  })}
                </>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </UiCarousel>
        </div>
      </Section>
    )
  }
}

export default Carousel
