import * as z from "zod/v4";

export const GroupSchema = z.object({
    group_name: z.string()
});

export type GroupDto = z.infer<typeof GroupSchema>;