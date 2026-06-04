import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { cn } from '@/lib/utils'
import { Content } from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `ImageWithText`.
 */
export type ImageWithTextProps = SliceComponentProps<Content.ImageWithTextSlice>

/**
 * Component for "ImageWithText" Slices.
 */
const ImageWithText = ({ slice }: ImageWithTextProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-(--breakpoint-xl) py-6 lg:pt-12 lg:pb-24"
    >
      <div className={cn('grid lg:grid-cols-5')}>
        <div
          className={cn(
            'prose rounded-lg bg-primary-foreground/80 p-4 shadow-md backdrop-blur lg:prose-lg lg:p-8 xl:prose-xl 2xl:prose-2xl dark:bg-secondary/80 dark:prose-invert',
            {
              'order-2 -mt-4 lg:col-span-3 lg:mt-0 lg:mb-0 lg:-ml-4':
                slice.variation === 'default',
              'order-1 -mb-4 lg:col-span-3 lg:-mr-4 lg:mb-0':
                slice.variation === 'rightImage',
            },
          )}
        >
          <PrismicRichText field={slice.primary.text} />
        </div>
        <div
          className={cn('flex items-center lg:col-span-3', {
            'order-2 lg:col-span-2 lg:-ml-8': slice.variation === 'rightImage',
            'order-1 lg:col-span-2 lg:-mr-4': slice.variation === 'default',
          })}
        >
          <PrismicNextImage
            field={slice.primary.image}
            className="rounded-md shadow"
            imgixParams={{
              ar: '4:3',
              fit: 'crop',
            }}
          />
        </div>
      </div>
    </Section>
  )
}

export default ImageWithText
