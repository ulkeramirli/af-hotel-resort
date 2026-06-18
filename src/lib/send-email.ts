import { transporter } from "./mail";

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });
}
