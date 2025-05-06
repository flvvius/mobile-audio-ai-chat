import { Doc } from "../../_generated/dataModel";
import { query, QueryCtx } from "../../_generated/server";

export const listRecordings = query({
  handler: async ({ db }: QueryCtx) => {
    // Return all recordings, sorted by creation time descending
    const allRecordings = await db.query("recordings").collect();
    return allRecordings.sort(
      (a: Doc<"recordings">, b: Doc<"recordings">) => b.createdAt - a.createdAt
    );
  },
});
