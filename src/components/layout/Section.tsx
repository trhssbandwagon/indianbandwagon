import React from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  as?: React.ElementType
  className?: string
  padded?: boolean
  children: React.ReactNode
  width?: 'full' | '2xl' | 'xl' | 'lg' | 'md'
}

export default function Section({
  as: Comp = 'section',
  width = 'full',
  className,
  children,
  padded = true,
  ...restProps
}: SectionProps) {
  return (
    <Comp
      className={cn(
        'flex items-center',
        {
          'px-4 py-2 md:px-6 md:py-4 lg:py-6': padded,
        },
        className,
      )}
      {...restProps}
    >
      <div
        className={cn('mx-auto w-full', {
          'w-full': width === 'full',
          'max-w-(--breakpoint-2xl)': width === '2xl',
          'max-w-(--breakpoint-xl)': width === 'xl',
          'max-w-(--breakpoint-lg)': width === 'lg',
          'max-w-(--breakpoint-md)': width === 'md',
        })}
      >
        {children}
      </div>
    </Comp>
  )
}
