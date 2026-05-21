"use client";

import { useEffect, useState } from "react";
import { Newspaper, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Article = {
  title: string;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
};

export function NewsWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchNews() {
    try {
      setLoading(true);
      setError(false);
      // Fetching from a free NewsAPI mirror that doesn't require an API key.
      const res = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json");
      const data = await res.json();
      
      if (data.status === "ok" && data.articles) {
        // Filter out articles with removed titles/urls
        const validArticles = data.articles
          .filter((a: Article) => a.title && a.url && !a.title.includes("[Removed]"))
          .slice(0, 4);
        setArticles(validArticles);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="rounded-2xl bg-surface-1 p-5 shadow-sm border border-surface-2">
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper size={16} strokeWidth={2} className="text-accent" />
          <h2 className="text-[15px] font-semibold text-fg">Top Stories</h2>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="grid h-7 w-7 place-items-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCcw size={13} strokeWidth={2.5} className={cn(loading && "animate-spin")} />
        </button>
      </div>

      {loading && articles.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-surface-2" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-4 text-center text-[13px] text-fg-muted">Failed to load news.</div>
      ) : (
        <ul className="space-y-3">
          {articles.map((article, i) => {
            const timeAgo = new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <motion.li
                key={article.url}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-surface-2"
                >
                  {article.urlToImage ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-surface-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.urlToImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-surface-2 border border-surface-3 text-fg-subtle">
                      <Newspaper size={18} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <span className="text-[13px] font-medium leading-snug text-fg line-clamp-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </span>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-fg-subtle">
                      <span className="truncate max-w-[120px]">{article.source.name}</span>
                      <span>·</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </a>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
