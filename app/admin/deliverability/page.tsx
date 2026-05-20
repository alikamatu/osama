import { Mail } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";

export default function Page() {
  return <ComingSoon icon={Mail} title="Email deliverability" blurb="Resend events: sends, bounces, complaints. Per-template open and click rates." eta="With Resend webhooks" />;
}
