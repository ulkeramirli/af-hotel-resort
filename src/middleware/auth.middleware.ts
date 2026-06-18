import jwt from "jsonwebtoken";

export function authMiddleware(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token is missing");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
