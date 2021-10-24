import nodemailer from 'nodemailer'; 

export const sendEmail = async (options:any) => {
    const transporter =  nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass:process.env.EMAIL_PASSWORD,
        },
        tls: {
            ciphers:'SSLv3'
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