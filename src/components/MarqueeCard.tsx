'use client'

import { ColorField, Content, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { Info } from 'lucide-react'
import React from 'react'

import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type MarqueeCardProps = {
  item: Content.CarouselSliceWithDetailsPrimaryItemsItem
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ColorHaze = ({ color }: { color?: ColorField }) => (
  <div
    aria-hidden="true"
    className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-2xl dark:opacity-25"
    style={{ backgroundColor: color ?? 'transparent' }}
  />
)

// ─── Main component ───────────────────────────────────────────────────────────

const MarqueeCard = ({ item }: MarqueeCardProps) => {
  const descriptionId = `marquee-desc-${item.name?.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="p-1">
      <Card className="relative aspect-square h-full">
        <CardContent className="flex h-full flex-col items-center justify-between gap-4 p-6">
          <ColorHaze color={item.color} />

          {/* Info Dialog */}
          {isFilled.richText(item.description) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-3 right-3 z-20 h-11 w-11 cursor-pointer"
                  aria-label={`More information about ${item.name}`}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent
                className="h-full overflow-y-auto backdrop-blur-md sm:h-auto sm:max-h-[80vh] sm:max-w-lg md:max-w-4xl lg:max-w-6xl dark:bg-secondary/90"
                aria-describedby={descriptionId}
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl">{item.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div
                    id={descriptionId}
                    className="prose prose-lg dark:prose-invert"
                  >
                    <PrismicRichText field={item.description} />

                    {isFilled.link(item.link) && (
                      <div className="border-t border-primary/30 pt-4">
                        <Button asChild variant="link">
                          <PrismicNextLink
                            field={item.link}
                            aria-label={`Learn more about ${item.name}`}
                            className="dark:text-destructive"
                          >
                            {item.link.text || `Learn more about ${item.name}`}
                          </PrismicNextLink>
                        </Button>
                      </div>
                    )}
                  </div>

                  {isFilled.image(item.logo) && (
                    <PrismicNextImage
                      field={item.logo}
                      className="mx-auto aspect-square h-auto max-h-32 w-auto rounded-lg md:max-h-64"
                      width={256}
                      height={256}
                      imgixParams={{ ar: '1:1', fit: 'crop' }}
                      sizes="(min-width: 768px) 256px, 128px"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Main Card Content */}
          <div className="relative z-10 flex grow flex-col items-center justify-center gap-4 py-6 text-center">
            {isFilled.image(item.logo) ? (
              <PrismicNextImage
                field={item.logo}
                className="h-28 w-auto lg:h-24"
                imgixParams={{ ar: '1:1', fit: 'crop' }}
                sizes="(min-width: 1024px) 96px, 112px"
              />
            ) : (
              <div className="h-16 w-auto" />
            )}
            <span className="text-xl font-semibold lg:text-lg">
              {item.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

MarqueeCard.displayName = 'MarqueeCard'

export default MarqueeCard
