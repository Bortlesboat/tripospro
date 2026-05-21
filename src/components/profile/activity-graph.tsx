"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";

export function ActivityGraph({ crsid }: { crsid: string }) {
  const { data } = trpc.user.getActivityGraph.useQuery({ crsid });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (!data || data.length === 0) return null;

  const years = Array.from(
    new Set(data.map((d) => new Date(d.date).getFullYear()))
  ).sort((a, b) => b - a);

  if (years.length === 0) return null;

  const activityMap = new Map<string, number>();
  for (const d of data) {
    activityMap.set(d.date, d.count);
  }

  const weeks = buildWeeks(selectedYear);
  const maxCount = Math.max(
    ...data
      .filter((d) => new Date(d.date).getFullYear() === selectedYear)
      .map((d) => d.count),
    1
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Activity</CardTitle>
          <div className="flex gap-1">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs transition-colors",
                  year === selectedYear
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider delayDuration={0}>
            <div className="inline-grid grid-flow-col grid-rows-7 gap-[3px]">
              {weeks.flat().map((day, i) => {
                if (!day) {
                  return <div key={`empty-${i}`} className="h-[11px] w-[11px] bg-transparent" />;
                }
                const count = activityMap.get(day) ?? 0;
                return (
                  <Tooltip key={day}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "h-[11px] w-[11px] rounded-[2px]",
                          getColor(count, maxCount)
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {count} answer{count !== 1 ? "s" : ""} on{" "}
                        {formatDate(day)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
        <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-[11px] w-[11px] rounded-[2px] bg-muted" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-green-900/40" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-green-700/60" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-green-500/80" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-green-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

function buildWeeks(year: number): (string | null)[][] {
  const today = new Date();
  const start = new Date(year, 0, 1);
  const end =
    year === today.getFullYear() ? today : new Date(year, 11, 31);

  const weeks: (string | null)[][] = [];

  // Find the Sunday on or before Jan 1
  const firstSunday = new Date(start);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  const cursor = new Date(firstSunday);
  while (cursor <= end) {
    const week: (string | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if (cursor >= start && cursor <= end) {
        const y = cursor.getFullYear();
        const m = String(cursor.getMonth() + 1).padStart(2, "0");
        const day = String(cursor.getDate()).padStart(2, "0");
        week.push(`${y}-${m}-${day}`);
      } else {
        week.push(null);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function getColor(count: number, maxCount: number): string {
  if (count === 0) return "bg-muted";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "bg-green-900/40";
  if (ratio <= 0.5) return "bg-green-700/60";
  if (ratio <= 0.75) return "bg-green-500/80";
  return "bg-green-400";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
