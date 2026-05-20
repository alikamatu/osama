import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { TodayBoard } from "@/components/today/today-board";

function greetingFor(date: Date, tz: string): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(date),
  );
  if (hour < 5)  return "Up late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
}

export default async function TodayPage() {
  const session = await getSession();
  if (!session) redirect("/signin");

  const tz = session.timezone || "UTC";
  const now = new Date();
  const greeting = `${greetingFor(now, tz)}${session.name ? `, ${session.name.split(" ")[0]}` : ""}.`;
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric", timeZone: tz,
  }).format(now);

  return <TodayBoard greeting={greeting} date={date} />;
}
