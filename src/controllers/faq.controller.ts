import Faq from "@/models/Faq";
import { NextResponse } from "next/server";

export class FaqController {
  static async create(req: Request) {
    const body = await req.json();
    const { question, answer } = body;
    const faq = await Faq.create({
      question,
      answer,
    });
    return NextResponse.json(
      {
        success: true,
        faq,
      },
      {
        status: 201,
      },
    );
  }
  static async getAll() {
    const faq = await Faq.find().sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      faq,
    });
  }
  static async getById(id: string) {
    const faq = await Faq.findById(id);
    if (!faq) {
      throw new Error("FAQ not found");
    }
    return NextResponse.json({
      success: true,
      faq,
    });
  }
  static async update(id: string, body: Record<string, unknown>) {
    const faq = await Faq.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      throw new Error("FAQ not found");
    }
    return NextResponse.json({
      success: true,
      faq,
    });
  }
  static async delete(id: string) {
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      throw new Error("FAQ not found");
    }
    return NextResponse.json({
      success: true,
      message: "FAQ deleted succesfully",
    });
  }
}
