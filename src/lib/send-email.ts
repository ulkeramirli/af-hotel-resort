import { transporter } from "./mail";

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.log("=====================================");
    console.log(`[MOCK EMAIL SENT TO ${to}]`);
    console.log("Subject:", subject);
    console.log("Body:", html);
    console.log("=====================================");
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });
}
