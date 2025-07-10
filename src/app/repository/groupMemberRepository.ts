import sql from "../../db";
import { GroupMemberDto } from "../dto/GroupMemberDto";

export class GroupMemberRepository {

    async addMember(group_member_info: GroupMemberDto) {
        await sql`INSERT INTO group_members (member_role, join_date, user_id, group_id) 
        VALUES (${group_member_info.member_role}, ${group_member_info.join_date}, ${group_member_info.user_id}, ${group_member_info.group_id})`;
    }

}