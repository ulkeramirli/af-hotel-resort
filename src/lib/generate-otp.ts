export function generateOtp() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    return "123456";
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}
