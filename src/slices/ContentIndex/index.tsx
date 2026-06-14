import ContentList from '@/components/layout/ContentList'
import FundraiserList from '@/components/layout/FundraiserList'
import Section from '@/components/layout/Section'
import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Suspense } from 'react'

/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>
type contextProps = {
  page?: number
}
/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = ({
  slice,
  context,
}: ContentIndexProps): React.JSX.Element => {
  const { page } = context as contextProps
  const isFundraiser = slice.primary.content_type === 'fundraiser'
  const ctaText = isFilled.keyText(slice.primary.content_cta_text)
    ? slice.primary.content_cta_text
    : undefined

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="lg"
    >
      <Suspense
        fallback={
          <div className="grid min-h-[calc(100vh-64px)] place-content-center">
            <LoaderCircle
              className="animate-spin text-primary"
              height={120}
              width={120}
            />
          </div>
        }
      >
        {isFundraiser ? (
          <FundraiserList
            display={slice.primary.number_to_display || undefined}
            page={page || undefined}
            ctaText={ctaText}
            fallbackItemImage={slice.primary.fallback_item_image}
          />
        ) : (
          <ContentList
            contentType={slice.primary.content_type}
            display={slice.primary.number_to_display || undefined}
            page={page || undefined}
            ctaText={ctaText}
            fallbackItemImage={slice.primary.fallback_item_image}
          />
        )}
      </Suspense>
    </Section>
  )
}

export default ContentIndex
