import { z } from "zod";
export const UVISchema = z.object({
    description: z.string().min(1),
    category: z.string().optional(),
    impact: z.string().optional(),
});
export const OpenAIResponseSchema = z.object({
    improvements: z.array(UVISchema),
});
