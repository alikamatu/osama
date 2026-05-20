import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) throw new Error("RESEND_API_KEY is not set");

export const resend = new Resend(apiKey);
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Osama <noreply@allmaphostels.com>";
