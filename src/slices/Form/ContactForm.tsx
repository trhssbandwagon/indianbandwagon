'use client'
declare global {
  interface Window {
    grecaptcha: any
  }
}
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { sendMessage } from '@/app/actions'
import { FormSlice } from '../../../prismicio-types'
import { KeyTextField } from '@prismicio/client'
import { cn } from '@/lib/utils'

type FormValues = {
  email: string
  name: string
  phone: string
  message: string
  token?: string
}

const ContactForm = (data: FormSlice): React.JSX.Element => {
  const {
    primary: {
      name_label,
      name_placeholder,
      email_label,
      email_placeholder,
      phone_label,
      phone_placeholder,
      message_label,
      message_placeholder,
      button_text,
      button_style,
    },
  } = data

  const {
    register,
    trigger,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>()

  const [success, setSuccess] = React.useState<boolean | null>(null)
  const [formInteraction, setFormInteraction] = React.useState(false)
  const handleFocus = () => {
    !formInteraction && setFormInteraction(true)
  }

  React.useEffect(() => {
    if (formInteraction) {
      const recaptchaScript = document.createElement('script')
      recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
      recaptchaScript.async = true
      recaptchaScript.defer = true
      document.head.appendChild(recaptchaScript)
      return () => {
        // Get all script tags: returns HTMLcollection
        const scripts = document.head.querySelectorAll('script')
        // Loop through the HTMLcollection (array-like but not array)
        for (var i = 0; i < scripts.length; i++) {
          // find script whose src value includes "recaptcha/releases"
          // this script is added when main recaptcha script is loaded

          if (
            scripts?.item(i)?.attributes.getNamedItem('src') &&
            scripts
              ?.item(i)
              ?.attributes?.getNamedItem('src')
              ?.value.includes('recaptcha/releases')
          ) {
            document.head.removeChild(scripts.item(i)) // remove script from head
          }
        }
        document.head.removeChild(recaptchaScript) // remove main recaptcha script from head
        // remove the recaptcha badge from the bottom right corner
        let badge = document.querySelector('.grecaptcha-badge')
        if (badge?.parentElement) {
          badge.parentElement.remove()
        }
      }
    }
  }, [formInteraction])

  type SubmitButtonProps = {
    text?: KeyTextField
    variant?:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'destructive'
      | 'ghost'
      | 'link'
  }
  function SubmitButton({
    text = 'Submit',
    variant = 'default',
  }: SubmitButtonProps): React.JSX.Element {
    return (
      <Button
        disabled={isSubmitting}
        type="submit"
        aria-disabled={isSubmitting}
        variant={variant}
      >
        {text}
      </Button>
    )
  }

  return (
    <>
      {success === true && (
        <p className="text-color-primary text-xl">
          Thank you for getting in touch. We will contact you soon!
        </p>
      )}
      {success !== true && (
        <form
          className="mx-auto my-12 flex max-w-screen-sm flex-col gap-y-4"
          action={async (formData: FormData) => {
            trigger()
            if (!isValid) return
            // calling server action passed into the client component here (if the form is valid)
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
                  action: 'submit',
                })
                .then(async (recaptchaToken: string) => {
                  formData.set('token', recaptchaToken)
                  const { message } = await sendMessage(formData)
                  if (message === 200) {
                    reset()
                    setSuccess(true)
                  }
                })
            })
          }}
        >
          <div
            className={cn('grid gap-y-6', {
              'gap-y-14': errors.email || errors.name,
            })}
          >
            <div className="relative">
              {errors?.name && (
                <p className="absolute -top-10 text-destructive">
                  &darr; {errors?.name?.message}
                </p>
              )}
              <label htmlFor={'name'}>
                <span className="sr-only">
                  {name_label || 'What is your name?'}
                </span>
                <input
                  id="name"
                  {...register('name', {
                    required: 'Your name is required.',
                  })}
                  type="text"
                  placeholder={name_placeholder || 'Enter your name here'}
                  className="w-full rounded focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  onFocus={handleFocus}
                />
              </label>
            </div>
            <div className="relative">
              {errors?.email && (
                <p className="absolute -top-10 text-destructive">
                  {' '}
                  &darr; {errors?.email?.message}
                </p>
              )}
              <label htmlFor={'email'}>
                <span className="sr-only">
                  {email_label || 'What is your email address?'}
                </span>
                <input
                  id="email"
                  {...register('email', {
                    required: 'Your email address is required.',
                  })}
                  type="email"
                  placeholder={email_placeholder || 'Enter your email here'}
                  className={`w-full rounded focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none`}
                  onFocus={handleFocus}
                />
              </label>
            </div>
            <div className="relative">
              {errors?.phone && (
                <p className="absolute -top-10 text-destructive">
                  {' '}
                  &darr; {errors?.phone?.message}
                </p>
              )}
              <label htmlFor={'phone'}>
                <span className="sr-only">
                  {phone_label || 'What is your phone number?'}
                </span>
                <input
                  id="phone"
                  {...register('phone', {
                    required: 'Your phone number is required.',
                  })}
                  type="tel"
                  placeholder={
                    phone_placeholder || 'Enter your phone number here'
                  }
                  className={`w-full rounded focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none`}
                  onFocus={handleFocus}
                />
              </label>
            </div>
            <div className="relative">
              {errors?.message && (
                <p className="absolute -top-10 text-destructive">
                  {' '}
                  &darr; {errors?.message?.message}
                </p>
              )}
              <label htmlFor="message">
                <span className="sr-only">
                  {message_label || `Compose your message to us below:`}
                </span>
                <textarea
                  // name='message'
                  id="message"
                  cols={30}
                  rows={10}
                  placeholder={
                    message_placeholder || `Craft your message to us here...`
                  }
                  className={`w-full rounded focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none`}
                  onFocus={handleFocus}
                  {...register('message', {
                    required:
                      'Your message is required so we know how we can help.',
                  })}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <SubmitButton text={button_text} variant={button_style} />
            <p className="prose-a:text-primary-content prose prose-sm mt-3 prose-a:no-underline hover:prose-a:underline">
              This site is protected by reCAPTCHA and the{' '}
              <a href="https://policies.google.com/privacy">
                Google Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms">Terms of Service</a>{' '}
              apply.
            </p>
          </div>
        </form>
      )}
    </>
  )
}

export default ContactForm
