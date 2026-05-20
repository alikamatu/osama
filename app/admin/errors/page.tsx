import { AlertTriangle } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";

export default function Page() {
  return <ComingSoon icon={AlertTriangle} title="Error log" blurb="Server and client errors with stack traces, deduped by signature, with user breadcrumbs." eta="With observability layer" />;
}
