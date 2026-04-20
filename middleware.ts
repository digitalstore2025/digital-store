import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/checkout", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
