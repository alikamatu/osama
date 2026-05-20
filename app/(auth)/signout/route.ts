import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

async function handle() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/signin", process.env.APP_URL ?? "http://localhost:3000"));
}

export const GET = handle;
export const POST = handle;
