"use client";

import { Building2, MessageSquare, PenTool, School } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { ErrorMessage } from "../error";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function LeaderboardContent() {
  return (
    <ErrorBoundary
      fallback={
        <ErrorMessage
          title="Failed to load leaderboard"
          description="Please try refreshing the page."
        />
      }
    >
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardInner />
      </Suspense>
    </ErrorBoundary>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-64" />
      ))}
    </div>
  );
}

function LeaderboardInner() {
  const [collegeByAnswers] =
    trpc.leaderboard.getCollegeByAnswers.useSuspenseQuery();
  const [collegeByComments] =
    trpc.leaderboard.getCollegeByComments.useSuspenseQuery();
  const [partByAnswers] = trpc.leaderboard.getPartByAnswers.useSuspenseQuery();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <LeaderboardCard
        title="Questions by College"
        icon={<Building2 className="h-4 w-4" />}
        entries={collegeByAnswers.map((r) => ({
          label: r.college,
          value: r.total
        }))}
        unit="answers"
      />
      <LeaderboardCard
        title="Comments by College"
        icon={<MessageSquare className="h-4 w-4" />}
        entries={collegeByComments.map((r) => ({
          label: r.college,
          value: r.total
        }))}
        unit="comments"
      />
      <LeaderboardCard
        title="Questions by Year"
        icon={<School className="h-4 w-4" />}
        entries={partByAnswers.map((r) => ({
          label: r.partName,
          value: r.total
        }))}
        unit="answers"
      />
    </div>
  );
}

function LeaderboardCard({
  title,
  icon,
  entries,
  unit
}: {
  title: string;
  icon: React.ReactNode;
  entries: { label: string; value: number }[];
  unit: string;
}) {
  const maxValue = entries[0]?.value ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No data yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {entries.map((entry, i) => (
              <div key={entry.label} className="flex items-center gap-3">
                <span className="w-5 text-right font-mono text-muted-foreground text-xs">
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm">{entry.label}</span>
                    <span className="shrink-0 font-mono text-muted-foreground text-xs">
                      {entry.value} {unit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${maxValue > 0 ? (entry.value / maxValue) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
