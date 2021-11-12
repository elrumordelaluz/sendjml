var $5TBHV$sendjml = require("sendjml");
var $5TBHV$dotenv = require("dotenv");



$5TBHV$dotenv.config();
async function $05b5739161588cd8$var$initSendgrid() {
    $5TBHV$sendjml.sendgrid.config({
        apiKey: process.env.SG_API_KEY,
        from: 'contact@lionel.com',
        templates: `${__dirname}/design`,
        params: {
            hello: 'Hello, ',
            world: 'Word!'
        }
    });
    await $5TBHV$sendjml.sendgrid.send({
        to: 'elrumordelaluz@me.com',
        subject: 'This is an email sent using Sendgrid',
        text: 'Sendgrid Lorem ipsum',
        params ({ hello: hello , world: world  }) {
            return {
                message: `Sendgrid Lorem ipsum. ${hello}${world}`
            };
        }
    });
}
async function $05b5739161588cd8$var$initGmail() {
    await $5TBHV$sendjml.gmail.config({
        gmailUser: process.env.MAIL_USERNAME,
        oauthClientId: process.env.OAUTH_CLIENTID,
        oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
        oauthRefreshToken: process.env.OAUTH_REFRESH_TOKEN,
        templates: `${__dirname}/design`,
        params: {
            hello: 'Hello, ',
            world: 'Word!'
        }
    });
    await $5TBHV$sendjml.gmail.send({
        to: 'elrumordelaluz@me.com',
        subject: 'This is an email sent using Gmail',
        text: 'Gmail Lorem ipsum',
        params ({ hello: hello , world: world  }) {
            return {
                message: `Gmail Lorem ipsum. ${hello}${world}`
            };
        }
    });
}
$05b5739161588cd8$var$initSendgrid();
$05b5739161588cd8$var$initGmail();


//# sourceMappingURL=index.js.map
