import { v } from "convex/values";
import { Doc } from "../../_generated/dataModel";
import { query, QueryCtx } from "../../_generated/server";

export const getRecordingById = query({
  args: { recordingId: v.id("recordings") },
  handler: async (
    { db }: QueryCtx,
    { recordingId }
  ): Promise<Doc<"recordings"> | null> => {
    return await db.get(recordingId);
  },
});
