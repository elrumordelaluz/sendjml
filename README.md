# Sendjml

Send emails using `mjml`.

## Design templates

In order to have a design structure, is necessary to set the folder containing the `.mjml` files.

```js
{
  ...config,
  templates: `${__dirname}/design`,
}
```

The library will search for design templates, and overrides at the send time, always in this folder.

## Using Sendgrid

We use [Sendgrid mail library](https://github.com/sendgrid/sendgrid-nodejs) in case you have an [API key](https://docs.sendgrid.com/api-reference/api-keys/create-api-keys) already created.

```zsh
yarn add sendjml @sendgrid/mail
```

### Config using Sendgrid

```js
const { sendgrid } = require('sendjml')

sendgrid.config({
  apiKey: process.env.SG_API_KEY,
  from: 'mymail@mymal.com',
  templates: `${__dirname}/design`,
})
```

### Send using Sendgrid

```js
const { sendgrid } = require('sendjml')
await sendgrid.send({
  to: 'anothermail@anothermail.com',
  subject: 'This is an email sent using Sendgrid',
  text: 'Sendgrid Lorem ipsum',
})
```

## Using Gmail

In order to send emails using Gmail as SMTP, we use [nodemailer](https://nodemailer.com/usage/using-gmail/). Sending this way is necessary to create an OAuth keys in a Google Cloud Platform application following this [guide](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/) as an example.

```zsh
yarn add sendjml nodemailer googleapis
```

### Config using Gmail

In this case, the `from` field is not necessary because Gmail uses the one set as `gmailUser`.

```js
const { gmail } = require('sendjml')

gmail.config({
  gmailUser: process.env.MAIL_USERNAME,
  oauthClientId: process.env.OAUTH_CLIENTID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRefreshToken: process.env.OAUTH_REFRESH_TOKEN,
})
```

### Send using Gmail

```js
const { gmail } = require('sendjml')
await gmail.send({
  to: 'anothermail@anothermail.com',
  subject: 'This is an email sent using Sendgrid',
  text: 'Sendgrid Lorem ipsum',
})
```
