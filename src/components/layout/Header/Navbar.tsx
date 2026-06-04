'use client'
import { cn } from '@/lib/utils'
import {
  ImageField,
  isFilled,
  KeyTextField,
  LinkField,
} from '@prismicio/client'
import Section from '../Section'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { Button } from '@/components/ui/button'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'

type NavbarProps = {
  navigation: LinkField[]
  cta_link: LinkField
  logo: ImageField
  site_title: KeyTextField
}

const Navbar = ({ logo, navigation, cta_link, site_title }: NavbarProps) => {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', latest => {
    const previous = scrollY.getPrevious()
    if (previous && latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/70',
      )}
    >
      <Section
        width="xl"
        padded={false}
        className="px-2 py-1 md:px-3 md:py-2 lg:py-3"
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            {isFilled.image(logo) ? (
              <PrismicNextImage
                field={logo}
                imgixParams={{ ar: '1:1', fit: 'crop' }}
                height={60}
                width={60}
              />
            ) : (
              <p className="p-1.5 font-bold text-primary dark:text-destructive">
                {site_title}
              </p>
            )}
          </Link>
          <div className="flex items-center gap-x-4 lg:gap-x-8">
            {navigation.length > 0 && (
              <>
                <DesktopMenu navigation={navigation} />
                <MobileMenu
                  site_title={site_title}
                  navigation={navigation}
                  cta_link={cta_link}
                />
              </>
            )}

            {isFilled.link(cta_link) && (
              <Button
                asChild
                variant={
                  (cta_link.variant as
                    | 'default'
                    | 'outline'
                    | 'secondary'
                    | 'ghost'
                    | 'destructive'
                    | 'link') || 'default'
                }
                className="hidden md:inline-flex"
              >
                <PrismicNextLink field={cta_link}>
                  {cta_link.text}
                </PrismicNextLink>
              </Button>
            )}
            <span className="hidden lg:inline">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </Section>
    </motion.header>
  )
}

export default Navbar
