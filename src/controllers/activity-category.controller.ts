import ActivityCategory from "@/models/ActivityCategory";
import { NextResponse } from "next/server";

export class ActivityCategoryController {
  static async create(req: Request) {
    const body = await req.json();

    const category = await ActivityCategory.create({
      name: body.name,
    });

    return NextResponse.json(
      {
        success: true,
        category,
      },
      {
        status: 201,
      },
    );
  }

  static async getAll() {
    const categories = await ActivityCategory.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  }

  static async getById(id: string) {
    const category = await ActivityCategory.findById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return NextResponse.json({
      success: true,
      category,
    });
  }

  static async update(id: string, body: Record<string, unknown>) {
    const category = await ActivityCategory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return NextResponse.json({
      success: true,
      category,
    });
  }

  static async delete(id: string) {
    const category = await ActivityCategory.findByIdAndDelete(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  }
}
