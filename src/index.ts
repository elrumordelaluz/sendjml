import { promises as fs } from 'fs'
import { resolve, join } from 'path'
import { Transporter } from 'nodemailer'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'

let globalTemplates: string | null = null
let globalFrom: fromType | null = null
let globalParams: {} | null = null
let transporter: Transporter
let sendgridter: any

type configOptions = {
  templates?: string
  params?: {}
}

type sendgridConfigOptions = configOptions & {
  apiKey?: string
  from?: fromType
}

type gmailConfigOptions = configOptions & {
  oauthClientId?: string
  oauthClientSecret?: string
  oauthRefreshToken?: string
  gmailUser?: string
  from?: fromType
}

const configSendgrid = ({
  apiKey,
  from,
  templates,
  params,
}: sendgridConfigOptions) => {
  if (apiKey) {
    sendgridter = require('@sendgrid/mail')
    sendgridter.setApiKey(apiKey)

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

// https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
const configGmail = async ({
  oauthClientId,
  oauthClientSecret,
  oauthRefreshToken,
  gmailUser,
  templates,
  params,
}: gmailConfigOptions) => {
  if (oauthClientId && oauthClientSecret && oauthRefreshToken && gmailUser) {
    const nodemailer = require('nodemailer')
    const { google } = require('googleapis')
    const oAuth2Client = new google.auth.OAuth2(
      oauthClientId,
      oauthClientSecret,
      'https://developers.google.com/oauthplayground'
    )

    oAuth2Client.setCredentials({
      refresh_token: oauthRefreshToken,
    })
    const accessToken = await oAuth2Client.getAccessToken()
    transporter = nodemailer.createTransport({
      // @ts-ignore
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailUser,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
        accessToken: accessToken,
      },
    })
    if (templates) {
      globalTemplates = templates
    }
    if (params) {
      globalParams = params
    }
  } else {
    throw new Error('Gmail OAuth keys missing')
  }
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

const sendgridSend = async ({
  templates,
  design,
  params,
  ...mailData
}: sendgridSendOptions): Promise<any> => {
  let html = mailData.html || ''

  html = await designEmail({ templates, design, params })

  const { from, ...restMailData } = mailData
  const sender = from || globalFrom
  if (sender && sendgridter) {
    await sendgridter.send({
      from: sender,
      html,
      ...restMailData,
    })
    return true
  } else {
    throw new Error('Missing sender')
  }
}

const gmailSend = async ({
  templates,
  design,
  params,
  ...mailData
}: gmailSendOptions): Promise<any> => {
  try {
    let html = mailData.html || ''

    html = await designEmail({ templates, design, params })

    const { from, ...restMailData } = mailData

    if (transporter) {
      if (transporter) {
        await transporter.sendMail({
          html,
          to: '',
          from: '',
          ...restMailData,
        })
      }

      return true
    } else {
      throw new Error('Missing transporter')
    }
  } catch (err) {
    console.log({ err })
    return false
  }
}

type sendgridSendOptions = Omit<MailDataRequired, 'from'> & {
  to?: string
  from?: fromType
  text?: string
  design?: string
  templates?: string
  params?: any
}

type gmailSendOptions = {
  from?: string | { name?: string; address: string }
  to?: string | [string]
  cc?: string | [string]
  bcc?: string | [string]
  subject?: string
  text?: string
  html?: string
  design?: string
  templates?: string
  params?: any
  attachments?: [any]
}

type designType = {
  design?: string
  templates?: string
  params?: any
}

type fromType = string | { name?: string; email: string }

export const gmail = { config: configGmail, send: gmailSend }
export const sendgrid = { config: configSendgrid, send: sendgridSend }
