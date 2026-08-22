import Section from '@/components/layout/Section'
import { Content, isFilled } from '@prismicio/client'
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next'
import { SliceComponentProps } from '@prismicio/react'
import React from 'react'
/**
 * Props for `PricingTier`.
 */
export type PricingTierProps = SliceComponentProps<Content.PricingTierSlice>
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})
/**
 * Component for "PricingTier" Slices.
 */
const PricingTier = ({ slice }: PricingTierProps): React.JSX.Element => {
  const tiers = slice.primary.tiers.filter(tier => isFilled.number(tier.price))
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-(--breakpoint-lg) px-4 py-10 md:px-6 md:py-14"
    >
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {tiers.map((tier, index) => (
          <div
            key={slice.id + '-tier-' + index}
            className={
              tier.featured
                ? 'group relative rounded-lg border-2 border-primary bg-primary-foreground p-6 text-center transition-shadow dark:border-primary-dark dark:bg-primary-foreground-dark'
                : 'group relative rounded-lg border border-secondary/30 bg-primary-foreground p-6 text-center transition-shadow dark:border-secondary-dark/30 dark:bg-primary-foreground-dark'
            }
          >
            {isFilled.image(tier.icon) && (
              <div className="mx-auto -mt-14 mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-background p-2 shadow-sm md:-mt-16 md:h-20 md:w-20">
                <PrismicNextImage
                  field={tier.icon}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}

            <p className="text-3xl font-semibold text-primary md:text-4xl dark:text-primary-dark">
              {currencyFormatter.format(tier.price!)}
            </p>
            {isFilled.keyText(tier.label) && (
              <p className="mt-1 text-sm font-medium text-secondary uppercase dark:text-secondary-dark">
                {tier.label}
              </p>
            )}
            {isFilled.keyText(tier.description) && (
              <p className="mt-3 text-base text-secondary/70 dark:text-secondary-dark">
                {tier.description}
              </p>
            )}
            {isFilled.link(tier.link) && (
              <PrismicNextLink
                field={tier.link}
                aria-label={`${currencyFormatter.format(tier.price!)}${
                  isFilled.keyText(tier.label) ? ` – ${tier.label}` : ''
                }`}
                className="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            )}

            {isFilled.link(tier.link) && (
              <div className="pointer-events-none absolute inset-0 rounded-lg shadow-primary/60 transition-shadow duration-300 ease-in-out group-hover:shadow-lg dark:shadow-secondary-dark/50" />
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
export default PricingTier
