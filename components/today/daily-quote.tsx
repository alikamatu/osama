"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote as QuoteIcon, Copy, Check } from "lucide-react";
import { quoteForDate, type Quote } from "@/lib/quotes/daily";
import { cn } from "@/lib/utils/cn";

export function DailyQuote({ timezone }: { timezone?: string }) {
  // Compute on the client so we don't ship a mismatched server timezone.
  const [quote, setQuote] = useState<Quote | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setQuote(quoteForDate(new Date(), tz));
  }, [timezone]);

  if (!quote) {
    return <div className="h-[88px] animate-pulse rounded-2xl bg-surface-1" aria-hidden="true" />;
  }

  function handleCopy() {
    if (!quote) return;
    const textToCopy = `"${quote.text}"${quote.author ? ` — ${quote.author}` : ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.figure
      key={quote.text}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-surface-1 p-4 sm:p-5 group"
    >
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, rotate: -12, scale: 0.6 }}
        animate={{ opacity: 0.18, rotate: -8, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -right-2 -top-2 text-accent"
      >
        <QuoteIcon size={56} strokeWidth={1.25} />
      </motion.span>

      <button
        onClick={handleCopy}
        aria-label="Copy quote"
        title="Copy quote"
        className={cn(
          "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md bg-surface-2/60 backdrop-blur-sm text-fg-subtle transition-all duration-200 hover:bg-surface-3 hover:text-fg opacity-0 group-hover:opacity-100",
          copied && "opacity-100 text-accent hover:text-accent"
        )}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check size={14} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy size={14} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
          Daily
        </span>
        <motion.blockquote
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 max-w-[52ch] text-[15.5px] font-medium leading-snug text-fg sm:text-[16px] pr-8"
        >
          <Reveal text={quote.text} />
        </motion.blockquote>
        {quote.author && (
          <motion.figcaption
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.45 + Math.min(0.02 * quote.text.length, 0.6) }}
            className="mt-2 text-[12px] text-fg-subtle"
          >
            — {quote.author}
          </motion.figcaption>
        )}
      </div>
    </motion.figure>
  );
}

/**
 * Word-by-word reveal — soft stagger, respects reduced motion via globals.css.
 */
function Reveal({ text }: { text: string }) {
  const words = text.split(/(\s+)/);
  return (
    <>
      {words.map((w, i) => {
        const isSpace = /^\s+$/.test(w);
        if (isSpace) return <span key={i}>{w}</span>;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.34,
              delay: 0.14 + i * 0.018,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        );
      })}
    </>
  );
}
