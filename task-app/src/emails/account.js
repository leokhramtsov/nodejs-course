const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'admin@test.com',
    subject: 'Welcome to the app!',
    text: `Hello ${name}, welcome to the app.`
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'admin@test.com',
    subject: 'Sorry to see you go!',
    text: `Hello ${name}, we are sorry to see you go! Please let us know why you have cancelled and what we can improve on.`
  });
};

module.exports = { sendWelcomeEmail, sendCancelEmail };
