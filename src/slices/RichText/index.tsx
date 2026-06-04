import { PrismicRichText } from '@/components/typography/PrismicRichText'
import Section from '@/components/layout/Section'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { cn } from '@/lib/utils'
import React from 'react'

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>

/**
 * Component for "RichText" Slices.
 */
const RichText = ({ slice }: RichTextProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="md"
      className={cn('py-6 md:py-8 lg:py-12', {
        'bg-secondary': slice.variation === 'secondary',
      })}
    >
      <div className="prose lg:prose-lg xl:prose-xl 2xl:prose-2xl dark:prose-invert">
        <PrismicRichText field={slice.primary.rich_text} />
      </div>
    </Section>
  )
}

export default RichText
