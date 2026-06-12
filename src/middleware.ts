import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Защищаем абсолютно все эндпоинты и страницы, которые начинаются с /admin
export const config = {
  matcher: ["/admin/:path*"],
};