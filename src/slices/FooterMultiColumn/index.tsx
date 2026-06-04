import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps, SliceZone } from '@prismicio/react'
import {
  FooterMultiColumnDocument,
  FooterMultiColumnSliceDefaultPrimary,
} from '../../../prismicio-types'
import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import Heading from '@/components/typography/Heading'
import { components } from '@/slices'
import { cn } from '@/lib/utils'

/**
 * Props for `FooterMultiColumn`.
 */
export type FooterMultiColumnProps =
  SliceComponentProps<Content.FooterMultiColumnSlice>

/**
 * Component for "FooterMultiColumn" Slices.
 */
const FooterMultiColumn = ({
  slice,
}: FooterMultiColumnProps): React.JSX.Element => {
  const primary = slice.primary as FooterMultiColumnSliceDefaultPrimary
  const multiColumn = primary.layout as unknown as FooterMultiColumnDocument
  const cols =
    (multiColumn.data?.slices.length > 0 ? 1 : 0) +
    (multiColumn.data?.slices1.length > 0 ? 1 : 0) +
    (multiColumn.data?.slices2.length > 0 ? 1 : 0)
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-6 lg:py-12"
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
      {cols > 0 && (
        <div
          className={cn('my-4 grid gap-y-4 lg:my-8 lg:gap-x-8', {
            'lg:grid-cols-2': cols === 2,
            'lg:grid-cols-3': cols === 3,
          })}
        >
          {multiColumn.data.slices.length > 0 && (
            <div>
              <SliceZone
                slices={multiColumn.data.slices}
                components={components}
              />
            </div>
          )}
          {multiColumn.data.slices1.length > 0 && (
            <div>
              <SliceZone
                slices={multiColumn.data.slices1}
                components={components}
              />
            </div>
          )}
          {multiColumn.data.slices2.length > 0 && (
            <div>
              <SliceZone
                slices={multiColumn.data.slices2}
                components={components}
              />
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

export default FooterMultiColumn
