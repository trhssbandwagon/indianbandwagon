import { createClient } from '@/prismicio'
import {
  ContentRelationshipField,
  DateField,
  ImageField,
  isFilled,
  KeyTextField,
  LinkField,
  RichTextField,
} from '@prismicio/client'
import { PrismicNextImage } from '@prismicio/next'
import Pagination from '@/components/layout/Pagination'
import { PrismicRichText } from '@/components/typography/PrismicRichText'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { BookOpen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { BoardPositionDocumentData } from '../../../prismicio-types'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface BoardMemberLink {
  data: {
    name: KeyTextField
    portrait: ImageField
    position: ContentRelationshipField
    link: LinkField
  }
}

interface BoardMemberGroupItem {
  member: BoardMemberLink | { link_type: string }
  position: BoardMemberLink
}

interface BoardItem {
  id: string
  url: string | null | undefined
  data: {
    start: DateField
    end: DateField
    members: Array<BoardMemberGroupItem>
    title: RichTextField
  }
}

type BoardListProps = {
  page: number | undefined
  display: number | undefined
}

const BoardList = async ({
  display = 5,
  page = 1,
}: BoardListProps): Promise<React.JSX.Element> => {
  const client = createClient()
  const prismicData = await client.getByType('executive_board', {
    orderings: {
      field: 'document.start',
      direction: 'desc',
    },
    page,
    pageSize: display,
  })

  const results = prismicData.results as unknown as BoardItem[]

  return (
    <>
      {results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-40" />
          <p className="text-lg font-medium">No boards yet</p>
          <p className="text-sm">
            Check back soon — new content is on the way.
          </p>
        </div>
      )}
      <ul className="w-full">
        {results.length > 0 &&
          results.map((item, index) => {
            return (
              <li key={item.id} className="p-4">
                <Card
                  className={cn(
                    'w-full bg-background transition-shadow duration-300 ease-in-out hover:shadow-primary',
                    {
                      'bg-muted': index === 0,
                    },
                  )}
                >
                  <CardHeader className="mx-auto prose prose-headings:text-center">
                    <PrismicRichText field={item.data.title} />
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {item.data.members &&
                      item.data.members.map((groupItem, i) => {
                        const member = groupItem.member as BoardMemberLink
                        if (!member?.data) return null
                        const position = groupItem.position
                          .data as unknown as BoardPositionDocumentData
                        return (
                          <div key={i} className="flex">
                            <div className="flex grow items-center justify-center gap-2 rounded-md border border-muted px-4 py-2 transition-colors duration-300 ease-in-out hover:border-primary">
                              <Avatar size="lg">
                                <AvatarImage
                                  src={member.data?.portrait?.url || undefined}
                                  alt={member.data.portrait.alt || ''}
                                />
                                <AvatarFallback>
                                  {member.data.name}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col lg:grow">
                                {isFilled.link(member.data.link) ? (
                                  <Button
                                    asChild
                                    variant="link"
                                    className="dark:text-destructive"
                                  >
                                    <a href={member.data.link.url}>
                                      {member.data.name}
                                    </a>
                                  </Button>
                                ) : (
                                  <p>{member.data.name}</p>
                                )}
                                <p className="pt-2 text-xs">{position.title}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              </li>
            )
          })}
      </ul>
      {prismicData.total_pages > 1 && (
        <Pagination
          hasNextPage={prismicData.next_page !== null}
          hasPrevPage={prismicData.prev_page !== null}
          totalPages={prismicData.total_pages}
        />
      )}
    </>
  )
}

export default BoardList
