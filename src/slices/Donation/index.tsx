import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import DonationForm from './DonationForm'

const Donation = ({ slice }: SliceComponentProps<Content.DontationSlice>) => (
  <Section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    width="xl"
  >
    {slice.primary.heading && (
      <div className="mx-auto prose py-6 lg:prose-lg lg:py-12 xl:prose-xl">
        <PrismicRichText field={slice.primary.heading} />
      </div>
    )}
    {slice.primary.description && (
      <div className="mx-auto prose pb-6 lg:prose-lg lg:pb-12 xl:prose-xl dark:prose-invert">
        <PrismicRichText field={slice.primary.description} />
      </div>
    )}
    <DonationForm />
  </Section>
)

export default Donation
