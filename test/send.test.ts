import {
  sendgrid,
  gmail,
  // designEmail
} from '../src'
// import { promises as fs } from 'fs'

describe('Sendgrid', () => {
  it('works', async done => {
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
      subject: 'This is a Lorem Ipsum email',
      text: 'Lorem ipsum',
      params({ hello, world }: any) {
        return { message: `Lorem ipsum. ${hello}${world}` }
      },
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

    await gmail.send({
      to: 'elrumordelaluz@me.com',
      subject: 'This is a Lorem Ipsum email',
      text: 'Lorem ipsum',
      params({ hello, world }: any) {
        return { message: `Lorem ipsum. ${hello}${world}` }
      },
    })

    expect(true).toBe(true)

    done()
  })
})
