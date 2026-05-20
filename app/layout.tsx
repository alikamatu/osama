import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Osama — Your personal assistant",
  description:
    "Daily tasks, habit streaks, goal tracking, and AI-assisted planning.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "Osama", statusBarStyle: "black-translucent" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#16181f" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
  ],
};

const themeBootstrap = `
(function(){try{var t=localStorage.getItem("osama:theme");if(!t){t="obsidian";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="obsidian";}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="obsidian"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full bg-bg text-fg">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
