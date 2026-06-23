import cloudinary from "@/lib/cloudinary";
import { authMiddleware } from "@/middleware/auth.middleware";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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

    // Validate file type (only allow images)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowedMimeTypes.includes(file.type)) {
      throw new Error("Təhlükəsizlik xətası: Yalnız şəkil formatlarına (JPG, PNG, WEBP, SVG, GIF) icazə verilir.");
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "svg", "gif"];
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error("Təhlükəsizlik xətası: Yalnız şəkil genişlənmələrinə icazə verilir.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

     
    // Fallback to local file upload if Cloudinary is not configured
    if (!process.env.CLOUDINARY_NAME) {
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(filepath, buffer);
      
      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
      });
    }

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
