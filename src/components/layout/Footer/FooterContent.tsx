import { cn } from '@/lib/utils'
import {
  LayoutDocumentData,
  SettingsDocumentData,
} from '../../../../prismicio-types'
import Section from '../Section'
import { SliceZone } from '@prismicio/react'
import { components } from '@/slices'
// import Copyright from './Copyright'
import { PrismicNextLink } from '@prismicio/next'
import { CopyrightIcon } from 'lucide-react'
import Copyright from './Copyright'
import React from 'react'
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaGoogle,
} from 'react-icons/fa6'
import { isFilled } from '@prismicio/client'
import { Button } from '@/components/ui/button'
import { PrismicRichText } from '@/components/typography/PrismicRichText'

type FooterContentProps = {
  data: LayoutDocumentData
  settings: SettingsDocumentData
}
const FooterContent = ({
  data,
  settings,
}: FooterContentProps): React.JSX.Element => {
  const { privacy_link, copyright, social_media } = data
  return (
    <Section as="footer" className="bg-primary text-primary-foreground">
      <SliceZone components={components} slices={data.slices1} />
      {isFilled.group(social_media) && (
        <div className="flex justify-center gap-4 py-6">
          {social_media.map((platform, i) => {
            if (platform.platform === 'LinkedIn') {
              return (
                <Button asChild key={`platform-${platform.platform}-${i}`}>
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaLinkedinIn className="size-10" />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            } else if (platform.platform === 'Facebook') {
              return (
                <Button
                  asChild
                  key={`platform-${platform.platform}-${i}`}
                  size="icon"
                  variant={platform.link.variant}
                >
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaFacebookF />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            } else if (platform.platform === 'Instagram') {
              return (
                <Button
                  asChild
                  key={`platform-${platform.platform}-${i}`}
                  variant={platform.link.variant}
                  size="icon"
                >
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaInstagram />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            } else if (platform.platform === 'TikTok') {
              return (
                <Button
                  asChild
                  key={`platform-${platform.platform}-${i}`}
                  variant={platform.link.variant}
                  size="icon"
                >
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaTiktok />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            } else if (platform.platform === 'Google') {
              return (
                <Button
                  asChild
                  key={`platform-${platform.platform}-${i}`}
                  variant={platform.link.variant}
                  size="icon"
                >
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaGoogle />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            } else {
              return (
                <Button
                  asChild
                  key={`platform-${platform.platform}-${i}`}
                  variant={platform.link.variant}
                  size="icon"
                >
                  <PrismicNextLink
                    field={platform.link}
                    title={platform.link.text}
                    aria-label={platform.link.text}
                  >
                    <FaYoutube />
                    {platform.link.text && (
                      <span className="sr-only">{platform.link.text}</span>
                    )}
                  </PrismicNextLink>
                </Button>
              )
            }
          })}
        </div>
      )}
      <div className="mx-auto prose prose-sm text-primary-foreground">
        <PrismicRichText field={data.nonprofit_statement} />
      </div>
      <div className="my-4 text-center lg:my-4">
        <PrismicNextLink field={privacy_link}>
          {privacy_link.text ? privacy_link.text : 'Missing Privacy Link Text'}
        </PrismicNextLink>
      </div>
      <div className="text-center text-xs lg:text-sm">
        {copyright} <CopyrightIcon className="inline w-3 pb-1" /> <Copyright />{' '}
        {settings.site_title}
      </div>
      <div className="mx-auto prose prose-sm p-6 text-center text-primary-foreground">
        <p>
          {`P.O. Box ${settings.legal_po_box} `}
          <br />
          {`${settings.locality}, NJ ${settings.legal_postal_code}`}
        </p>
      </div>
    </Section>
  )
}

export default FooterContent
