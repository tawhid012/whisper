import { z } from "zod";

// Message schema for Whispr
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
});

export const insertMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000, "Message is too long (max 5000 characters)"),
});

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
