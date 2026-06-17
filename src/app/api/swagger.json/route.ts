import { NextResponse } from "next/server";

export async function GET() {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "AF Hotel & Resort API",
      version: "1.0.0",
      description: "AF Hotel & Resort layihəsi üçün API sənədləşdirilməsi. Buraya otaqların idarə edilməsi, autentifikasiya və profil idarəetməsi daxildir."
    },
    servers: [
      {
        url: "/api",
        description: "Cari server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Giriş etdikdən sonra əldə etdiyiniz JWT tokeni daxil edin. Nümunə: `Bearer eyJhbGciOi...`"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] }
          }
        },
        Room: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            type: { type: "string", enum: ["standard", "deluxe", "cottage"] },
            description: { type: "string" },
            price: { type: "number" },
            capacity: { type: "number" },
            amenities: {
              type: "array",
              items: { type: "string" }
            },
            isAvailable: { type: "boolean" },
            createdBy: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                email: { type: "string", format: "email" }
              }
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" }
          }
        }
      }
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Yeni istifadəçi qeydiyyatı",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 }
                  }
                }
              }
            }
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
                          token: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Yanlış sorğu (məs: istifadəçi artıq mövcuddur)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/login": {
        post: {
          tags: ["Authentication"],
          summary: "Sistemə giriş",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" }
                  }
                }
              }
            }
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
                          token: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Email və ya şifrə yanlışdır",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/profile": {
        get: {
          tags: ["User Profile"],
          summary: "Cari istifadəçi profilini gətir",
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
                          id: { type: "string" },
                          email: { type: "string" },
                          role: { type: "string" },
                          iat: { type: "number" },
                          exp: { type: "number" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Token tapılmadı və ya etibarsızdır",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/rooms": {
        get: {
          tags: ["Rooms"],
          summary: "Bütün otaqları siyahıla",
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
                        items: { $ref: "#/components/schemas/Room" }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Xəta baş verdi",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Rooms"],
          summary: "Yeni otaq yarat (Yalnız Admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "type", "description", "price", "capacity"],
                  properties: {
                    name: { type: "string" },
                    type: { type: "string", enum: ["standard", "deluxe", "cottage"] },
                    description: { type: "string" },
                    price: { type: "number" },
                    capacity: { type: "number" },
                    amenities: {
                      type: "array",
                      items: { type: "string" }
                    }
                  }
                }
              }
            }
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
                      room: { $ref: "#/components/schemas/Room" }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Token tapılmadı və ya rolu yetərli deyil (Yalnız admin)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            "400": {
              description: "Validasiya xətası",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/rooms/{id}": {
        get: {
          tags: ["Rooms"],
          summary: "ID-yə görə otaq məlumatı",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın Mongoose ID-si",
              schema: { type: "string" }
            }
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
                      room: { $ref: "#/components/schemas/Room" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            "400": {
              description: "Yanlış ID formatı",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        },
        put: {
          tags: ["Rooms"],
          summary: "Otağı yenilə (Yalnız Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın Mongoose ID-si",
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string", enum: ["standard", "deluxe", "cottage"] },
                    description: { type: "string" },
                    price: { type: "number" },
                    capacity: { type: "number" },
                    amenities: {
                      type: "array",
                      items: { type: "string" }
                    },
                    isAvailable: { type: "boolean" }
                  }
                }
              }
            }
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
                      room: { $ref: "#/components/schemas/Room" }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Yalnız admin yeniləyə bilər",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/Error" }
                }
              }
            },
            "400": {
              description: "Validasiya xətası",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/Error" }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Rooms"],
          summary: "Otağı sil (Yalnız Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Otağın Mongoose ID-si",
              schema: { type: "string" }
            }
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
                      message: { type: "string", example: "Roomd deleted successfully" }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Yalnız admin silə bilər",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/Error" }
                }
              }
            },
            "404": {
              description: "Otaq tapılmadı",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/Error" }
                }
              }
            },
            "400": {
              description: "Yanlış ID formatı",
              content: {
                "application/json": {
                  schema: { "$ref": "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/reviews": {
        get: {
          tags: ["Reviews"],
          summary: "Bütün rəyləri siyahıla",
          responses: {
            "200": {
              description: "Rəylərin siyahısı",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        userName: { type: "string" },
                        userImage: { type: "string" },
                        comment: { type: "string" },
                        rating: { type: "number" },
                        replyText: { type: "string", nullable: true },
                        userEmail: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ["Reviews"],
          summary: "Yeni rəy yaz",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["userName", "userEmail", "rating", "comment"],
                  properties: {
                    userName: { type: "string" },
                    userImage: { type: "string" },
                    userEmail: { type: "string" },
                    rating: { type: "number" },
                    comment: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Rəy uğurla əlavə olundu"
            }
          }
        }
      },
      "/admin/reviews/{id}/reply": {
        put: {
          tags: ["Admin Reviews"],
          summary: "Müştəri rəyinə cavab yaz",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["replyText"],
                  properties: {
                    replyText: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Cavab uğurla qeyd olundu"
            }
          }
        }
      }
    }
  };

  return NextResponse.json(swaggerSpec);
}
