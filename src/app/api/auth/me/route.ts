import { connectDB } from "@/lib/db";
import { AuthController } from "@/controllers/auth.controller";

export async function GET(req: Request) {
  await connectDB();

  return await AuthController.me(req);
}
