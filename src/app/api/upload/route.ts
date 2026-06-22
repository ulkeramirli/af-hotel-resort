import cloudinary from "@/lib/cloudinary";
import { authMiddleware } from "@/middleware/auth.middleware";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const user = authMiddleware(req) as any;

    if (user.role !== "admin") {
      return NextResponse.json(
        { 
          success: false,
          message: "Only admin can upload images",
        },
        {
          status: 403,
        },
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("File is required");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

     
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "rooms",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
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
