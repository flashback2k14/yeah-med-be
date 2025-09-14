import { createTransport } from "nodemailer";

export default async function mailer() {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW,
    },
  });

  await transporter.verify();
  console.log("Server is ready to take our messages");

  try {
    const info = await transporter.sendMail({
      from: `"NO-REPLY" <${process.env.EMAIL_FROM}>`,
      to: "john@doe.test",
      subject: "TEST",
      text: "Lorem ipsum",
      html: "<b>Lorem ipsum</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail", err);
  }
}
