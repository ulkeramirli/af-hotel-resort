import ActivitySettings from "@/models/ActivitySettings";
import { NextResponse } from "next/server";

export class ActivitySettingsController {
  static async get() {
    let settings = await ActivitySettings.findOne();

    if (!settings) {
      settings = await ActivitySettings.create({
        tag: "",
        title: "",
        subtitle: "",
        stats: [
          { value: "", label: "", sub: "" },
          { value: "", label: "", sub: "" },
          { value: "", label: "", sub: "" },
          { value: "", label: "", sub: "" },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  }

  static async update(req: Request) {
    const body = await req.json();

    let settings = await ActivitySettings.findOne();

    if (!settings) {
      settings = await ActivitySettings.create(body);
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
