import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  isValidProvider,
  generateState,
  generateCodeVerifier,
  generateCodeChallenge,
  googleAuthUrl,
  githubAuthUrl,
  appleAuthUrl,
} from "@/lib/auth/oauth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider: p } = await context.params;
  const base = process.env.APP_URL ?? req.nextUrl.origin;

  if (!isValidProvider(p)) {
    return NextResponse.redirect(new URL("/signin?error=invalid", base));
  }

  const state = generateState(p);
  const jar = await cookies();

  jar.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  let authUrl: string;

  if (p === "google") {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    jar.set("oauth_cv", verifier, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    authUrl = googleAuthUrl(state, challenge);
  } else if (p === "github") {
    authUrl = githubAuthUrl(state);
  } else {
    authUrl = appleAuthUrl(state);
  }

  return NextResponse.redirect(authUrl);
}
