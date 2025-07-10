import { GroupMemberRepository } from "../repository/groupMemberRepository";
import { UserRepository } from "../repository/userRepository";
import { GroupRepository } from "../repository/groupRepository";
import { GroupException } from "../exceptions/groupException";
import { GroupMemberCreateDto, GroupMemberDto } from "../dto/GroupMemberDto";
import { MemberRole } from "../models/groupMemberModel";
import { UserModel } from "../models/userModel";
import { GroupModel } from "../models/groupModel";

export class GroupMemberService {
    private groupMemeberRepository = new GroupMemberRepository();
    private userRepository = new UserRepository();
    private groupRepository = new GroupRepository();

    async addMember(group_create_info: GroupMemberCreateDto) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(group_create_info.username.trim().toLowerCase());
        const group: GroupModel | null = await this.groupRepository.findGroupByName(group_create_info.group_name);

        if (user && group) {
            const groupMember: GroupMemberDto = {
                group_id: group.group_id,
                user_id: user.user_id,
                join_date: new Date(),
                member_role: MemberRole.MEMBER
            }
            await this.groupMemeberRepository.addMember(groupMember);
        } else {
            throw new GroupException("User or group not found ");
        }
    }

    async removeMember(group_create_info: GroupMemberCreateDto) {
        const user: UserModel | null = await this.userRepository.findUserByUsername(group_create_info.username.trim().toLowerCase());
        const group: GroupModel | null = await this.groupRepository.findGroupByName(group_create_info.group_name);

        if (user && group) {
            await this.groupMemeberRepository.removeGroupMember(user, group);
        } else {
            throw new GroupException("User or group not found ");
        }
    }
}