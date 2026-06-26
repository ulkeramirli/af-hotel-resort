import { ReviewController } from "@/controllers/review.controller";
import { connectDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  return ReviewController.getAproved();
}
export async function POST(req: Request) {
  await connectDB();
  return ReviewController.create(req);
}
