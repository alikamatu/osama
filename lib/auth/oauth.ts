import "server-only";
import {
  createHmac,
  createHash,
  createSign,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) throw new Error("AUTH_SECRET is not set");

export type OAuthProvider = "google" | "github" | "apple";
const PROVIDERS = ["google", "github", "apple"] as const;
export function isValidProvider(p: string): p is OAuthProvider {
  return (PROVIDERS as readonly string[]).includes(p);
}

const STATE_TTL_MS = 10 * 60 * 1000;

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

// ── State (CSRF protection) ────────────────────────────────────────────────

export function generateState(provider: OAuthProvider): string {
  const nonce = b64url(randomBytes(24));
  const body = b64url(Buffer.from(JSON.stringify({ p: provider, n: nonce, x: Date.now() + STATE_TTL_MS })));
  const sig = b64url(createHmac("sha256", SECRET!).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyState(state: string, expectedProvider: OAuthProvider): boolean {
  const dot = state.lastIndexOf(".");
  if (dot === -1) return false;
  const body = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = createHmac("sha256", SECRET!).update(body).digest();
  const actual = fromB64url(sig);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as { p: string; x: number };
    return Date.now() < payload.x && payload.p === expectedProvider;
  } catch {
    return false;
  }
}

// ── PKCE ──────────────────────────────────────────────────────────────────

export function generateCodeVerifier(): string {
  return b64url(randomBytes(32));
}

export function generateCodeChallenge(verifier: string): string {
  return b64url(createHash("sha256").update(verifier).digest());
}

// ── Shared types ──────────────────────────────────────────────────────────

export type OAuthUserInfo = { email: string; name?: string; avatarUrl?: string };

type TokenResponse = { access_token: string; id_token?: string; token_type?: string };

const APP_URL = () => process.env.APP_URL ?? "http://localhost:3000";
const callbackUrl = (p: OAuthProvider) => `${APP_URL()}/oauth/${p}/callback`;

// ── Google ─────────────────────────────────────────────────────────────────

export function googleAuthUrl(state: string, codeChallenge: string): string {
  return "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: callbackUrl("google"),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
}

export async function googleExchangeCode(code: string, codeVerifier: string): Promise<OAuthUserInfo> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: callbackUrl("google"),
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Google token exchange failed: ${tokenRes.status}`);
  const tokens = await tokenRes.json() as TokenResponse;

  // Decode ID token payload (we trust Google's token endpoint — no need to verify signature here)
  if (tokens.id_token) {
    const parts = tokens.id_token.split(".");
    if (parts.length === 3) {
      try {
        const p = JSON.parse(fromB64url(parts[1]).toString("utf8")) as {
          email?: string; name?: string; picture?: string;
        };
        if (p.email) return { email: p.email, name: p.name, avatarUrl: p.picture };
      } catch { /* fall through to userinfo */ }
    }
  }

  // Fallback: userinfo endpoint
  const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!infoRes.ok) throw new Error("Failed to fetch Google userinfo");
  const info = await infoRes.json() as { email?: string; name?: string; picture?: string };
  if (!info.email) throw new Error("No email from Google");
  return { email: info.email, name: info.name, avatarUrl: info.picture };
}

// ── GitHub ─────────────────────────────────────────────────────────────────

export function githubAuthUrl(state: string): string {
  return "https://github.com/login/oauth/authorize?" + new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID ?? "",
    redirect_uri: callbackUrl("github"),
    scope: "read:user user:email",
    state,
  });
}

export async function githubExchangeCode(code: string): Promise<OAuthUserInfo> {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GITHUB_CLIENT_ID ?? "",
      client_secret: process.env.GITHUB_CLIENT_SECRET ?? "",
      redirect_uri: callbackUrl("github"),
    }),
  });
  if (!tokenRes.ok) throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
  const tokens = await tokenRes.json() as TokenResponse;

  const headers = { Authorization: `Bearer ${tokens.access_token}`, Accept: "application/vnd.github+json" };
  const [userRes, emailsRes] = await Promise.all([
    fetch("https://api.github.com/user", { headers }),
    fetch("https://api.github.com/user/emails", { headers }),
  ]);
  if (!userRes.ok) throw new Error("Failed to fetch GitHub user");
  const user = await userRes.json() as { login?: string; name?: string; email?: string; avatar_url?: string };

  let email = user.email;
  if (!email && emailsRes.ok) {
    const emails = await emailsRes.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
    email = emails.find((e) => e.primary && e.verified)?.email
      ?? emails.find((e) => e.verified)?.email;
  }
  if (!email) throw new Error("No verified email from GitHub");
  return { email, name: user.name ?? user.login, avatarUrl: user.avatar_url };
}

// ── Apple ──────────────────────────────────────────────────────────────────
// Requires: APPLE_CLIENT_ID (Services ID), APPLE_TEAM_ID, APPLE_KEY_ID,
//           APPLE_PRIVATE_KEY (PEM with literal \n for newlines)

function buildAppleClientSecret(): string {
  const { APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } = process.env;
  if (!APPLE_CLIENT_ID || !APPLE_TEAM_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY) {
    throw new Error("Apple OAuth env vars not configured");
  }
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(Buffer.from(JSON.stringify({ alg: "ES256", kid: APPLE_KEY_ID })));
  const payload = b64url(Buffer.from(JSON.stringify({
    iss: APPLE_TEAM_ID, iat: now, exp: now + 3600,
    aud: "https://appleid.apple.com", sub: APPLE_CLIENT_ID,
  })));
  const signingInput = `${header}.${payload}`;
  const pem = APPLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const sig = b64url(createSign("SHA256").update(signingInput).sign({ key: pem, dsaEncoding: "ieee-p1363" }));
  return `${signingInput}.${sig}`;
}

export function appleAuthUrl(state: string): string {
  return "https://appleid.apple.com/auth/authorize?" + new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID ?? "",
    redirect_uri: callbackUrl("apple"),
    response_type: "code",
    scope: "email",
    state,
    response_mode: "query",
  });
}

export async function appleExchangeCode(code: string): Promise<OAuthUserInfo> {
  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.APPLE_CLIENT_ID ?? "",
      client_secret: buildAppleClientSecret(),
      redirect_uri: callbackUrl("apple"),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) throw new Error(`Apple token exchange failed: ${tokenRes.status}`);
  const tokens = await tokenRes.json() as TokenResponse;

  if (!tokens.id_token) throw new Error("No id_token from Apple");
  const parts = tokens.id_token.split(".");
  if (parts.length !== 3) throw new Error("Malformed Apple id_token");
  const p = JSON.parse(fromB64url(parts[1]).toString("utf8")) as { email?: string };
  if (!p.email) throw new Error("No email in Apple id_token");
  return { email: p.email };
}
