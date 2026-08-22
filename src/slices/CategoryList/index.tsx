import Section from '@/components/layout/Section'
import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'

/**
 * Props for `CategoryList`.
 */
export type CategoryListProps = SliceComponentProps<Content.CategoryListSlice>

/**
 * Component for "CategoryList" Slices.
 */

const CategoryList = ({ slice }: CategoryListProps): React.JSX.Element => {
  const items = slice.primary.categories.filter(item =>
    isFilled.keyText(item.category),
  )

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-accent px-4 py-10 text-center text-accent-foreground md:px-6 md:py-14 dark:bg-accent-dark dark:text-accent-foreground-dark"
    >
      {isFilled.keyText(slice.primary.eyebrow) && (
        <p
          className="text-xl text-accent-foreground/80 md:text-3xl dark:text-accent-foreground-dark"
          style={{ fontFamily: 'var(--font-flourish)' }}
        >
          {slice.primary.eyebrow}
        </p>
      )}
      {items.length > 0 && (
        <p className="mt-2 text-2xl font-semibold text-accent-foreground md:text-4xl lg:text-5xl dark:text-accent-foreground-dark">
          {items.map((item, index) => (
            <React.Fragment key={slice.id + '-category-' + index}>
              {index > 0 && (
                <span className="mx-3 text-accent-foreground/40 dark:text-accent-foreground-dark/80">
                  •
                </span>
              )}
              {item.category}
            </React.Fragment>
          ))}
        </p>
      )}
    </Section>
  )
}

export default CategoryList
