import { NextResponse } from "next/server";
import { matchRoute, normalizePath } from "./lib/middleware";
import { verifySession } from "./lib/session";

export default async function proxy(req) {
   const path = normalizePath(req.nextUrl.pathname);
   const protectedRoutes = ["/dashboard", "/profile"];
   const isProtected = matchRoute(path, protectedRoutes);

   const session = await verifySession();

   if (isProtected && !session.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|woff|woff2|ttf)).*)",
   ],
};
