import { v } from "convex/values";
import { mutation, MutationCtx } from "../../_generated/server";

export const createRecording = mutation({
  args: {
    audioUrl: v.string(),
    duration: v.number(),
    name: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, { audioUrl, duration, name }) => {
    const { db } = ctx;
    // Generate a default sequential name based on existing recordings count
    if (!name) {
      const allRecs = await db.query("recordings").collect();
      const count = allRecs.length;
      name = `Recording ${count + 1}`;
    }
    return await db.insert("recordings", {
      audioUrl,
      duration,
      createdAt: Date.now(),
      name,
    } as any);
  },
});
