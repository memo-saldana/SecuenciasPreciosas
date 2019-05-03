const nodemailer = require('nodemailer'),
      hbs = require('nodemailer-express-handlebars'),
      serv = {};

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views/email',
    defaultLayout: 'template',
    partialsDir: 'views/partials'
  },
  viewPath: 'views/email',
  extName: '.hbs'
}

let mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW
  }
})


serv.sendInvInst = async (email, token) => {
  console.log('email :', email);
  mailer.use('compile', hbs(options))
  const mail = await mailer.sendMail({
    from: 'donotreply@patroneshermosos.org',
    to: email,
    subject: 'Invitación Patrones Hermosos',
    template: 'invite',
    context: {
      baseURL: process.env.BASE_URL,
      inviteURL: process.env.BASE_URL+'/register/administrador?token='+token,
      projectName: process.env.PROJECT_NAME
    }
  })
}





module.exports = serv;