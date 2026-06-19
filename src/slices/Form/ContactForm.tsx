'use client'
declare global {
  interface Window {
    grecaptcha: any
  }
}
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const textareaClass = cn(
  'w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs',
  'transition-[color,box-shadow] outline-none placeholder:text-muted-foreground resize-y min-h-[160px]',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  'aria-[invalid]:border-destructive aria-[invalid]:ring-destructive/20 dark:aria-[invalid]:ring-destructive/40',
)

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
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const [success, setSuccess] = React.useState<boolean | null>(null)
  const [formInteraction, setFormInteraction] = React.useState(false)
  const handleFocus = () => {
    !formInteraction && setFormInteraction(true)
  }

  React.useEffect(() => {
    if (formInteraction) {
      const recaptchaScript = document.createElement('script')
      recaptchaScript.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
      recaptchaScript.async = true
      recaptchaScript.defer = true
      document.head.appendChild(recaptchaScript)
      return () => {
        const scripts = document.head.querySelectorAll('script')
        for (var i = 0; i < scripts.length; i++) {
          if (
            scripts?.item(i)?.attributes.getNamedItem('src') &&
            scripts
              ?.item(i)
              ?.attributes?.getNamedItem('src')
              ?.value.includes('recaptcha/releases')
          ) {
            document.head.removeChild(scripts.item(i))
          }
        }
        document.head.removeChild(recaptchaScript)
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
        <p className="text-xl font-medium text-primary">
          Thank you for getting in touch. We will contact you soon!
        </p>
      )}
      {success !== true && (
        <form
          className="mx-auto my-12 flex max-w-screen-sm flex-col gap-y-6"
          onSubmit={handleSubmit((values) => {
            window.grecaptcha.enterprise.ready(() => {
              window.grecaptcha.enterprise
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
                  action: 'submit',
                })
                .then(async (recaptchaToken: string) => {
                  const formData = new FormData()
                  formData.set('name', values.name)
                  formData.set('email', values.email)
                  formData.set('phone', values.phone ?? '')
                  formData.set('message', values.message)
                  formData.set('token', recaptchaToken)
                  const { message } = await sendMessage(formData)
                  if (message === 200) {
                    reset()
                    setSuccess(true)
                  }
                })
            })
          })}
        >
          <div className="flex flex-col gap-1.5">
            <Label
              id="contact-name"
              htmlFor="name"
              className="lg:text-lg xl:text-xl"
            >
              {name_label || 'Name'}
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Your name is required.' })}
              type="text"
              placeholder={name_placeholder || 'Enter your name here'}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'name-error' : '#contact-name'}
              onFocus={handleFocus}
              className="lg:text-lg xl:text-xl"
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              id="contact-email"
              className="lg:text-lg xl:text-xl"
            >
              {email_label || 'Email Address'}
            </Label>
            <Input
              id="email"
              {...register('email', {
                required: 'Your email address is required.',
              })}
              type="email"
              placeholder={email_placeholder || 'Enter your email here'}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : '#contact-email'}
              onFocus={handleFocus}
              className="lg:text-lg xl:text-xl"
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="phone"
              id="contact-phone"
              className="lg:text-lg xl:text-xl"
            >
              {phone_label || 'Phone Number'}
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              type="tel"
              placeholder={phone_placeholder || 'Enter your phone number here'}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'phone-error' : '#contact-phone'}
              onFocus={handleFocus}
              className="lg:text-lg xl:text-xl"
            />
            {errors.phone && (
              <p
                id="phone-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="message"
              id="contact-message"
              className="lg:text-lg xl:text-xl"
            >
              {message_label || 'Message'}
            </Label>
            <textarea
              id="message"
              rows={8}
              placeholder={
                message_placeholder || 'Craft your message to us here...'
              }
              className={cn(textareaClass, 'lg:text-lg xl:text-xl')}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? 'message-error' : '#contact-message'
              }
              onFocus={handleFocus}
              {...register('message', {
                required:
                  'Your message is required so we know how we can help.',
              })}
            />
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          <input
            type="text"
            name="hp_field"
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            className="absolute top-0 -left-2499.75 h-0 w-0 overflow-hidden opacity-0"
          />

          <div className="flex flex-col items-center lg:items-start">
            <SubmitButton text={button_text} variant={button_style} />
            <p className="mt-3 text-sm text-muted-foreground [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
              This site is protected by reCAPTCHA and the{' '}
              <a
                href="https://policies.google.com/privacy"
                className="dark:text-destructive"
              >
                Google Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                className="dark:text-destructive"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>
          </div>
        </form>
      )}
    </>
  )
}

export default ContactForm
