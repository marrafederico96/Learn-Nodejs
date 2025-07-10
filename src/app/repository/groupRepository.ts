import sql from "../../db";
import { GroupDto } from "../dto/GroupDto";
import { GroupException } from "../exceptions/groupException";
import { UserException } from "../exceptions/UserException";
import { GroupModel } from "../models/groupModel";
import { UserModel } from "../models/userModel";
import { UserRepository } from "./userRepository";

export class GroupRepository {
    private userRepository = new UserRepository();

    async createGroup(admin_id: number, group_name: string) {
        await sql`INSERT INTO groups (group_name, admin_id) VALUES (${group_name}, ${admin_id})`;
    }

    async deleteGroup(group: GroupModel) {
        const result = await sql`DELETE FROM groups WHERE group_id=${group.group_id}`;
    }

    async findGroupByName(group_name: string): Promise<GroupModel | null> {
        const result: GroupModel[] = await sql`SELECT * FROM groups WHERE group_name=${group_name}`;

        if (result.length === 0) {
            throw new GroupException("Group not found");
        }

        const groupModel: GroupModel = {
            group_id: result[0].group_id,
            group_name: result[0].group_name,
            admin_id: result[0].admin_id
        }
        return groupModel;
    }

    async findGroupByGroupNameAndAdminId(user: UserModel, group_name: string): Promise<GroupModel | null> {
        const result: GroupModel[] = await sql`SELECT * FROM groups WHERE group_name=${group_name} AND admin_id=${user.user_id}`;

        if (result.length === 0) {
            throw new GroupException("Group not found");
        }

        const groupModel: GroupModel = {
            group_id: result[0].group_id,
            group_name: result[0].group_name,
            admin_id: result[0].admin_id
        }
        return groupModel;
    }
}