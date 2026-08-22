import {
  Playfair_Display,
  Dancing_Script,
  Cormorant_Garamond,
  Great_Vibes,
} from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
})

export const flourishFontVariables = [
  playfairDisplay.variable,
  dancingScript.variable,
  cormorantGaramond.variable,
  greatVibes.variable,
].join(' ')

export const FLOURISH_FONT_CSS_VAR: Record<string, string> = {
  playfair: 'var(--font-playfair)',
  dancing_script: 'var(--font-dancing-script)',
  cormorant: 'var(--font-cormorant)',
  great_vibes: 'var(--font-great-vibes)',
}

export const DEFAULT_FLOURISH_FONT = 'playfair'
