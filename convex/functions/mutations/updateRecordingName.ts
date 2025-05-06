import { v } from "convex/values";
import { mutation, MutationCtx } from "../../_generated/server";

export const updateRecordingName = mutation({
  args: {
    recordingId: v.id("recordings"),
    name: v.string(),
  },
  handler: async (ctx: MutationCtx, { recordingId, name }) => {
    const { db } = ctx;
    await db.patch(recordingId, { name });
    return null;
  },
});
