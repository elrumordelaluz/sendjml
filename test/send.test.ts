import { config, send } from '../src'

describe('send', () => {
  it('works', async done => {
    config({
      apiKey: process.env.SG_API_KEY,
      from: 'contact@lionel.com',
      templates: `${__dirname}/design`,
    })

    await send({
      to: 'elrumordelaluz@me.com',
      subject: 'This is a Lorem Ipsum email',
      text: 'Lorem ipsum',
      params: { message: 'Lorem ipsum' },
    })

    await send({
      from: 'lionel@tzatzk.in',
      to: 'elrumordelaluz@me.com',
      subject: 'This is another email',
      text: 'another email',
      params: { message: 'another email' },
    })

    expect(true).toBe(true)

    done()
  })
})
