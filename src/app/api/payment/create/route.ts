import { connectDB } from "@/lib/db";
import { PaymentController } from "@/controllers/payment.controller";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    return await PaymentController.create(req);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      },
    );
  }
}
