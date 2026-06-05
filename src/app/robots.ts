import { MetadataRoute } from 'next'
import { createClient } from '@/prismicio'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const client = createClient()
  const settings = await client.getSingle('settings')
  const baseUrl = `https://${settings.data?.domain || 'www.trhssbandwagon.org'}`

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/slice-simulator'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
