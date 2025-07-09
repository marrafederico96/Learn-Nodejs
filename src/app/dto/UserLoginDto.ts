import * as z from "zod/v4"

export const UserLoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type UserLoginDto = z.infer<typeof UserLoginSchema> 