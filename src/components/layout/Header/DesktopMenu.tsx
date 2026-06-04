import { PrismicNextLink } from '@prismicio/next'
import { cn } from '@/lib/utils'
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button'
import { LinkField } from '@prismicio/client'

type DesktopMenuProps = {
  navigation: LinkField[]
}
const DesktopMenu = ({ navigation }: DesktopMenuProps) => {
  return (
    <nav className="hidden md:block">
      <ul className="flex gap-x-3">
        {navigation.map((item, i) => {
          return (
            <li key={item.text ? item.text + i : i}>
              <Button
                asChild
                variant={item.variant as ButtonProps['variant']}
                className={cn({
                  'dark:text-foreground': item.variant === 'link',
                  'text-black': item.variant === 'destructive',
                })}
              >
                <PrismicNextLink field={item}>{item.text}</PrismicNextLink>
              </Button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DesktopMenu
