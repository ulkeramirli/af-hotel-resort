import RoomSettings from "@/models/RoomSettings";
import { NextResponse } from "next/server";

export class RoomSettingsController {
  static async getSettings() {
    let settings = await RoomSettings.findOne();
    if (!settings) {
      settings = await RoomSettings.create({});
    }
    return NextResponse.json({
      success: true,
      settings,
    });
  }

  static async updateSettings(req: Request) {
    const body = await req.json();
    let settings = await RoomSettings.findOne();
    
    if (!settings) {
      settings = await RoomSettings.create(body);
    } else {
      settings = await RoomSettings.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  }
}
