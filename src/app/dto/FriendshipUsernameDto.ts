import * as z from "zod/v4";

export const FriendshipUsernameSchema = z.object({
    username: z.string(),
});

export type FriendshipUsernameDto = z.infer<typeof FriendshipUsernameSchema>;