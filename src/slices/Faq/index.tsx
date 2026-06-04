import { Content, asText, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import Heading from '@/components/typography/Heading'
import { cn } from '@/lib/utils'
import React from 'react'

/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>

/**
 * Component for "Faq" Slices.
 */
const Faq = ({ slice }: FaqProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="md"
      className="py-8 lg:py-0 lg:pb-16"
    >
      <div className="flex justify-center">
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
      </div>
      {isFilled.group(slice.primary.questions) && (
        <Accordion
          type={slice.primary.type || 'multiple'}
          collapsible={slice.primary.collapsible}
          className={cn('my-6 rounded-lg bg-secondary px-4 lg:my-12', {
            'border-2 border-chart-3': slice.primary.border,
          })}
        >
          {slice.primary.questions.map((item, index) => (
            <AccordionItem
              key={slice.id + index}
              value={asText(item.question)}
              className={cn('', {
                'border-b': slice.primary.border,
                'border-none': !slice.primary.border,
              })}
            >
              <AccordionTrigger className="hover:cursor-pointer">
                {isFilled.richText(item.question) ? (
                  <PrismicRichText
                    field={item.question}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="prose pr-4 text-left font-semibold lg:prose-lg xl:prose-xl dark:prose-invert">
                          {children}
                        </p>
                      ),
                    }}
                  />
                ) : (
                  <p>Question Missing in CMS</p>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {isFilled.richText(item.answer) ? (
                  <PrismicRichText
                    field={item.answer}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="my-1.5 prose lg:my-3 lg:prose-lg dark:prose-invert">
                          {children}
                        </p>
                      ),
                    }}
                  />
                ) : (
                  <p>Missing Answer in CMS</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Section>
  )
}

export default Faq
