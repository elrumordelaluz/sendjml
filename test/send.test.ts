import {
  config,
  send,
  // designEmail
} from '../src'
// import { promises as fs } from 'fs'

describe('send', () => {
  it('works', async done => {
    config({
      apiKey: process.env.SG_API_KEY,
      from: 'contact@lionel.com',
      templates: `${__dirname}/design`,
      params: {
        hello: 'Hello, ',
        world: 'Word!',
      },
    })

    await send({
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
