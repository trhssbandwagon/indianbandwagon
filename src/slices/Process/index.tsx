import Section from '@/components/layout/Section'
import Heading from '@/components/typography/Heading'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Content, isFilled } from '@prismicio/client'
import { PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'
import { AiOutlineMessage } from 'react-icons/ai'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'

/**
 * Props for `Process`.
 */
export type ProcessProps = SliceComponentProps<Content.ProcessSlice>

/**
 * Component for "Process" Slices.
 */
const Process = ({ slice }: ProcessProps): React.JSX.Element => {
  const icons = {
    message: AiOutlineMessage,
    call: FaPhoneAlt,
    people: FaPeopleGroup,
  }
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="xl"
      className={cn('py-8', {})}
    >
      <div className="mx-auto my-8 flex max-w-screen-2xl flex-col items-center justify-center">
        {isFilled.keyText(slice.primary.title) && (
          <p className="text-sm font-medium uppercase">{slice.primary.title}</p>
        )}
        {isFilled.richText(slice.primary.heading) && (
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <Heading
                  as="h2"
                  size="5xl"
                  className={cn(
                    'py-4 lg:py-8 lg:text-center dark:text-foreground',
                  )}
                >
                  {children}
                </Heading>
              ),
            }}
          />
        )}
        {isFilled.richText(slice.primary.description) && (
          <div className={cn('mx-auto max-w-prose', {})}>
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => (
                  <p className="prose mb-8 lg:prose-lg dark:prose-invert">
                    {children}
                  </p>
                ),
              }}
            />
          </div>
        )}
        {slice.items.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-evenly gap-12 lg:mt-0 lg:gap-4">
            {slice.items.map((item, index) => {
              if (isFilled.richText(item.description)) {
                let Icon: React.ElementType | null = null
                if (item.icon && icons[item.icon]) {
                  Icon = icons[item.icon] as React.ElementType
                }
                return (
                  <Card
                    key={slice.id + index}
                    className={cn('flex max-w-sm flex-col justify-start')}
                  >
                    <CardHeader>
                      {Icon ? (
                        <Icon className="inline-flex h-24 w-24 self-center" />
                      ) : (
                        <p className="text-center text-[6rem] font-black">
                          {index + 1}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {isFilled.keyText(item.step_title) && (
                        <p className="my-1.5 text-center text-sm font-bold uppercase lg:my-3">
                          {item.step_title}
                        </p>
                      )}
                      {isFilled.richText(item.description) && (
                        <PrismicRichText
                          field={item.description}
                          components={{
                            paragraph: ({ children }) => (
                              <p className="prose mb-8 dark:prose-invert">
                                {children}
                              </p>
                            ),
                          }}
                        />
                      )}
                    </CardContent>
                    {isFilled.link(item.button_link) && (
                      <CardFooter className="mt-auto flex justify-center">
                        <Button
                          variant={'default'}
                          asChild
                          className="mt-4 lg:mt-8"
                        >
                          <PrismicNextLink field={item.button_link}>
                            {item.button_label || 'Missing Label'}
                          </PrismicNextLink>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )
              } else {
                return null
              }
            })}
          </div>
        )}
      </div>
    </Section>
  )
}

export default Process
