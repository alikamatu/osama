"use client";

/**
 * Minimal markdown renderer — headings, lists, links, code, bold/italic, hr, paragraphs.
 * Production-fine for our note bodies. Swap to react-markdown if richer needs arrive.
 */
import { useMemo } from "react";

export function Markdown({ source }: { source: string }) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  return <div className="prose-cairn" dangerouslySetInnerHTML={{ __html: html }} />;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string) {
  return escape(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(src: string): string {
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) { out.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue; }
    if (line.startsWith("## "))  { out.push(`<h2>${inline(line.slice(3))}</h2>`); i++; continue; }
    if (line.startsWith("# "))   { out.push(`<h1>${inline(line.slice(2))}</h1>`); i++; continue; }
    if (/^---+$/.test(line))     { out.push("<hr/>"); i++; continue; }

    if (line.startsWith("```")) {
      i++;
      const buf: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]); i++;
      }
      i++;
      out.push(`<pre><code>${escape(buf.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${buf.join("")}</ul>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${buf.join("")}</ol>`);
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    // paragraph — gather until blank line
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !/^\s*[-*\d]+[\.\s]/.test(lines[i])) {
      buf.push(inline(lines[i]));
      i++;
    }
    if (buf.length) out.push(`<p>${buf.join(" ")}</p>`);
  }
  return out.join("\n");
}
