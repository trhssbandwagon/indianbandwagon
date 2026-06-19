'use server'
import axios, { AxiosError } from 'axios'
import { Resend } from 'resend'

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const recaptchaValidation = async (token: string) => {
  const result = await (async () => {
    try {
      const response = await axios({
        url: `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
        method: 'POST',
        data: {
          event: {
            token,
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            expectedAction: 'submit',
          },
        },
      })
      const { tokenProperties, riskAnalysis } = response.data
      if (!tokenProperties.valid || tokenProperties.action !== 'submit') {
        return { successful: false, message: 'Invalid reCAPTCHA token.' }
      }
      return { successful: true, message: Number(riskAnalysis.score) }
    } catch (err: unknown) {
      const error = err as AxiosError
      let message
      if (error.response) {
        message = `reCAPTCHA server responded with non 2xx code: ${error.response.data}`
      } else if (error.request) {
        message = `No reCAPTCHA response received: ${error.request}`
      } else {
        message = `Error setting up reCAPTCHA response: ${error.message}`
      }
      return { successful: false, message }
    }
  })()
  return result
}

export async function sendMessage(formData: FormData) {
  // Honeypot — bots fill hidden fields, humans never see it
  if (formData.get('hp_field')) {
    return { message: 200 }
  }

  const token = `${formData.get('token')}`
  const recaptchaResult = await recaptchaValidation(token)
  const captchaScore = Number(recaptchaResult.message)

  if (!recaptchaResult.successful || captchaScore < 0.5) {
    return { statusCode: 400, message: recaptchaResult.message }
  }

  const name = `${formData.get('name')}`.replace(/[\r\n]/g, '')
  const email = `${formData.get('email')}`.replace(/[\r\n]/g, '')
  const phone = `${formData.get('phone') ?? ''}`.replace(/[\r\n]/g, '')
  const message = `${formData.get('message')}`

  const recipients = (process.env.CONTACT_EMAIL_TO ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (recipients.length === 0) {
    return { statusCode: 500, message: 'No recipients configured.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Indian Bandwagon <noreply@trhssbandwagon.org>',
      to: recipients,
      replyTo: email,
      subject: `Website contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    })
    return { message: 200 }
  } catch {
    return { statusCode: 500, message: 'Email delivery failed.' }
  }
}
