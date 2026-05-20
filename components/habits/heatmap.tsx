"use client";

import { format } from "date-fns";
import type { Habit } from "@/types/entities";
import { buildYearGrid } from "@/lib/domain/habits";

const CELL = 10;
const GAP = 2;

export function HabitHeatmap({ habit }: { habit: Habit }) {
  const cells = buildYearGrid(habit);
  const weeks = cells.length / 7;
  const width = weeks * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {cells.map((c, i) => {
          if (!c) return null;
          const col = Math.floor(i / 7);
          const row = i % 7;
          return (
            <rect
              key={c.ymd}
              x={col * (CELL + GAP)}
              y={row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill={c.done ? "var(--accent)" : "var(--surface-2)"}
              opacity={c.done ? 0.95 : 0.85}
            >
              <title>{`${format(c.date, "EEE, MMM d, yyyy")} — ${c.done ? "done" : "missed"}`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
