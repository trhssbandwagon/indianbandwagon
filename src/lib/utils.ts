import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
