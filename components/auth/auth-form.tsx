"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { ProviderButton } from "./provider-button";
import { cn } from "@/lib/utils/cn";
import { sendMagicLink } from "@/app/(auth)/signin/actions";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    startTransition(async () => {
      const res = await sendMagicLink({ email, name: name || undefined, mode });
      if (res.ok) {
        router.push(`/verify-request?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="w-full max-w-[420px]">
      <Tabs mode={mode} onChange={(m) => { setMode(m); setError(null); }} />

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {(
            <motion.form
              key={mode}
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              {mode === "signup" && (
                <Input
                  label="Full name"
                  leadingIcon={<User size={16} strokeWidth={1.75} />}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                label="Email address"
                leadingIcon={<Mail size={16} strokeWidth={1.75} />}
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error ?? undefined}
                required
              />

              <Button
                type="submit"
                size="lg"
                loading={pending}
                trailingIcon={!pending && <ArrowRight size={16} strokeWidth={2} />}
                className="w-full"
              >
                {mode === "signin" ? "Continue with email" : "Create account"}
              </Button>

              <p className="pt-1 text-center text-[12px] text-fg-subtle">
                We&apos;ll email you a secure sign-in link — no password needed.
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="my-6">
          <Divider label="or" />
        </div>

        <div className="space-y-2.5">
          <ProviderButton provider="google" onClick={() => { window.location.href = "/oauth/google"; }} />
          <ProviderButton provider="github" onClick={() => { window.location.href = "/oauth/github"; }} />
          <ProviderButton provider="apple" onClick={() => { window.location.href = "/oauth/apple"; }} />
        </div>

        <p className="mt-8 text-center text-[12px] leading-relaxed text-fg-subtle">
          By continuing you agree to our{" "}
          <a href="#" className="text-fg-muted hover:text-fg">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-fg-muted hover:text-fg">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

function Tabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="relative inline-flex rounded-full bg-surface-1 p-1" role="tablist">
      {(["signin", "signup"] as const).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className={cn(
              "relative z-10 h-9 px-5 rounded-full text-[13px] font-medium",
              "transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              active ? "text-accent-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-tab-active"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        );
      })}
    </div>
  );
}
