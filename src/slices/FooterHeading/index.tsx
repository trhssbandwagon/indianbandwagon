import Section from '@/components/layout/Section'
import Heading from '@/components/typography/Heading'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `FooterHeading`.
 */
export type FooterHeadingProps = SliceComponentProps<Content.FooterHeadingSlice>

/**
 * Component for "FooterHeading" Slices.
 */
const FooterHeading = ({ slice }: FooterHeadingProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {isFilled.richText(slice.primary.heading) && (
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading2: ({ children }) => (
              <Heading
                as="h2"
                size="5xl"
                className="text-primary-foreground lg:text-center"
              >
                {children}
              </Heading>
            ),
          }}
        />
      )}
    </Section>
  )
}

export default FooterHeading
