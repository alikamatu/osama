import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="mx-auto flex h-16 w-full max-w-3xl items-center px-6">
        <Link href="/"><Logo size={24} withWordmark /></Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
