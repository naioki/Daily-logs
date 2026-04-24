import { z } from "zod";

export const insightsSchema = z.object({
  patterns: z.array(z.string()).describe("Recurring cognitive or behavioral patterns"),
  blind_spots: z.array(z.string()).describe("Areas of limited self-awareness"),
  cognitive_gaps: z.array(z.string()).describe("Inconsistencies or gaps in reasoning"),
  summary: z.string().describe("2-3 sentence synthesis of the analysis"),
});

export type InsightsSchema = z.infer<typeof insightsSchema>;
