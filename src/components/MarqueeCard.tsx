'use client'

import { Content, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { Info } from 'lucide-react'

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

const MarqueeCard = ({ item }: MarqueeCardProps) => {
  return (
    <div className="p-1">
      <Card className="relative h-full">
        <CardContent className="flex h-full flex-col items-center justify-between gap-4 p-6">
          {/* Haze Effect */}
          <div
            className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-2xl dark:opacity-25"
            style={{ backgroundColor: item.color || 'transparent' }}
          />

          {/* Info Dialog Trigger */}
          {isFilled.richText(item.description) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-20 h-11 w-11 cursor-pointer"
                  aria-label={`More information about ${item.name}`}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="h-full overflow-y-auto backdrop-blur-md sm:h-auto sm:max-h-[80vh] sm:max-w-lg md:max-w-4xl lg:max-w-6xl dark:bg-secondary/90"
                aria-describedby=""
              >
                <DialogHeader>
                  <DialogTitle className="text-3xl">{item.name}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                  <div className="prose prose-lg dark:prose-invert">
                    <PrismicRichText field={item.description} />
                    {isFilled.link(item.link) && (
                      <div className="border-t border-primary/30 pt-4">
                        <Button asChild variant={'link'}>
                          <PrismicNextLink
                            field={item.link}
                            aria-label={`Learn More about ${item.name}`}
                            className="dark:text-sidebar-primary"
                          >
                            {item.link.text
                              ? item.link.text
                              : `Learn More About ${item.name}`}
                          </PrismicNextLink>
                        </Button>
                      </div>
                    )}
                  </div>
                  {isFilled.image(item.logo) && (
                    <PrismicNextImage
                      field={item.logo}
                      className="mx-auto hidden aspect-square h-auto max-h-64 w-auto rounded-lg md:block"
                      width={256}
                      height={256}
                      imgixParams={{ ar: '1:1', fit: 'crop' }}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Main Card Content */}
          <div className="relative z-10 flex flex-col items-center gap-4 py-6 text-center">
            {isFilled.image(item.logo) ? (
              <PrismicNextImage
                field={item.logo}
                className="h-16 w-auto"
                imgixParams={{ ar: '1:1', fit: 'crop' }}
              />
            ) : (
              <div className="h-16 w-auto" />
            )}
            <span className="text-md font-semibold">{item.name}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarqueeCard
