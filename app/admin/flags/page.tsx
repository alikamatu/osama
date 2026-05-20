import { ToggleRight } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";

export default function Page() {
  return <ComingSoon icon={ToggleRight} title="Feature flags" blurb="Per-feature kill switches and gradual rollouts. Per-user overrides for testing." eta="With data layer" />;
}
