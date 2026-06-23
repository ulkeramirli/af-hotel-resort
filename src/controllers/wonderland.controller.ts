import Wonderland from "@/models/Wonderland";
import { NextResponse } from "next/server";

export class WonderlandController {
  static async get() {
    let wonderland = await Wonderland.findOne();

    if (!wonderland) {
      wonderland = await Wonderland.create({
        title: "",
        description: "",
        tag: "",
        tickets: [],
        discount: {
          enabled: false,
          percentage: 0,
        },

        smallAttractions: [],
        bigAttractions: [],
      });
    }

    return NextResponse.json({
      success: true,
      wonderland,
    });
  }

  static async update(req: Request) {
    const body = await req.json();

    let wonderland = await Wonderland.findOne();

    if (!wonderland) {
      wonderland = await Wonderland.create(body);
    } else {
      Object.assign(wonderland, body);

      await wonderland.save();
    }

    return NextResponse.json({
      success: true,
      wonderland,
    });
  }
}
