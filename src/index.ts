import { promises as fs } from 'fs'
import { resolve, join } from 'path'
import sgMail from '@sendgrid/mail'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'

let globalTemplates: string | null = null
let globalFrom: fromType | null = null
let globalParams: {} | null = null

export const config = ({ apiKey, from, templates, params }: optionsType) => {
  if (apiKey) {
    sgMail.setApiKey(apiKey)

    if (from) {
      globalFrom = from
    }
    if (templates) {
      globalTemplates = templates
    }
    if (params) {
      globalParams = params
    }
  } else {
    throw new Error('SendGrid api key missing')
  }
}

type optionsType = {
  apiKey?: string
  from?: fromType
  templates?: string
  params?: {}
}

export const designEmail = async ({
  templates,
  design,
  params,
}: designType): Promise<string> => {
  let templatesDir = templates || globalTemplates
  let templateParams =
    typeof params === 'function'
      ? params(globalParams)
      : { ...globalParams, ...params }

  if (templatesDir) {
    const designBase = await fs.readFile(
      resolve(templatesDir, `${design ?? 'base'}.mjml`),
      'utf8'
    )
    const template = compile(designBase)
    const mjml = template(templateParams)
    const htmlOutput = mjml2html(mjml, {
      filePath: join(templatesDir),
    })

    return htmlOutput.html
  }
  return ''
}

// export const getHtml = async ({templates, design, params} :getHtmlType):Boolean => ()

export const send = async ({
  templates,
  design,
  params,
  ...mailData
}: sendType): Promise<any> => {
  try {
    let html = mailData.html || ''

    html = await designEmail({ templates, design, params })

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

type designType = {
  design?: string
  templates?: string
  params?: any
}

type fromType = string | { name?: string; email: string }
