// components/Breadcrumbs.tsx
import Link from 'next/link'
import { PrismicDocument, asText, isFilled } from '@prismicio/client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbsProps {
  currentPage: PrismicDocument
  path: string[]
}

export function Breadcrumbs({ currentPage, path }: BreadcrumbsProps) {
  if (!path || path.length === 0) return null

  const formatFallbackLabel = (slug: string) =>
    slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {path.map((segment, index) => {
          const isLast = index === path.length - 1
          const href = `/${path.slice(0, index + 1).join('/')}`

          let label = formatFallbackLabel(segment)

          if (isLast) {
            label = asText(currentPage.data.title) || label
          } else if (index === path.length - 2) {
            // 👇 Explicitly type guard the parent field reference before checking its properties
            const parentField = currentPage.data.parent

            if (
              isFilled.contentRelationship(parentField) &&
              parentField.data?.title
            ) {
              label = asText(parentField.data.title) || label
            }
          }

          return (
            <div key={href} className="flex items-center gap-2">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
