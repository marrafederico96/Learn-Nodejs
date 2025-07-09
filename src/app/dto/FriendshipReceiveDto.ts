import * as z from "zod/v4";

export const FriendshipReceiveSchema = z.object({
    username_receive: z.string(),
});

export type FriendshipReceiveDto = z.infer<typeof FriendshipReceiveSchema>;