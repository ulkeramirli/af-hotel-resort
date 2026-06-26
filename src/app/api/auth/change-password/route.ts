import { AuthController } from "@/controllers/auth.controller";
import { connectDB } from "@/lib/db";

export async function PATCH(req: Request) {
  await connectDB();
  return AuthController.changePassword(req);
}
