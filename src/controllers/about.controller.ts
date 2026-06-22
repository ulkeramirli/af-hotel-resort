import About from "@/models/About";
import { NextResponse } from "next/server";

export class AboutController {
  static async get() {
    const about = await About.findOne();
    return NextResponse.json({
      success: true,
      about,
    });
  }
  static async update(req: Request) {
    const body = await req.json();
    const { title, description, images } = body;
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        title,
        description,
        images,
      });
    } else {
      about.title = title;
      about.description = description;
      about.images = images;
      await about.save();
    }
    return NextResponse.json({
      success: true,
      about,
    });
  }
}
