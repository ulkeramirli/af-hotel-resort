import Review from "@/models/Review";
import { NextResponse } from "next/server";

export class ReviewController {
  static async create(req: Request) {
    const body = await req.json();
    const { fullName, emailOrPhone, message } = body;
    const review = await Review.create({
      fullName,
      emailOrPhone,
      message,
    });
    return NextResponse.json(
      {
        success: true,
        review,
      },
      {
        status: 201,
      },
    );
  }
  static async getAproved() {
    const review = await Review.find({
      status: "approved",
    }).sort({
      createdAt: -1,
    });
    const totalReviews = await Review.countDocuments({
      status: "approved",
    });
    return NextResponse.json({
      success: true,
      totalReviews,
      review,
    });
  }
  static async getAll() {
    const reviews = await Review.find().sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      reviews,
    });
  }
  static async getById(id: string) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }
    return NextResponse.json({
      success: true,
      review,
    });
  }
  static async update(id: string, body: Record<string, unknown>) {
    const review = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      throw new Error("Review not found");
    }
    return NextResponse.json({
      success: true,
      review,
    });
  }
  static async delete(id: string) {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new Error("Review not found");
    }
    return NextResponse.json({
      success: true,
      message: "Review deleted succesfully",
    });
  }
}
