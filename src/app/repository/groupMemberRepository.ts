import sql from "../../db";
import { GroupMemberDto } from "../dto/GroupMemberDto";
import { GroupMemberModel } from "../models/groupMemberModel";
import { GroupModel } from "../models/groupModel";
import { UserModel } from "../models/userModel";

export class GroupMemberRepository {

    async addMember(group_member_info: GroupMemberDto) {
        await sql`INSERT INTO group_members (member_role, join_date, user_id, group_id) 
        VALUES (${group_member_info.member_role}, ${group_member_info.join_date}, ${group_member_info.user_id}, ${group_member_info.group_id})`;
    }

    async findGroupWithRoleAdmin(user: UserModel): Promise<GroupMemberModel[]> {
        const result: GroupMemberModel[] = await sql`SELECT * FROM group_members WHERE member_role='ADMIN' AND user_id=${user.user_id}`;
        return result;
    }

    async removeGroupMember(user: UserModel, group: GroupModel) {
        await sql`DELETE FROM group_members WHERE user_id=${user.user_id} AND group_id=${group.group_id} AND member_role='MEMBER'`;
    }

}