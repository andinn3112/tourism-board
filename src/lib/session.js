"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { v4 as uuidv4 } from "uuid";
import { JWT_SECRET } from "./env";
import { redirect } from "next/navigation";
import prisma from "./prisma";

const encodedKey = new TextEncoder().encode(JWT_SECRET);

//  Encrypt payload to JWT
export async function encrypt(payload) {
   return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(payload.exp)
      .sign(encodedKey);
}

// 🔓 Decrypt JWT
export async function decrypt(sessionToken) {
   if (
      !sessionToken ||
      typeof sessionToken !== "string" ||
      !sessionToken.includes(".")
   ) {
      return null;
   }

   try {
      const { payload } = await jwtVerify(sessionToken, encodedKey, {
         algorithms: ["HS256"],
      });

      return payload;
   } catch (error) {
      console.log("JWT verification failed", error);
      return null;
   }
}

//  Create session user
export async function createSession(user) {
   const sessionId = uuidv4();
   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari
   const exp = Math.floor(expiresAt.getTime() / 1000);

   const token = await encrypt({
      userId: user?.id,
      sessionId,
      exp,
   });

   await prisma.authSession.create({
      data: {
         id: sessionId,
         userId: user?.id,
         token,
         expiresAt,
         lastUsedAt: new Date(),
      },
   });

   return await setCookie(token, expiresAt);
}

export async function setCookie(token, expiresAt) {
   const cookieStore = await cookies();
   return cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
   });
}

// Refresh token jika akan kadaluarsa
async function refreshSessionToken(session) {
   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
   const exp = Math.floor(expiresAt.getTime() / 1000);
   const newToken = await encrypt({
      userId: session?.userId,
      sessionId: session.id,
      exp,
   });

   await prisma.authSession.update({
      where: { id: session.id },
      data: {
         token: newToken,
         expiresAt,
         lastUsedAt: new Date(),
      },
   });

   return await setCookie(newToken, expiresAt);
}

//  Validasi session dari JWT + DB
export async function verifySession() {
   const token = await getToken();

   if (!token) {
      return { isLoggedIn: false, userId: "", sessionId: "" };
   }

   const payload = await decrypt(token);
   if (!payload?.sessionId || !payload?.userId) {
      return { isLoggedIn: false, userId: "", sessionId: "" };
   }

   const session = await prisma.authSession.findUnique({
      where: { id: payload.sessionId },
      select: {
         id: true,
         userId: true,
         expiresAt: true,
      },
   });

   if (!session || new Date(session.expiresAt) < new Date()) {
      return { isLoggedIn: false, userId: "", sessionId: "" };
   }

   // Refresh jika tinggal < 1 hari
   const timeLeft = new Date(session.expiresAt).getTime() - Date.now();
   const oneDay = 24 * 60 * 60 * 1000;

   if (timeLeft < oneDay) {
      await refreshSessionToken(session);
   } else {
      // Tetap update lastUsedAt
      await prisma.authSession.update({
         where: { id: session.id },
         data: { lastUsedAt: new Date() },
      });
   }

   return { isLoggedIn: true, userId: session.userId, sessionId: session.id };
}

//  Get user (untuk server components / action)
export const getUser = cache(async () => {
   const session = await verifySession();
   if (!session.isLoggedIn) return null;

   return prisma.user.findUnique({
      where: { id: session.userId },
      select: {
         id: true,
         name: true,
         email: true,
         createdAt: true,
      },
   });
});

export const getToken = cache(async () => {
   const cookieStore = await cookies();
   return cookieStore.get("token")?.value;
});

//  Logout / Hapus session
export async function deleteSession() {
   const token = (await cookies()).get("token")?.value;
   const payload = await decrypt(token);

   if (payload?.sessionId) {
      await prisma.authSession.deleteMany({ where: { id: payload.sessionId } });
   }
   await deleteCookie();
   redirect("/login");
}

export async function deleteCookie() {
   const cookieStore = await cookies();
   cookieStore.delete("token");
}
