import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Color from 'colorjs.io'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- Google Calendar Utilities ---

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export async function getPublicEvents(
  daysAhead?: number,
): Promise<CalendarEvent[]> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY

  if (!calendarId || !apiKey) {
    console.error('Missing Google Calendar environment variables.')
    return []
  }

  const now = new Date()
  const timeMin = now.toISOString()
  const maxResults = daysAhead && daysAhead > 0 ? 100 : 10

  let url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId,
  )}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`

  if (daysAhead && daysAhead > 0) {
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + daysAhead)
    url += `&timeMax=${maxDate.toISOString()}`
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache data on the server for 1 hour
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch calendar data: ${res.statusText}`)
    }

    const data = await res.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error)
    return []
  }
}

const MIN_RING_CONTRAST = 3 // WCAG 2.4.11 Focus Appearance (Minimum), Level AA
const MAX_LIGHTNESS_STEPS = 20

function contrastRatio(colorA: string, colorB: string): number {
  return new Color(colorA).contrast(new Color(colorB), 'WCAG21')
}

function computeAccessibleRing(
  baseColor: string,
  backgroundColor: string,
): string {
  const base = new Color(baseColor)
  const bg = new Color(backgroundColor)

  if (contrastRatio(baseColor, backgroundColor) >= MIN_RING_CONTRAST) {
    return base.toString({ format: 'hex' })
  }

  const startLightness = base.get('oklch.l')
  const chroma = base.get('oklch.c')
  const hue = base.get('oklch.h')
  const bgLightness = bg.get('oklch.l')

  const bgIsLighter = bgLightness > startLightness
  const step = bgIsLighter ? -0.03 : 0.03
  let lightness = startLightness

  for (let i = 0; i < MAX_LIGHTNESS_STEPS; i++) {
    lightness = Math.min(1, Math.max(0, lightness + step))
    const candidate = new Color('oklch', [lightness, chroma, hue])
    if (
      contrastRatio(candidate.toString(), backgroundColor) >= MIN_RING_CONTRAST
    ) {
      return candidate.toString({ format: 'hex' })
    }
  }

  return contrastRatio('#000000', backgroundColor) >
    contrastRatio('#ffffff', backgroundColor)
    ? '#000000'
    : '#ffffff'
}

export function resolveRingColor({
  primaryColor,
  backgroundColor,
  ringOverride,
}: {
  primaryColor: string
  backgroundColor: string
  ringOverride?: string | null
}): string {
  if (ringOverride) {
    const overrideContrast = contrastRatio(ringOverride, backgroundColor)
    if (overrideContrast >= MIN_RING_CONTRAST) return ringOverride
    console.warn(
      `[theme] ring_color override "${ringOverride}" only has ${overrideContrast.toFixed(2)}:1 contrast (needs ${MIN_RING_CONTRAST}:1). Falling back to a computed ring color.`,
    )
  }
  return computeAccessibleRing(primaryColor, backgroundColor)
}

const EVENT_TIME_ZONE = 'America/New_York'

function formatInEventZone(
  iso: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat('en-US', {
    ...options,
    timeZone: EVENT_TIME_ZONE,
  }).format(new Date(iso))
}

export function formatEventDate(iso: string): string {
  return formatInEventZone(iso, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatEventDateTime(iso: string): string {
  return formatInEventZone(iso, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
