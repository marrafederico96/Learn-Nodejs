import sql from "../../db";
import { GroupDto } from "../dto/GroupDto";

export class GroupRepository {

    async createGroup(group: GroupDto) {
        await sql`INSERT INTO groups (group_name) VALUES (${group.group_name})`;
    }




}