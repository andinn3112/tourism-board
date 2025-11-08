"use server";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "@/lib/session";
import prisma from "../prisma";
import { errorResponse, successResponse } from "../response";
import { LoginSchema } from "../schema/auth";

export async function action(formData) {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = LoginSchema.safeParse(rawData);

  if (!parsed.success) {
    if (!parsed.success)
      return errorResponse(parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return errorResponse({
      email: ["Email atau password salah"],
      password: ["Email atau password salah"],
    });
  }

  await createSession(user);

  return successResponse();
}

// Logout Action
export async function logout() {
  await deleteSession();
  redirect("/login");
}
