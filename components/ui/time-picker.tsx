"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { Popover } from "./popover";
import { cn } from "@/lib/utils/cn";

/** value is "HH:MM" in 24-hour. */
export function TimePicker({
  value, onChange, placeholder = "Pick a time", step = 5, allowClear = true, className,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  placeholder?: string;
  step?: 1 | 5 | 10 | 15 | 30;
  allowClear?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const parsed = parse(value);
  const [hour, setHour] = useState<number>(parsed?.h ?? 9);
  const [minute, setMinute] = useState<number>(parsed?.m ?? 0);

  // Keep internal state in sync with prop.
  useEffect(() => {
    const p = parse(value);
    if (p) { setHour(p.h); setMinute(p.m); }
  }, [value]);

  const minutes = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 60; i += step) out.push(i);
    return out;
  }, [step]);

  function commit(h: number, m: number) {
    const v = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange(v);
  }

  function pick() {
    commit(hour, minute);
    setOpen(false);
  }

  const display = value ? format12(value) : "";

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md bg-transparent px-2 text-left text-[13px] outline-none",
          "transition-colors hover:bg-surface-2",
          className,
        )}
      >
        <Clock size={13} strokeWidth={1.75} className="text-fg-subtle" />
        <span className={cn("flex-1 truncate", value ? "text-fg font-mono tabular-nums" : "text-fg-subtle")}>
          {display || placeholder}
        </span>
        {allowClear && value && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear time"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onChange(null); } }}
            className="grid h-5 w-5 place-items-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-fg"
          >
            <X size={11} strokeWidth={2.25} />
          </span>
        )}
      </button>

      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef.current} align="start">
        <div className="w-[240px] p-3">
          <div className="grid grid-cols-2 gap-2">
            <Column
              label="Hour"
              values={Array.from({ length: 24 }, (_, i) => i)}
              format={(n) => String(n).padStart(2, "0")}
              selected={hour}
              onSelect={(n) => setHour(n)}
            />
            <Column
              label="Minute"
              values={minutes}
              format={(n) => String(n).padStart(2, "0")}
              selected={minute}
              onSelect={(n) => setMinute(n)}
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="rounded-md px-2 py-1 text-[11.5px] font-medium text-fg-subtle hover:bg-surface-3 hover:text-fg"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={pick}
              className="rounded-md bg-accent px-2.5 py-1 text-[11.5px] font-semibold text-accent-fg"
            >
              Set {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
}

function Column({
  label, values, format, selected, onSelect,
}: {
  label: string;
  values: number[];
  format: (n: number) => string;
  selected: number;
  onSelect: (n: number) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-v="${selected}"]`);
    el?.scrollIntoView({ block: "center" });
  }, [selected]);

  return (
    <div>
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</div>
      <ul
        ref={listRef}
        className="h-[164px] overflow-y-auto rounded-md bg-surface-3 p-1"
      >
        {values.map((v) => {
          const active = v === selected;
          return (
            <li key={v}>
              <button
                data-v={v}
                type="button"
                onClick={() => onSelect(v)}
                aria-pressed={active}
                className={cn(
                  "flex h-7 w-full items-center justify-center rounded-md font-mono text-[12.5px] tabular-nums",
                  active ? "bg-accent text-accent-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                {format(v)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function parse(v: string | null): { h: number; m: number } | null {
  if (!v) return null;
  const [hh, mm] = v.split(":");
  const h = Number(hh); const m = Number(mm);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return { h: Math.max(0, Math.min(23, h)), m: Math.max(0, Math.min(59, m)) };
}

function format12(v: string): string {
  const p = parse(v); if (!p) return v;
  return `${String(p.h).padStart(2, "0")}:${String(p.m).padStart(2, "0")}`;
}
