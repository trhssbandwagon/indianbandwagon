import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { Quote } from 'lucide-react'
import React from 'react'

/**
 * Props for `Testimonial`.
 */
export type TestimonialProps = SliceComponentProps<Content.TestimonialSlice>

/**
 * Component for "Testimonial" Slices.
 */
const Testimonial = ({ slice }: TestimonialProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      as="blockquote"
    >
      <div className="mx-auto my-8 flex max-w-(--breakpoint-md) flex-col items-center justify-center">
        <Quote width={55} height={55} />
        <PrismicRichText
          field={slice.primary.quote}
          components={{
            paragraph: ({ children }) => (
              <p className="my-3 text-2xl font-light lg:my-6 lg:text-3xl">
                {children}
              </p>
            ),
          }}
        />

        <PrismicRichText
          field={slice.primary.name}
          components={{
            paragraph: ({ children }) => (
              <footer className="text-sm font-bold uppercase">
                {children}
              </footer>
            ),
          }}
        />
      </div>
    </Section>
  )
}

export default Testimonial
