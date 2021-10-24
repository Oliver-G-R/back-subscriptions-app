import nodemailer from 'nodemailer';

export const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.host,
    port: 465,
    secure: true,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    }
  });

  const mailOptions = {
    from: 'SubscriptionsGeek <subscriptionsGeek@mail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(mailOptions)
}