import { promises as fs } from 'fs'
import { resolve, join } from 'path'
import sgMail from '@sendgrid/mail'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'

let globalTemplates: string | null = null
let globalFrom: fromType | null = null

export const config = ({ apiKey, from, templates }: optionsType) => {
  if (apiKey) {
    sgMail.setApiKey(apiKey)

    if (from) {
      globalFrom = from
    }
    if (templates) {
      globalTemplates = templates
    }
  } else {
    throw new Error('SendGrid api key missing')
  }
}

type optionsType = {
  apiKey?: string
  from?: fromType
  templates?: string
}

export const send = async ({
  templates,
  design,
  params,
  ...mailData
}: sendType): Promise<any> => {
  try {
    let html = mailData.html || ''
    let templatesDir = templates || globalTemplates

    if (templatesDir) {
      const designBase = await fs.readFile(
        resolve(templatesDir, `${design ?? 'base'}.mjml`),
        'utf8'
      )
      const template = compile(designBase)
      const mjml = template(params)
      const htmlOutput = mjml2html(mjml, {
        filePath: join(templatesDir),
      })

      html = htmlOutput.html
    }

    const { from, ...restMailData } = mailData
    const sender = from || globalFrom
    if (sender) {
      await sgMail.send({
        from: sender,
        html,
        ...restMailData,
      })
      return true
    } else {
      throw new Error('Missing sender')
    }
  } catch (err) {
    console.log({ err })
    return false
  }
}

type sendType = Omit<MailDataRequired, 'from'> & {
  from?: fromType
  text?: string
  design?: string
  templates?: string
  params?: any
}

type fromType = string | { name?: string; email: string }
