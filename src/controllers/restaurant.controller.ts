import Restaurant from "@/models/Restaurant";
import { NextResponse } from "next/server";

export class RestaurantController {
  // ─── CREATE ───
  static async create(req: Request) {
    try {
      const body = await req.json();
      const { name, image, description, workingHours, phone, menu } = body;

      const restaurant = await Restaurant.create({
        name,
        image,
        description,
        workingHours,
        phone,
        menu: menu || [],
      });

      return NextResponse.json(
        { success: true, restaurant },
        { status: 201 },
      );
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }

  // ─── GET ALL ───
  static async getAll(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search");

      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
      }

      const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        restaurants,
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }

  // ─── GET BY ID ───
  static async getById(id: string) {
    try {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return NextResponse.json(
          { success: false, message: "Restaurant not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        restaurant,
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }

  // ─── UPDATE ───
  static async update(id: string, body: Record<string, unknown>) {
    try {
      const restaurant = await Restaurant.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!restaurant) {
        return NextResponse.json(
          { success: false, message: "Restaurant not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        restaurant,
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }

  // ─── DELETE ───
  static async delete(id: string) {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(id);
      if (!restaurant) {
        return NextResponse.json(
          { success: false, message: "Restaurant not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Restaurant deleted successfully",
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }

  // ─── SEARCH MENU ITEMS (within a specific restaurant) ───
  static async searchMenu(id: string, query: string) {
    try {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        return NextResponse.json(
          { success: false, message: "Restaurant not found" },
          { status: 404 },
        );
      }

      const lowerQuery = query.toLowerCase();
      const filteredMenu = restaurant.menu
        .map((category: any) => {
          const filteredItems = category.items.filter(
            (item: any) =>
              item.name.toLowerCase().includes(lowerQuery) ||
              item.description.toLowerCase().includes(lowerQuery),
          );
          if (filteredItems.length === 0) return null;
          return {
            _id: category._id,
            name: category.name,
            items: filteredItems,
          };
        })
        .filter(Boolean);

      return NextResponse.json({
        success: true,
        menu: filteredMenu,
      });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { success: false, message },
        { status: 400 },
      );
    }
  }
}
