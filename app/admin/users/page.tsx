import { Users } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";

export default function Page() {
  return <ComingSoon icon={Users} title="Users" blurb="Search any user by email, inspect sessions, impersonate, and force sign-out." eta="With data layer" />;
}
