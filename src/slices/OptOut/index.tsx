import { FC } from 'react'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import Section from '@/components/layout/Section'
import PrivacyManager from '@/components/PrivacyManager'
/**
 * Props for `OptOut`.
 */
export type OptOutProps = SliceComponentProps<Content.OptOutSlice>

/**
 * Component for "OptOut" Slices.
 */
const OptOut: FC<OptOutProps> = ({ slice }) => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="xl"
    >
      <div className="mx-auto max-w-xs">
        <PrivacyManager />
      </div>
    </Section>
  )
}

export default OptOut
