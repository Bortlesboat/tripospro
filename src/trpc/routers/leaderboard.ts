import { count, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { commentTable } from "@/db/schema/comment";
import { paperYearTable } from "@/db/schema/paper";
import { questionTable } from "@/db/schema/question";
import { triposPartTable, triposPartYearTable } from "@/db/schema/tripos";
import { userQuestionAnswerTable, userSettingsTable, usersTable } from "@/db/schema/user";
import { baseProcedure, createTRPCRouter } from "../init";

export const leaderboardRouter = createTRPCRouter({
  getCollegeByAnswers: baseProcedure.query(async () => {
    const results = await db
      .select({
        college: usersTable.college,
        total: count(userQuestionAnswerTable.id)
      })
      .from(userQuestionAnswerTable)
      .innerJoin(usersTable, eq(userQuestionAnswerTable.userId, usersTable.id))
      .where(isNotNull(usersTable.college))
      .groupBy(usersTable.college)
      .orderBy(sql`count(${userQuestionAnswerTable.id}) desc`);

    return results as { college: string; total: number }[];
  }),

  getCollegeByComments: baseProcedure.query(async () => {
    const results = await db
      .select({
        college: usersTable.college,
        total: count(commentTable.id)
      })
      .from(commentTable)
      .innerJoin(usersTable, eq(commentTable.authorId, usersTable.id))
      .where(isNotNull(usersTable.college))
      .groupBy(usersTable.college)
      .orderBy(sql`count(${commentTable.id}) desc`);

    return results as { college: string; total: number }[];
  }),

  getPartByAnswers: baseProcedure.query(async () => {
    const results = await db
      .select({
        partName: triposPartTable.name,
        partCode: triposPartTable.code,
        total: count(userQuestionAnswerTable.id)
      })
      .from(userQuestionAnswerTable)
      .innerJoin(usersTable, eq(userQuestionAnswerTable.userId, usersTable.id))
      .innerJoin(userSettingsTable, eq(userSettingsTable.userId, usersTable.id))
      .innerJoin(
        triposPartTable,
        eq(userSettingsTable.triposPartId, triposPartTable.id)
      )
      .innerJoin(
        questionTable,
        eq(userQuestionAnswerTable.questionId, questionTable.id)
      )
      .innerJoin(paperYearTable, eq(questionTable.paperYearId, paperYearTable.id))
      .innerJoin(
        triposPartYearTable,
        eq(paperYearTable.triposPartYearId, triposPartYearTable.id)
      )
      .where(eq(userSettingsTable.triposPartId, triposPartYearTable.triposPartId))
      .groupBy(triposPartTable.name, triposPartTable.code)
      .orderBy(sql`count(${userQuestionAnswerTable.id}) desc`);

    return results;
  })
});
