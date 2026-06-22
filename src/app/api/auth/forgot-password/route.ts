import { AuthController } from "@/controllers/auth.controller";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  return AuthController.forgotPassword(req);
}
