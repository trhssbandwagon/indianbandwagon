import Section from '@/components/layout/Section'
import Heading from '@/components/typography/Heading'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Content, asText, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `Features`.
 */
export type FeaturesProps = SliceComponentProps<Content.FeaturesSlice>

/**
 * Component for "Features" Slices.
 */
const Features = ({ slice }: FeaturesProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="xl"
      className={cn('py-8 lg:pb-24', {
        'bg-secondary': slice.variation === 'secondary',
        'bg-primary': slice.variation === 'primary',
      })}
    >
      {isFilled.richText(slice.primary.heading) && (
        <div className="flex justify-center">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <Heading
                  as="h3"
                  size="5xl"
                  className={cn('dark:text-foreground', {
                    'text-background': slice.variation === 'primary',
                  })}
                >
                  {children}
                </Heading>
              ),
            }}
          />
        </div>
      )}
      {isFilled.richText(slice.primary.description) && (
        <div
          className={cn(
            'mx-auto max-w-prose py-6 lg:prose-lg lg:py-10 xl:prose-xl 2xl:prose-2xl',
            {
              'text-primary-foreground': slice.variation === 'primary',
            },
          )}
        >
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-evenly gap-12 lg:mt-0 lg:gap-4">
        {slice.primary.features.length > 0 &&
          slice.primary.features.map((item, index) => {
            if (isFilled.richText(item.feature_heading)) {
              return (
                <Card
                  key={slice.id + index}
                  className={cn('w-87.5', {
                    'bg-muted': slice.variation === 'default',
                    'bg-primary text-primary-foreground':
                      slice.variation === 'primary',
                    'bg-chart-4': slice.variation === 'secondary',
                  })}
                >
                  <CardHeader className="items-center">
                    <PrismicRichText
                      field={item.feature_heading}
                      components={{
                        heading3: ({ children }) => (
                          <Heading
                            as="h3"
                            size="3xl"
                            className={cn(
                              'lg:text-center dark:text-foreground',
                              {
                                'text-primary-foreground':
                                  slice.variation === 'primary',
                                'text-background':
                                  slice.variation === 'secondary',
                              },
                            )}
                          >
                            {children}
                          </Heading>
                        ),
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    {isFilled.richText(item.feature_description) && (
                      <PrismicRichText
                        field={item.feature_description}
                        components={{
                          paragraph: ({ children }) => (
                            <p
                              className={cn(
                                'prose mb-8 text-foreground dark:text-white',
                                {
                                  'text-white':
                                    slice.variation === 'primary' ||
                                    'secondary',
                                  'text-foreground':
                                    slice.variation === 'default',
                                },
                              )}
                            >
                              {children}
                            </p>
                          ),
                        }}
                      />
                    )}

                    {isFilled.link(item.button_link) && (
                      <CardFooter className="flex justify-center">
                        <Button
                          variant={item.button_link.variant || 'default'}
                          asChild
                          className="mt-4 lg:mt-8"
                        >
                          <PrismicNextLink field={item.button_link}>
                            {item.button_link.text || 'Missing Label'}
                            <span className="sr-only">
                              About {asText(item.feature_heading)}
                            </span>
                          </PrismicNextLink>
                        </Button>
                      </CardFooter>
                    )}
                  </CardContent>
                </Card>
              )
            } else return null
          })}
      </div>
    </Section>
  )
}

export default Features
