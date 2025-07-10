import { RequestState } from "../models/frindshipRequestState"
import * as z from "zod/v4";

export const FriendshipSchema = z.object({
    user_sender_id: z.number(),
    user_receive_id: z.number(),
    request_date: z.date(),
    request_state: z.enum(RequestState)
});

export const FriendshipUsernameSchema = z.object({
    username: z.string(),
});

export type FriendshipUsernameDto = z.infer<typeof FriendshipUsernameSchema>;
export type FriendshipDto = z.infer<typeof FriendshipSchema>;
