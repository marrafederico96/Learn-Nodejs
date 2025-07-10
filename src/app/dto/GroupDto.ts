import * as z from "zod/v4";

export const GroupSchema = z.object({
    group_name: z.string().min(1, "Group Name is required"),
    admin_id: z.number()
});

export const GroupNameSchema = z.object({
    group_name: z.string().min(1, "Group Name is required"),
    admin_id: z.number()
});

export const GroupDeleteSchema = z.object({
    group_name: z.string().min(1, "Group Name is required"),
})

export type GroupDto = z.infer<typeof GroupSchema>;
export type GroupNameDto = z.infer<typeof GroupNameSchema>;
export type GroupDelleteDto = z.infer<typeof GroupDeleteSchema>;