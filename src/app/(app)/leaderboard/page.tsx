import { PageLayout } from "@/components/layout/page-layout";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";
import { HydrateClient, trpc } from "@/trpc/server";

export default function LeaderboardPage() {
  trpc.leaderboard.getCollegeByAnswers.prefetch();
  trpc.leaderboard.getCollegeByComments.prefetch();
  trpc.leaderboard.getPartByAnswers.prefetch();

  return (
    <PageLayout header={<h1>Leaderboard</h1>}>
      <HydrateClient>
        <LeaderboardContent />
      </HydrateClient>
    </PageLayout>
  );
}
