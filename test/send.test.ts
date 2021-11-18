import {
  sendgrid,
  gmail,
  // designEmail
} from '../src'
import { promises as fs, createReadStream } from 'fs'

describe('Sendgrid', () => {
  it('works', async done => {
    sendgrid.config({
      apiKey: process.env.SG_API_KEY,
      from: { name: 'Lionel T.', email: 'contact@lionel.com' },
      templates: `${__dirname}/design`,
      params: {
        hello: 'Hello, ',
        world: 'Word!',
      },
    })

    const attachment = await fs.readFile(`${__dirname}/test.pdf`)
    await sendgrid.send({
      from: 'Pixeden <info@pixeden.com>',
      to: 'elrumordelaluz@me.com',
      subject: 'This is an email sent using Sendgrid',
      text: 'Sendgrid Lorem ipsum',
      params({ hello, world }: any) {
        return { message: `Sendgrid Lorem ipsum. ${hello}${world}` }
      },
      attachments: [
        {
          content: attachment.toString('base64'),
          filename: 'attachment.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    })

    // const html = await designEmail({ design: 'seed' })
    // await fs.writeFile('seed_new.html', html)

    // await send({
    //   from: 'lionel@tzatzk.in',
    //   to: 'elrumordelaluz@me.com',
    //   subject: 'This is another email',
    //   text: 'another email',
    //   params: { message: 'another email' },
    // })

    expect(true).toBe(true)

    done()
  })
})

describe('Gmail', () => {
  it('works', async done => {
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

    const attachment = createReadStream(`${__dirname}/test.pdf`)
    await gmail.send({
      to: 'elrumordelaluz@me.com',
      subject: 'This is an email sent using Gmail',
      text: 'Gmail Lorem ipsum',
      params({ hello, world }: any) {
        return { message: `Gmail Lorem ipsum. ${hello}${world}` }
      },
      // ref: https://nodemailer.com/message/attachments/
      attachments: [
        {
          content: attachment,
          filename: 'attachment.pdf',
          contentType: 'application/pdf',
          contentDisposition: 'attachment',
        },
      ],
    })

    expect(true).toBe(true)

    done()
  })
})
