import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  isValidProvider,
  verifyState,
  googleExchangeCode,
  githubExchangeCode,
  appleExchangeCode,
} from "@/lib/auth/oauth";
import { findOrCreateUserByEmail } from "@/lib/db/users";
import { setSessionCookie } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider: p } = await context.params;
  const base = process.env.APP_URL ?? req.nextUrl.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/signin?error=${reason}`, base));

  if (!isValidProvider(p)) return fail("invalid");

  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");

  if (url.searchParams.get("error")) return fail("oauth_denied");
  if (!code || !stateParam) return fail("invalid");

  const jar = await cookies();
  const stateCookie = jar.get("oauth_state")?.value;
  jar.set("oauth_state", "", { path: "/", maxAge: 0 });

  if (!stateCookie || stateCookie !== stateParam || !verifyState(stateParam, p)) {
    return fail("invalid");
  }

  try {
    let userInfo: { email: string; name?: string; avatarUrl?: string };

    if (p === "google") {
      const cv = jar.get("oauth_cv")?.value ?? "";
      jar.set("oauth_cv", "", { path: "/", maxAge: 0 });
      userInfo = await googleExchangeCode(code, cv);
    } else if (p === "github") {
      userInfo = await githubExchangeCode(code);
    } else {
      userInfo = await appleExchangeCode(code);
    }

    const user = await findOrCreateUserByEmail(userInfo.email, {
      name: userInfo.name,
      avatarUrl: userInfo.avatarUrl,
    });

    await setSessionCookie({
      email: user.email,
      name: user.profile.name,
      avatarId: user.profile.avatarId,
      avatarUrl: user.profile.avatarUrl,
      timezone: user.profile.timezone,
      theme: user.profile.theme,
      startOfWeek: user.profile.startOfWeek,
      onboarded: user.profile.onboarded ?? false,
      plan: user.profile.plan,
      planInterval: user.profile.planInterval ?? null,
      planRenewsAt: user.profile.planRenewsAt ?? null,
      paystackCustomerCode: user.profile.paystackCustomerCode ?? null,
      emailDigest: user.profile.emailDigest,
    });

    return NextResponse.redirect(
      new URL(user.profile.onboarded ? "/today" : "/onboarding", base),
    );
  } catch (err) {
    console.error("[oauth callback]", p, err);
    return fail("oauth_failed");
  }
}
