import * as z from "zod/v4"

export const UsernameSchema = z.object({
    username: z.string(),
});

export type UsernameDto = z.infer<typeof UsernameSchema> 