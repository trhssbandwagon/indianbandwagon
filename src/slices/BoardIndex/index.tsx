import BoardList from '@/components/layout/BoardList'
import Section from '@/components/layout/Section'
import { Content, isFilled } from '@prismicio/client'
import { SliceComponentProps } from '@prismicio/react'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Suspense } from 'react'

/**
 * Props for `ContentIndex`.
 */
export type BoardIndexProps = SliceComponentProps<Content.BoardIndexSlice>
type contextProps = {
  page?: number
}
/**
 * Component for "ContentIndex" Slices.
 */
const BoardIndex = ({ slice, context }: BoardIndexProps): React.JSX.Element => {
  const { page } = context as contextProps

  return (
    <Section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      width="lg"
    >
      <Suspense
        fallback={
          <div className="grid min-h-[calc(100vh-64px)] place-content-center">
            <LoaderCircle
              className="animate-spin text-primary"
              height={120}
              width={120}
            />
          </div>
        }
      >
        <BoardList
          display={slice.primary.number || undefined}
          page={page || undefined}
        />
      </Suspense>
    </Section>
  )
}

export default BoardIndex
