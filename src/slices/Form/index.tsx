import Section from '@/components/layout/Section'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { cn } from '@/lib/utils'
import { Content } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import ContactForm from './ContactForm'
import React from 'react'

/**
 * Props for `Form`.
 */
export type FormProps = SliceComponentProps<Content.FormSlice>

/**
 * Component for "Form" Slices.
 */
const Form = ({ slice }: FormProps): React.JSX.Element => {
  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="xl"
    >
      <div className={cn('mx-auto prose lg:prose-lg xl:prose-xl')}>
        <PrismicRichText field={slice.primary.title} />
        <PrismicRichText field={slice.primary.description} />
      </div>
      <ContactForm {...slice} />
    </Section>
  )
}

export default Form
