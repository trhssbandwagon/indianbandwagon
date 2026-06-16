import { cn } from '@/lib/utils'
import { MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { isFilled, KeyTextField, LinkField } from '@prismicio/client'
import { PrismicNextLink } from '@prismicio/next'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'

type MobileMenuProps = {
  className?: string
  site_title: KeyTextField
  navigation: LinkField[]
  cta_link: LinkField
}

const MobileMenu = ({
  navigation,
  className,
  site_title,
  cta_link,
}: MobileMenuProps) => {
  return (
    <div className={cn('text-primary-foreground md:hidden', className)}>
      <Sheet>
        <SheetTrigger className={cn(buttonVariants({ variant: 'default' }))}>
          <MenuIcon />
          <span className="sr-only">Open Menu</span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            {isFilled.keyText(site_title) && (
              <SheetTitle className="font-bold text-primary">
                {site_title}
              </SheetTitle>
            )}
            <div className="flex justify-center pt-6">
              <div className="text-center">
                <p className="pb-6 text-primary-foreground">
                  Change Light/Dark Mode
                </p>
                <ThemeToggle />
              </div>
            </div>
          </SheetHeader>
          <ul className="grid gap-y-4 px-4">
            <li>
              <SheetClose className="flex justify-center" asChild>
                <Button asChild>
                  <Link href={'/donate'}>Donate</Link>
                </Button>
              </SheetClose>
            </li>
            {isFilled.link(cta_link) && (
              <li>
                <SheetClose className="flex justify-center" asChild>
                  <Button asChild>
                    <PrismicNextLink field={cta_link}>
                      {cta_link.text}
                    </PrismicNextLink>
                  </Button>
                </SheetClose>
              </li>
            )}
            {navigation.map((item, i) => {
              return (
                <li key={item.text ? item.text + i : i}>
                  <SheetClose asChild>
                    <Button asChild variant={'outline'} className="flex">
                      <PrismicNextLink field={item}>
                        {item.text}
                      </PrismicNextLink>
                    </Button>
                  </SheetClose>
                </li>
              )
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileMenu
