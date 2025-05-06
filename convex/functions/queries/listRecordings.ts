import { query, QueryCtx } from "../../_generated/server";

export const listRecordings = query({
  handler: async ({ db }: QueryCtx) => {
    // Return all recordings
    return await db.query("recordings").collect();
  },
});
