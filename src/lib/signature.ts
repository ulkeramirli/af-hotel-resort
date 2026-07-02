import crypto from "crypto";

export function generateSignature(data: string, privateKey: string): string {
  const singString = `${privateKey}${data}${privateKey}`;
  return crypto.createHash("sha1").update(singString).digest("base64");
}
