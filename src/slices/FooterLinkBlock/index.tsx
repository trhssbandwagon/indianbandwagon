import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Content } from '@prismicio/client'
import { PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `FooterLinkBlock`.
 */
export type FooterLinkBlockProps =
  SliceComponentProps<Content.FooterLinkBlockSlice>

/**
 * Component for "FooterLinkBlock" Slices.
 */
const FooterLinkBlock = ({
  slice,
}: FooterLinkBlockProps): React.JSX.Element => {
  return (
    <Card
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mb-4 bg-primary text-primary-foreground last:mb-0"
    >
      <CardHeader className="ml-4 font-bold">
        {slice.primary.block_title}
      </CardHeader>
      <CardContent>
        {slice.items.length > 0 &&
          slice.items.map((item, i) => {
            return (
              <Button
                asChild
                variant={'link'}
                key={slice.id + i}
                className="text-primary-foreground"
              >
                <PrismicNextLink field={item.link}>
                  {item.label}
                </PrismicNextLink>
              </Button>
            )
          })}
      </CardContent>
    </Card>
  )
}

export default FooterLinkBlock
