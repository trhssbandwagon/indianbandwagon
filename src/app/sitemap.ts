import { createClient } from '@/prismicio'
import { asDate } from '@prismicio/client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient()

  // 1. Fetch all data in parallel to save time
  const [settings, homepage, pages, posts] = await Promise.all([
    client.getSingle('settings'),
    client.getSingle('homepage'),
    client.getAllByType('page'),
    client.getAllByType('post'),
  ])

  const baseUrl = `https://${settings.data.domain || 'example.com'}`

  // 2. Helper function to format Prismic documents for the sitemap
  const formatEntry = (doc: any) => {
    const baseUrl = `https://${settings.data.domain || 'example.com'}`

    // Logic to determine frequency based on custom type
    let frequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
    let priority = 0.7

    if (doc.type === 'homepage') {
      frequency = 'daily'
      priority = 1.0
    } else if (doc.type === 'post') {
      frequency = 'weekly'
      priority = 0.8
    } else if (doc.type === 'page') {
      frequency = 'monthly'
      priority = 0.5
    }

    return {
      url: `${baseUrl}${doc.url}`,
      lastModified: asDate(doc.last_publication_date) ?? new Date(),
      changeFrequency: frequency,
      priority: priority,
    }
  }

  // 3. Map and flatten your results
  // Filter out any entries where the URL couldn't be resolved
  return [
    homepage ? formatEntry(homepage) : null,
    ...pages.map(formatEntry),
    ...posts.map(formatEntry),
  ].filter(
    (entry): entry is NonNullable<typeof entry> =>
      entry !== null && !!entry.url,
  )
}
