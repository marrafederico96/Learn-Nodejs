import * as z from "zod/v4";
import { MemberRole } from "../models/groupMemberModel";

export const GroupMemberSchema = z.object({
    group_id: z.number(),
    user_id: z.number(),
    member_role: z.enum(MemberRole),
    join_date: z.date()
});

export const GroupMemberCreateSchema = z.object({
    group_name: z.string().min(1, "Group name is required"),
    username: z.string().min(1, "username is required")

})

export type GroupMemberDto = z.infer<typeof GroupMemberSchema>;
export type GroupMemberCreateDto = z.infer<typeof GroupMemberCreateSchema>