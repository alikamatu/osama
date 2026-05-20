import "server-only";

export function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
}

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().has(email.toLowerCase());
}
