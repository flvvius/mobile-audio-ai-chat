// This schema defines tables for the audio summarization and chat app
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Stores metadata about audio recordings
  recordings: defineTable({
    id: v.optional(v.id("recordings")),
    // Human-friendly name for the recording
    name: v.optional(v.string()),
    audioUrl: v.string(),
    createdAt: v.number(),
    duration: v.number(),
  }),
  // Stores the transcription text for a recording
  transcriptions: defineTable({
    id: v.optional(v.id("transcriptions")),
    recordingId: v.id("recordings"),
    text: v.string(),
    createdAt: v.number(),
  }),
  // Stores the summary generated for a transcription
  summaries: defineTable({
    id: v.optional(v.id("summaries")),
    transcriptionId: v.id("transcriptions"),
    summary: v.string(),
    createdAt: v.number(),
  }),
  // Stores chat messages for follow-up questions and AI responses
  chatMessages: defineTable({
    id: v.optional(v.id("chatMessages")),
    transcriptionId: v.id("transcriptions"),
    sender: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }),
});
