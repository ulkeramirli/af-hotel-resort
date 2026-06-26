import jwt from "jsonwebtoken";

export function authMiddleware(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Token is missing or invalid format");
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "null" || token === "undefined") {
      throw new Error("Token is missing");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
