"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Provider = "google" | "github" | "apple";

const labels: Record<Provider, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
  apple:  "Continue with Apple",
};

function ProviderIcon({ provider }: { provider: Provider }) {
  switch (provider) {
    case "google":
      return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 12.5 24 12.5c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.7 13.2-4.6l-6.1-5.1C29.1 35.2 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.5 39.1 16.2 43.5 24 43.5z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.1 5.1C40.7 35.6 43.5 30.2 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
        </svg>
      );
    case "github":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.05 1.79 2.75 1.27 3.42.97.1-.76.4-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>
        </svg>
      );
    case "apple":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.37 1.43c.06 1.2-.42 2.39-1.18 3.24-.78.88-2.07 1.55-3.23 1.46-.13-1.18.46-2.4 1.2-3.16.83-.86 2.21-1.5 3.21-1.54zM20.5 17.3c-.55 1.28-1.21 2.55-2.21 3.66-.86.94-1.91 2.04-3.26 2.05-1.31.01-1.69-.85-3.47-.84-1.78.01-2.21.85-3.52.83-1.34-.01-2.36-1.03-3.21-1.96-1.78-1.95-3.13-5.5-1.32-7.9.91-1.2 2.54-1.96 4.04-1.98 1.31-.03 2.54.88 3.47.88.93 0 2.45-1.08 4.13-.92.7.03 2.69.28 3.97 2.13-.1.06-2.37 1.39-2.35 4.11.03 3.26 2.85 4.35 2.93 4.39z"/>
        </svg>
      );
  }
}

export function ProviderButton({
  provider,
  onClick,
  className,
  disabled,
}: {
  provider: Provider;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      leadingIcon={<ProviderIcon provider={provider} />}
      className={cn("w-full justify-center font-medium", className)}
    >
      {labels[provider]}
    </Button>
  );
}
