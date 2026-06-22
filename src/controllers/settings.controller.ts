import Settings from "@/models/Settings";
import { NextResponse } from "next/server";

export class SettingsController {
  static async get() {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  }

  static async update(req: Request) {
    const body = await req.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
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
