import Activity from "@/models/Activity";
import "@/models/ActivityCategory";
import { NextResponse } from "next/server";

export class ActivityController {
  static async create(req: Request) {
    const body = await req.json();

    const { title, description, image, category } = body;

    const activity = await Activity.create({
      title,
      description,
      image,
      category,
    });
    return NextResponse.json(
      {
        success: true,
        activity,
      },
      { status: 201 },
    );
  }
  static async getAll(req: Request) {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");

    const filter = category ? { category } : {};

    const activities = await Activity.find(filter).populate("category").sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      activities,
    });
  }
  static async getById(id: string) {
    const activity = await Activity.findById(id).populate("category");
    if (!activity) {
      throw new Error("Activity not found");
    }
    return NextResponse.json({
      success: true,
      activity,
    });
  }
  static async update(id: string, body: Record<string, unknown>) {
    const activity = await Activity.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      throw new Error("Activity not found");
    }
    return NextResponse.json({
      success: true,
      activity,
    });
  }
  static async delete(id: string) {
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return NextResponse.json({
      success: true,
      message: "Activity deleted successfully",
    });
  }
}
