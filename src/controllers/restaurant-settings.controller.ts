import RestaurantSettings from "@/models/RestaurantSettings";
import { NextResponse } from "next/server";

export class RestaurantSettingsController {
  static async get() {
    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create({
        tag: "",
        title: "",
        subtitle: "",
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  }

  static async update(req: Request) {
    const body = await req.json();

    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = await RestaurantSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  }
}
