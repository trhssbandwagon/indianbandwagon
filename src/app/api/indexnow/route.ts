import { createClient } from '@/prismicio'
import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'
const PRISMIC_WEBHOOK_SECRET = process.env.PRISMIC_WEBHOOK_SECRET
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, '')
const DOMAIN = new URL(SITE_URL).hostname

const client = createClient()

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read body once — secret may live in the body or a header
  let requestBody: Record<string, unknown>
  try {
    requestBody = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  // 2. Verify secret (Prismic sends it as a header OR inside the body)
  const incomingSecret =
    req.headers.get('x-prismic-secret') ||
    req.headers.get('secret') ||
    (requestBody?.secret as string | undefined)

  if (PRISMIC_WEBHOOK_SECRET && incomingSecret !== PRISMIC_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: 'Invalid Prismic Webhook Secret' },
      { status: 401 },
    )
  }

  // 3. Prismic sends document IDs (strings) in the webhook payload
  const documentIds = requestBody.documents as string[] | undefined
  if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
    return NextResponse.json(
      { message: 'No documents to process' },
      { status: 200 },
    )
  }

  // 4. Resolve each document ID to a URL via the Prismic client.
  //    getByID uses your linkResolver automatically and returns null for
  //    unpublished documents, so no manual route mapping is needed.
  const urlsToSubmit: string[] = []

  for (const docId of documentIds) {
    try {
      const document = await client.getByID(docId)

      if (!document?.url) {
        // No URL means the document is unpublished or not routable — skip it
        console.log(
          `[IndexNow] Doc ${docId} has no URL (unpublished?), skipping`,
        )
        continue
      }

      urlsToSubmit.push(`${SITE_URL}${document.url}`)
    } catch (error) {
      console.error(`[IndexNow] Error fetching doc ${docId}:`, error)
    }
  }

  if (urlsToSubmit.length === 0) {
    return NextResponse.json(
      { message: 'No relevant URLs to submit to IndexNow' },
      { status: 200 },
    )
  }

  // 5. Submit to IndexNow in a single batch request
  try {
    const indexNowPayload = {
      host: DOMAIN,
      key: INDEXNOW_API_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_API_KEY}.txt`,
      urlList: urlsToSubmit,
    }

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload),
    })

    if (response.ok) {
      console.log(
        `[IndexNow] Submitted ${urlsToSubmit.length} URL(s):`,
        urlsToSubmit,
      )
      return NextResponse.json(
        {
          message: 'IndexNow URLs submitted successfully',
          submitted: urlsToSubmit,
        },
        { status: 200 },
      )
    } else {
      const detail = await response.text()
      console.error('[IndexNow] Submission failed:', response.status, detail)
      return NextResponse.json(
        { message: 'IndexNow submission failed', detail },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error('[IndexNow] Error submitting to IndexNow:', error)
    return NextResponse.json(
      { message: 'Error submitting to IndexNow' },
      { status: 500 },
    )
  }
}
