require('dotenv').config()
import { sendgrid, gmail } from 'sendjml'

async function initSendgrid() {
  sendgrid.config({
    apiKey: process.env.SG_API_KEY,
    from: 'contact@lionel.com',
    templates: `${__dirname}/design`,
    params: {
      hello: 'Hello, ',
      world: 'Word!',
    },
  })

  await sendgrid.send({
    to: 'elrumordelaluz@me.com',
    subject: 'This is an email sent using Sendgrid',
    text: 'Sendgrid Lorem ipsum',
    params({ hello, world }) {
      return { message: `Sendgrid Lorem ipsum. ${hello}${world}` }
    },
  })
}

async function initGmail() {
  await gmail.config({
    gmailUser: process.env.MAIL_USERNAME,
    oauthClientId: process.env.OAUTH_CLIENTID,
    oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
    oauthRefreshToken: process.env.OAUTH_REFRESH_TOKEN,
    templates: `${__dirname}/design`,
    params: {
      hello: 'Hello, ',
      world: 'Word!',
    },
  })

  await gmail.send({
    to: 'elrumordelaluz@me.com',
    subject: 'This is an email sent using Gmail',
    text: 'Gmail Lorem ipsum',
    params({ hello, world }) {
      return { message: `Gmail Lorem ipsum. ${hello}${world}` }
    },
  })
}

initSendgrid()
initGmail()
