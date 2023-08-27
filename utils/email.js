const nodemailer = require("nodemailer");

const sendEmail = async options => {
  // 1) Create a transporter.
  //   const transporterOptions = {
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       password: process.env.EMAIL_PASS
  //     }
  //   };
  let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "ab15a5093666d2",
      pass: "36eab8f4714e61"
    }
  });
    // console.log(transporterOptions, transporter);
  // 2) Define email options.
    const mailOptions = {
      from: "Popa Andrei-Valentin <andrei_popa2009@icloud.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    }

  // 3) Actually send the email.
    await transport.sendMail(mailOptions);
}

module.exports = sendEmail;