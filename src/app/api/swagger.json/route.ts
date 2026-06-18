import { NextResponse } from "next/server";

export async function GET() {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "AF Aqua Hotel & Resort API",
      version: "1.0.0",
      description:
        "AF Aqua Hotel & Resort layihəsi üçün API sənədləşdirilməsi. Buraya otaqların idarə edilməsi, rezervasiyalar, autentifikasiya, şəkil yükləmə və profil idarəetməsi daxildir.",
    },
    servers: [
      {
        url: "/api",
        description: "Cari server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Giriş etdikdən sonra əldə etdiyiniz JWT tokeni daxil edin. Nümunə: `Bearer eyJhbGciOi...`",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            name: { type: "string", example: "Əli Həsənov" },
            email: {
              type: "string",
              format: "email",
              example: "ali@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Room: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            name: { type: "string", example: "Dəniz mənzərəli otaq" },
            type: {
              type: "string",
              enum: ["Single", "Single Double", "Single Twin", "Apartment for 4"],
              example: "Single Double",
            },
            description: {
              type: "string",
              example: "Gözəl dəniz mənzərəsi olan rahat otaq",
            },
            price: { type: "number", example: 150 },
            capacity: { type: "number", example: 2 },
            images: {
              type: "array",
              items: { type: "string" },
              example: [
                "https://res.cloudinary.com/example/image/upload/rooms/room1.jpg",
              ],
            },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "Kondisioner", "Minibar"],
            },
            isAvailable: { type: "boolean", example: true },
            createdBy: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  example: "64f1a2b3c4d5e6f7a8b9c0d1",
                },
                name: { type: "string", example: "Admin İstifadəçi" },
                email: {
                  type: "string",
                  format: "email",
                  example: "admin@afhotel.az",
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            room: { $ref: "#/components/schemas/Room" },
            guestName: { type: "string", example: "Kamran Məmmədov" },
            email: {
              type: "string",
              format: "email",
              example: "kamran@example.com",
            },
            phone: { type: "string", example: "+994501234567" },
            checkIn: {
              type: "string",
              format: "date-time",
              example: "2025-08-01T14:00:00.000Z",
            },
            checkOut: {
              type: "string",
              format: "date-time",
              example: "2025-08-05T12:00:00.000Z",
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled"],
              example: "pending",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AvailabilitySlot: {
          type: "object",
          properties: {
            _id: { type: "string" },
            checkIn: { type: "string", format: "date-time" },
            checkOut: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Xəta mesajı" },
          },
        },
      },
    },
    paths: {
      // ─── Authentication ───────────────────────────────────────────────
      "/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Yeni istifadəçi qeydiyyatı",
          description: "Ad, email və şifrə ilə yeni istifadəçi yaradır.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "Əli Həsənov" },
                    email: {
                      type: "string",
                      format: "email",
                      example: "ali@example.com",
                    },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "secret123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Uğurla qeydiyyatdan keçdi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Yanlış sorğu (məs: istifadəçi artıq mövcuddur)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/login": {
        post: {
          tags: ["Authentication"],
          summary: "Sistemə giriş",
          description:
            "Email və şifrə ilə sistemə daxil olur, JWT token qaytarır.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "ali@example.com",
                    },
                    password: { type: "string", example: "secret123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Giriş uğurludur",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Email və ya şifrə yanlışdır",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ─── User Profile ─────────────────────────────────────────────────
      "/profile": {
        get: {
          tags: ["User Profile"],
          summary: "Cari istifadəçi profilini gətir",
          description:
            "Bearer token vasitəsilə JWT-dən istifadəçi məlumatlarını qaytarır.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Profil məlumatları",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                            example: "64f1a2b3c4d5e6f7a8b9c0d1",
                          },
                          email: {
                            type: "string",
                            example: "ali@example.com",
                          },
                          role: { type: "string", example: "user" },
                          iat: { type: "number", example: 1720000000 },
                          exp: { type: "number", example: 1720086400 },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Token tapılmadı və ya etibarsızdır",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ─── Rooms ────────────────────────────────────────────────────────
      "/rooms": {
        get: {
          tags: ["Rooms"],
          summary: "Bütün otaqları siyahıla",
          description:
            "Bütün mövcud otaqları, yaradanın adı və emaili ilə birlikdə qaytarır.",
          responses: {
            "200": {
              description: "Otaqların siyahısı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      rooms: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Room" },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Xəta baş verdi",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Rooms"],
          summary: "Yeni otaq yarat (Yalnız Admin)",
          description:
            "Yeni otel otağı yaradır. Yalnız admin roluna malik istifadəçilər icra edə bilər.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "type", "description", "price", "capacity"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Dəniz mənzərəli otaq",
                    },
                    type: {
                      type: "string",
                      enum: [
                        "Single",
                        "Single Double",
                        "Single Twin",
                        "Apartment for 4",
                      ],
                      example: "Single Double",
                    },
                    description: {
                      type: "string",
                      example: "Gözəl dəniz mənzərəsi olan rahat otaq",
                    },
                    price: { type: "number", example: 150 },
                    capacity: { type: "number", example: 2 },
                    images: {
                      type: "array",
                      items: { type: "string" },
                      example: [
                        "https://res.cloudinary.com/example/image/upload/rooms/room1.jpg",
                      ],
                    },
                    amenities: {
                      type: "array",
                      items: { type: "string" },
                      example: ["WiFi", "Kondisioner", "Minibar"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Otaq uğurla yaradıldı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      room: { $ref: "#/components/schemas/Room" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Token tapılmadı və ya rolu yetərli deyil (Yalnız admin)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "400": {
              description: "Validasiya xətası",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/rooms/{id}": {
        get: {
          tags: ["Rooms"],
          summary: "ID-yə görə otaq məlumatı",
          description: "MongoDB ObjectId ilə müəyyən bir otağın məlumatlarını qaytarır.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            },
          ],
          responses: {
            "200": {
              description: "Otaq tapıldı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      room: { $ref: "#/components/schemas/Room" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "400": {
              description: "Yanlış ID formatı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Rooms"],
          summary: "Otağı yenilə (Yalnız Admin)",
          description:
            "Mövcud otağın məlumatlarını yeniləyir. Yalnız admin icra edə bilər.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            },
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Dağ mənzərəli otaq" },
                    type: {
                      type: "string",
                      enum: [
                        "Single",
                        "Single Double",
                        "Single Twin",
                        "Apartment for 4",
                      ],
                      example: "Single Twin",
                    },
                    description: { type: "string" },
                    price: { type: "number", example: 200 },
                    capacity: { type: "number", example: 3 },
                    images: {
                      type: "array",
                      items: { type: "string" },
                    },
                    amenities: {
                      type: "array",
                      items: { type: "string" },
                    },
                    isAvailable: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Otaq uğurla yeniləndi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      room: { $ref: "#/components/schemas/Room" },
                    },
                  },
                },
              },
            },
            "403": {
              description: "Yalnız admin yeniləyə bilər",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "400": {
              description: "Validasiya xətası",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Rooms"],
          summary: "Otağı sil (Yalnız Admin)",
          description:
            "Müəyyən otağı bazadan silir. Yalnız admin icra edə bilər.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            },
          ],
          responses: {
            "200": {
              description: "Otaq uğurla silindi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Room deleted successfully",
                      },
                    },
                  },
                },
              },
            },
            "403": {
              description: "Yalnız admin silə bilər",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "400": {
              description: "Yanlış ID formatı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/rooms/{id}/availability": {
        get: {
          tags: ["Rooms"],
          summary: "Otağın məşğul tarixlərini gətir",
          description:
            "Müəyyən otaq üçün ləğv edilməmiş (pending/confirmed) bütün rezervasiyaların check-in/check-out tarixlərini qaytarır. Bu məlumat frontend-də mövcud olmayan tarixləri bloklamaq üçün istifadə olunur.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            },
          ],
          responses: {
            "200": {
              description: "Məşğul tarix aralıqları",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      bookings: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/AvailabilitySlot",
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Xəta baş verdi",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ─── Bookings ─────────────────────────────────────────────────────
      "/bookings": {
        post: {
          tags: ["Bookings"],
          summary: "Yeni rezervasiya yarat",
          description:
            "Müəyyən otaq üçün yeni rezervasiya yaradır. Tarix konflikti, keçmiş tarix yoxlanılır, müştəriyə və adminə email göndərilir.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "room",
                    "guestName",
                    "email",
                    "phone",
                    "checkIn",
                    "checkOut",
                  ],
                  properties: {
                    room: {
                      type: "string",
                      description: "Otağın MongoDB ObjectId-si",
                      example: "64f1a2b3c4d5e6f7a8b9c0d1",
                    },
                    guestName: {
                      type: "string",
                      example: "Kamran Məmmədov",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "kamran@example.com",
                    },
                    phone: {
                      type: "string",
                      example: "+994501234567",
                    },
                    checkIn: {
                      type: "string",
                      format: "date-time",
                      example: "2025-08-01T14:00:00.000Z",
                    },
                    checkOut: {
                      type: "string",
                      format: "date-time",
                      example: "2025-08-05T12:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Rezervasiya uğurla yaradıldı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Booking created successfully",
                      },
                      booking: { $ref: "#/components/schemas/Booking" },
                    },
                  },
                },
              },
            },
            "400": {
              description:
                "Xəta (tarix konflikti, keçmiş tarix, otaq tapılmadı)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        get: {
          tags: ["Bookings"],
          summary: "Bütün rezervasiyaları siyahıla",
          description:
            "Bütün rezervasiyaları otaq məlumatları ilə birlikdə qaytarır.",
          responses: {
            "200": {
              description: "Rezervasiyaların siyahısı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      bookings: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Booking" },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Xəta baş verdi",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/bookings/{id}": {
        get: {
          tags: ["Bookings"],
          summary: "ID-yə görə rezervasiya məlumatı",
          description:
            "Müəyyən rezervasiyanın bütün məlumatlarını otaq məlumatları ilə birlikdə qaytarır.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Rezervasiyanın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            },
          ],
          responses: {
            "200": {
              description: "Rezervasiya tapıldı",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      booking: { $ref: "#/components/schemas/Booking" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Rezervasiya tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        patch: {
          tags: ["Bookings"],
          summary: "Rezervasiya statusunu yenilə (Yalnız Admin)",
          description:
            "Rezervasiyanın statusunu dəyişir: pending → confirmed → cancelled. Status dəyişdikdə müştəriyə email bildirişi göndərilir.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Rezervasiyanın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "confirmed", "cancelled"],
                      example: "confirmed",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Status uğurla yeniləndi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Booking status updated",
                      },
                      booking: { $ref: "#/components/schemas/Booking" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Yanlış status dəyəri və ya rezervasiya tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "401": {
              description: "Token tapılmadı və ya yalnız admin icra edə bilər",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Bookings"],
          summary: "Rezervasiyanı sil (Yalnız Admin)",
          description:
            "Müəyyən rezervasiyanı bazadan silir. Yalnız admin icra edə bilər.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Rezervasiyanın MongoDB ObjectId-si",
              schema: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            },
          ],
          responses: {
            "200": {
              description: "Rezervasiya uğurla silindi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Booking deleted successfully",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Rezervasiya tapılmadı və ya admin deyilsiniz",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ─── Upload ───────────────────────────────────────────────────────
      "/upload": {
        post: {
          tags: ["Upload"],
          summary: "Cloudinary-ə şəkil yüklə (Yalnız Admin)",
          description:
            "Otaq şəklini Cloudinary-ə yükləyir və URL qaytarır. Yalnız admin roluna malik istifadəçilər icra edə bilər.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Yüklənəcək şəkil faylı",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Şəkil uğurla yükləndi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      url: {
                        type: "string",
                        example:
                          "https://res.cloudinary.com/example/image/upload/v1720000000/rooms/room1.jpg",
                      },
                    },
                  },
                },
              },
            },
            "403": {
              description: "Yalnız admin şəkil yükləyə bilər",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "400": {
              description: "Fayl tapılmadı və ya xəta baş verdi",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "401": {
              description: "Token tapılmadı və ya etibarsızdır",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(swaggerSpec);
}
