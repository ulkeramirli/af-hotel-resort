import { randomInt } from "crypto";

export function generateOtp() {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    // Return a random 6-digit number securely generated even without email configured
    return randomInt(100000, 1000000).toString();
  }
  return randomInt(100000, 1000000).toString();
}
