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
  const maxCount = Math.max(...data.map((d) => d.count), 1);

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
          <div className="flex gap-[3px]">
            <TooltipProvider delayDuration={0}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const count = day ? activityMap.get(day) ?? 0 : 0;
                    return (
                      <Tooltip key={day || `empty-${wi}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-[11px] w-[11px] rounded-[2px]",
                              day ? getColor(count, maxCount) : "bg-transparent"
                            )}
                          />
                        </TooltipTrigger>
                        {day && (
                          <TooltipContent>
                            <p className="text-xs">
                              {count} answer{count !== 1 ? "s" : ""} on{" "}
                              {formatDate(day)}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-[11px] w-[11px] rounded-[2px] bg-muted" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary/20" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary/40" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary/70" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}

function buildWeeks(year: number): (string | null)[][] {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const today = new Date();

  const startDay = start.getDay();
  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    currentWeek.push(null);
  }

  const cursor = new Date(start);
  while (cursor <= end && cursor <= today) {
    const dateStr = cursor.toISOString().split("T")[0];
    currentWeek.push(dateStr);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function getColor(count: number, maxCount: number): string {
  if (count === 0) return "bg-muted";
  const ratio = count / maxCount;
  if (ratio <= 0.25) return "bg-primary/20";
  if (ratio <= 0.5) return "bg-primary/40";
  if (ratio <= 0.75) return "bg-primary/70";
  return "bg-primary";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
